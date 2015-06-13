'use strict';

/**
 * Dependencies
 */
var fs = require('fs');
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var git = require('gulp-git');
var bump = require('gulp-bump');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var es = require('event-stream');
var batch = require('gulp-batch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var inject = require('gulp-inject');
var ignore = require('gulp-ignore');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var cached = require('gulp-cached');
var replace = require('gulp-replace');
var wrapper = require('gulp-wrapper');
var nodemon = require('gulp-nodemon');
var stylish = require('jshint-stylish');
var vinylBuffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var preprocess = require('gulp-preprocess');
var tagVersion = require('gulp-tag-version');
var ngAnnotate = require('gulp-ng-annotate');
var ngConstant = require('gulp-ng-constant');
var autoprefixer = require('gulp-autoprefixer');
var vinylSourceStream = require('vinyl-source-stream');
var removeEmptyLines = require('gulp-remove-empty-lines');
var removeHtmlComments = require('gulp-remove-html-comments');
var angularTemplateCache = require('gulp-angular-templatecache');

/**
 * Package and environment
 */
var pkg = require('./package.json');
var env = require('./env');
var config = require('./config');

/*****************************************************************************
 * CLI exposed tasks
 ***/

/**
 * Build the application
 */
gulp.task('build', gulp.series(
  gulp.parallel(
    clean, lintCode
  ),
  gulp.parallel(
    buildStatic,
    buildAppJs, buildAppScss,
    buildVendorJs, buildVendorCss
  ),
  buildIndex
));

/**
 * Start nodemon
 */
gulp.task('start', function () {
  nodemon({
    script: 'main.js'
  });
});

/**
 * Watch files for changes
 */
gulp.task('watch', gulp.parallel(
  watchClientCode, watchServerCode,
  watchClientTests, watchServerTests,
  watchStyles, watchStatic
));

/**
 * Bump version numbers
 */
gulp.task('patch', gulp.series(
  patchBump, updateReadmeVersion, commitBump, tagBump
));
gulp.task('minor', gulp.series(
  minorBump, updateReadmeVersion, commitBump, tagBump
));
gulp.task('major', gulp.series(
  majorBump, updateReadmeVersion, commitBump, tagBump
));

/**
 * Default task
 */
gulp.task('default', gulp.series(
  'build', gulp.parallel('watch', 'start')
));

/**
 * CLI accessible helper tasks
 */
gulp.task('clean', clean);
gulp.task('static', buildStatic);

/*****************************************************************************
 * Helpers
 ***/

/**
 * Get package JSON directly from file system
 */
function packageJson() {
  return (pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8')));
}

/**
 * Get package file name
 */
function packageFileName(ext) {
  return pkg.name.toLowerCase() + '-' + pkg.version + (ext || '');
}

/**
 * Get prefixed Angular module name
 */
function angularModuleName(module) {
  return 'App.' + module;
}

/**
 * Generate angular wrapper for module files
 */
function angularWrapper() {
  return {
     header: '(function (window, angular, undefined) {\n\t\'use strict\';\n',
     footer: '})(window, window.angular);\n'
  };
}

/**
 * Templates module stream
 */
function templatesStream() {
  return gulp.src(config.assets.client.html)
    .pipe(angularTemplateCache({
      module: angularModuleName('Templates'),
      standalone: true
    }));
}

/**
 * Environment module stream
 */
function environmentStream() {

  //Create new stream and write config object as JSON string
  var stream = vinylSourceStream('app.env.js');
  stream.write(JSON.stringify({}));
  stream.on('finish', function() {
    stream.end();
  });

  //Turn into angular constant module JS file
  return stream
    .pipe(vinylBuffer())
    .pipe(ngConstant({
      name: angularModuleName('Env'),
      stream: true,
      constants: {
        App: config.app
      }
    }));
}

/*****************************************************************************
 * Builders
 ***/

/**
 * Clean the public folder
 */
function clean(done) {
  del(config.paths.public, done);
}

/**
 * Build (copy) static client assets
 */
function buildStatic() {
  return gulp.src(config.assets.client.static)
    .pipe(gulp.dest(config.paths.public));
}

/**
 * Build application JS files
 */
function buildAppJs() {
  return es.merge(
    gulp.src(config.assets.client.js.app),
    templatesStream(),
    environmentStream()
  )
    .pipe(ngAnnotate())
    .pipe(sourcemaps.init())
      .pipe(concat(packageFileName('.min.js')))
      .pipe(wrapper(angularWrapper()))
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.paths.public + '/js'));
}

/**
 * Build application SCSS files
 */
function buildAppScss() {
  return gulp.src(config.assets.client.scss.main)
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
      .pipe(autoprefixer({
         browsers: ['last 2 versions']
       }))
       .pipe(csso())
       .pipe(rename(packageFileName('.min.css')))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.paths.public + '/css'));
}

/**
 * Build vendor javascript files
 */
function buildVendorJs() {
  return gulp.src(config.assets.client.js.vendor)
    .pipe(sourcemaps.init())
      .pipe(concat('vendor.min.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.paths.public + '/js'));
}

/**
 * Process vendor CSS files
 */
function buildVendorCss() {
  return gulp.src(config.assets.client.css.vendor)
    .pipe(sourcemaps.init())
       .pipe(csso())
       .pipe(rename('vendor.min.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.paths.public + '/css'));
}

/**
 * Build index.html file
 */
function buildIndex() {

  //Read sources (in correct order)
  var sources = gulp.src([
    'js/vendor.min.js',
    'js/**/*.js',
    'js/' + packageFileName('.min.js'),
    'css/vendor.min.css',
    'css/**/*.css',
    'css/' + packageFileName('.min.css')
  ], {
    cwd: config.paths.public,
    read: false
  });

  //Run task
  return gulp.src(config.paths.public + '/index.html')
    .pipe(inject(sources, {
      addRootSlash: false
    }))
    .pipe(preprocess())
    .pipe(removeHtmlComments())
    .pipe(removeEmptyLines())
    .pipe(gulp.dest(config.paths.public));
}

/*****************************************************************************
 * Linters
 ***/

/**
 * Code linting
 */
function lintCode() {
  return es.merge(
    gulp.src(config.assets.client.js.app),
    gulp.src(config.assets.client.js.tests),
    gulp.src(config.assets.server.js.app),
    gulp.src(config.assets.server.js.tests)
  )
    .pipe(cached('jslint'))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
}

/*****************************************************************************
 * Bumpers
 ***/

/**
 * Bump version number (patch)
 */
function patchBump() {
  return gulp.src([
    './package.json',
    './bower.json'
  ]).pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
}

/**
 * Bump version number (minor)
 */
function minorBump() {
  return gulp.src([
    './package.json',
    './bower.json'
  ]).pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
}

/**
 * Bump version number (major)
 */
function majorBump() {
  return gulp.src([
    './package.json',
    './bower.json'
  ]).pipe(bump({type: 'major'}))
    .pipe(gulp.dest('./'));
}

/**
 * Update version in readme
 */
function updateReadmeVersion() {
  return gulp.src([
    './README.md'
  ]).pipe(replace({
    /([0-9]\.[0-9]+\.[0-9]+)/g, packageJson().version
  })).pipe(gulp.dest('./'));
}

/**
 * Commit the version bump
 */
function commitBump() {
  return gulp.src([
    './package.json',
    './bower.json',
    './README.md'
  ]).pipe(git.commit('Bump version to ' + packageJson().version));
}

/**
 * Tag latest commit with current version
 */
function tagBump() {
  return gulp.src([
    './package.json'
  ]).pipe(tagVersion());
}

/*****************************************************************************
 * Watchers
 ***/

/**
 * Watch client side code
 */
function watchClientCode() {
  gulp.watch([
    config.assets.client.js.app,
    config.assets.client.html
  ], gulp.series(lintCode, buildAppJs, buildIndex));
}

/**
 * Watch server side code
 */
function watchServerCode() {
  gulp.watch([
    config.assets.server.js.app
  ], gulp.series(lintCode));
}

/**
 * Watch client side tests
 */
function watchClientTests() {
  gulp.watch([
    config.assets.client.js.tests
  ], gulp.series(lintCode));
}

/**
 * Watch server side tests
 */
function watchServerTests() {
  gulp.watch([
    config.assets.server.js.tests
  ], gulp.series(lintCode));
}

/**
 * Watch styles
 */
function watchStyles() {
  gulp.watch([
    config.assets.client.scss.app
  ], gulp.series(buildAppScss));
}

/**
 * Watch static files
 */
function watchStatic() {
  gulp.watch([
    config.assets.client.static
  ], gulp.series(buildStatic));
}
