/* jscs: disable requireCamelCaseOrUpperCaseIdentifiers */
'use strict';

/**
 * Dependencies
 */
var fs = require('fs');
var del = require('del');
var ncp = require('ncp');
var path = require('path');
var gulp = require('gulp');
var async = require('async');
var karma = require('karma');
var git = require('gulp-git');
var bump = require('gulp-bump');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var jscs = require('gulp-jscs');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var cached = require('gulp-cached');
var filter = require('gulp-filter');
var replace = require('gulp-replace');
var wrapper = require('gulp-wrapper');
var nodemon = require('gulp-nodemon');
var jasmine = require('gulp-jasmine');
var vinylBuffer = require('vinyl-buffer');
var mergeStream = require('merge-stream');
var injectInHtml = require('gulp-inject');
var stylish = require('gulp-jscs-stylish');
// var typescript = require('gulp-typescript');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var preprocess = require('gulp-preprocess');
var ngAnnotate = require('gulp-ng-annotate');
var ngConstant = require('gulp-ng-constant');
var autoprefixer = require('gulp-autoprefixer');
var Jasminereporter = require('jasmine-spec-reporter');
var vinylSourceStream = require('vinyl-source-stream');
var removeEmptyLines = require('gulp-remove-empty-lines');
var removeHtmlComments = require('gulp-remove-html-comments');
var angularTemplateCache = require('gulp-angular-templatecache');

/**
 * Package and configuration
 */
var pkg = require('./package.json');
var env = require('./env')();
var config = require('./config');
var noop = function() {};

/**
 * Helper vars
 */
var isWin = /^win/.test(process.platform);
var isDeploying = false;
var destination = config.paths.public;
var watchDebounceDelay = 2000;

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
function packageFileName(filename, ext) {
  if (!ext) {
    ext = filename;
    filename = pkg.name.toLowerCase();
  }
  return filename + '-' + pkg.version + (ext || '');
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
    header: '(function(window, angular, undefined) {\n  \'use strict\';\n',
    footer: '\n})(window, window.angular);\n'
  };
}

/**
 * Generate banner wrapper for compiled files
 */
function bannerWrapper() {

  //Get date and author
  var today = new Date();
  var date = today.getDate() + '-' + today.getMonth() + '-' + today.getFullYear();
  var author = pkg.author.name + ' <' + pkg.author.email + '>';

  //Format banner
  var banner =
    '/**\n' +
    ' * ' + pkg.name + ' - v' + pkg.version + ' - ' + date + '\n' +
    ' * ' + pkg.homepage + '\n' +
    ' *\n' +
    ' * Copyright (c) ' + today.getFullYear() + ' ' + author + '\n' +
    ' */\n';

  //Return wrapper
  return {
    header: banner,
    footer: ''
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
  var fileName = 'app.env.js';
  var stream = vinylSourceStream(fileName);
  stream.write(JSON.stringify({}));

  //Turn into angular constant module JS file
  return stream
    .pipe(vinylBuffer())
    .pipe(ngConstant({
      name: angularModuleName('Env'),
      stream: true,
      constants: {
        Env: {
          name: env,
          isDevelopment: env !== 'production',
          isProduction: env === 'production'
        },
        App: config.app
      }
    }))
    .pipe(rename(fileName));
}

/**
 * Helper to merge sources
 */
function mergeSources() {
  var sources = arguments;
  var merged = [];
  for (var s = 0; s < sources.length; s++) {
    if (sources[s]) {
      if (Array.isArray(sources[s])) {
        merged = merged.concat(merged, sources[s]);
      }
      else if (typeof sources[s] === 'string') {
        merged.push(sources[s]);
      }
    }
  }
  return merged;
}

/*****************************************************************************
 * Deployers
 ***/

/**
 * Initialize deployment
 */
function initDeployment() {
  isDeploying = true;
  destination = path.join(config.paths.deploy, destination);
  return del(config.paths.deploy);
}

/**
 * Copy deploy assets
 */
function copyDeployAssets(done) {

  //Stuff to copy
  var toCopy = [
    config.paths.server,
    config.paths.env,
    'assets.json',
    'package.json',
    'config.js',
    'env.js',
    'LICENSE.md',
    'README.md',
    '.modulusignore'
  ];

  //Create tasks for stuff to copy
  var tasks = [];
  toCopy.forEach(function(source) {
    tasks.push(function(cb) {
      ncp(source, path.join(config.paths.deploy, source), cb);
    });
  });

  //Run tasks in parallel
  return async.parallel(tasks, done);
}

/**
 * Deploy on modulus
 */
function deployOnModulus(done) {

  //Prepare
  var exec = require('child_process').exec;
  var modulusPath = isWin ? 'modulus' : path.relative(
    process.cwd(), path.join(__dirname, '../', 'node_modules', 'modulus', 'bin', 'modulus')
  );

  //Spawn child process (TODO: project should be depending on what kind of deploy is done)
  var child = exec(modulusPath + ' deploy -p ' + pkg.name, {
    cwd: path.resolve(config.paths.deploy)
  }, function(err) {
    done(err);
  });

  //Pipe output
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}

/*****************************************************************************
 * Builders
 ***/

/**
 * Clean the public folder
 */
function clean() {
  return del(destination);
}

/**
 * Build (copy) static client assets
 */
function buildStatic() {
  return gulp.src(config.assets.client.static)
    .pipe(gulp.dest(destination));
}

/**
 * Build application JS files
 */
function buildAppJs() {

  //Create stream
  var stream = mergeStream(
    gulp.src(config.assets.client.js.app),
    templatesStream(),
    environmentStream()
  ).pipe(ngAnnotate())
   .pipe(wrapper(angularWrapper()));

  //Deploying? Don't create source maps
  if (isDeploying) {
    stream = stream
      .pipe(babel({
        //https://babeljs.io/docs/usage/options/
        nonStandard: false,
        compact: false
      }))
      // .pipe(typescript({
      //   noImplicitAny: true
      // }))
      .pipe(concat(packageFileName('.min.js')))
      .pipe(uglify())
      .pipe(wrapper(bannerWrapper()));
  }

  //Minifying?
  else if (config.build.app.js.minify) {
    var mapFilter = filter(['!*.map']);
    stream = stream
      .pipe(sourcemaps.init())
        .pipe(babel({
          nonStandard: false,
          compact: false
        }))
        // .pipe(typescript({
        //   noImplicitAny: true
        // }))
        .pipe(concat(packageFileName('.min.js')))
        .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(mapFilter)
      .pipe(wrapper(bannerWrapper()))
      .pipe(mapFilter.restore());
  }

  //Write to public folder and return
  return stream.pipe(gulp.dest(destination + '/js'));
}

/**
 * Build application SCSS files
 */
function buildAppScss() {

  //Create stream
  var stream = gulp.src(config.assets.client.scss.main)
    .pipe(sass().on('error', sass.logError));

  //Minifying?
  if (isDeploying || config.build.app.css.minify) {
    stream = stream
      .pipe(sourcemaps.init())
        .pipe(autoprefixer({
           browsers: ['last 2 versions']
         }))
         .pipe(csso())
         .pipe(rename(packageFileName('.min.css')))
      .pipe(sourcemaps.write('./'));
  }

  //Write to public folder and return
  return stream
    .pipe(gulp.dest(destination + '/css'))
    .pipe(livereload());
}

/**
 * Build vendor javascript files
 */
function buildVendorJs() {

  //Create stream
  var stream = gulp.src(mergeSources(
    config.assets.client.js.vendor,
    './node_modules/babel-core/browser-polyfill.js'
  ));
  var dest = destination + '/js';

  //Deploying? Don't create source maps
  if (isDeploying) {
    stream = stream
      .pipe(concat(packageFileName('vendor', '.min.js')))
      .pipe(uglify());
  }

  //Minifying?
  else if (config.build.vendor.js.minify) {
    stream = stream
      .pipe(sourcemaps.init())
        .pipe(concat(packageFileName('vendor', '.min.js')))
        .pipe(uglify())
      .pipe(sourcemaps.write('./'));
  }

  //Otherwise dump in vendor folder
  else {
    dest += '/vendor';
  }

  //Write to public folder and return
  return stream.pipe(gulp.dest(dest));
}

/**
 * Process vendor CSS files
 */
function buildVendorCss(done) {

  //No CSS?
  if (!config.assets.client.css.vendor.length) {
    return done();
  }

  //Get stream
  var stream = gulp.src(config.assets.client.css.vendor);
  var dest = destination + '/css';

  //Minifying?
  if (isDeploying || config.build.vendor.css.minify) {
    stream = stream
      .pipe(sourcemaps.init())
        .pipe(concat(packageFileName('vendor', '.min.css')))
        .pipe(csso())
      .pipe(sourcemaps.write('./'));
  }
  else {
    dest += '/vendor';
  }

  //Write to public folder and return
  return stream
    .pipe(gulp.dest(dest))
    .pipe(livereload());
}

/**
 * Build index.html file
 */
function buildIndex() {

  //Prepare files in the correct order
  var files = [];

  //Minified vendor JS
  if (isDeploying || config.build.vendor.js.minify) {
    files.push('js/' + packageFileName('vendor', '.min.js'));
  }
  else {
    files.push('js/vendor/**/*.js');
  }

  //All other javascript
  files.push('js/**/*.js');

  //Minified app JS
  if (isDeploying || config.build.app.js.minify) {
    files.push('js/' + packageFileName('.min.js'));
  }

  //Minified vendor CSS
  if (config.assets.client.css.vendor.length > 0) {
    if (isDeploying || config.build.vendor.css.minify) {
      files.push('css/' + packageFileName('vendor', '.min.css'));
    }
    else {
      files.push('css/vendor/**/*.css');
    }
  }

  //All other css
  files.push('css/**/*.css');

  //Minified app CSS
  if (isDeploying || config.build.app.css.minify) {
    files.push('css/' + packageFileName('.min.css'));
  }

  //Read sources
  var sources = gulp.src(files, {
    cwd: destination,
    read: false
  });

  //Run task
  return gulp.src(config.assets.client.index)
    .pipe(injectInHtml(sources, {
      addRootSlash: false
    }))
    .pipe(preprocess({
      context: {
        ENV: env,
        APP: config.app
      }
    }))
    .pipe(removeHtmlComments())
    .pipe(removeEmptyLines())
    .pipe(gulp.dest(destination))
    .pipe(livereload());
}

/*****************************************************************************
 * Linters
 ***/

/**
 * Lint all code at once
 */
function lintCode() {
  return gulp.src(mergeSources(
    config.assets.env.js,
    config.assets.client.js.app,
    config.assets.client.js.tests,
    config.assets.server.js.app,
    config.assets.server.js.tests
  )).pipe(cached('lintAll'))
    .pipe(jshint())
    .pipe(jscs())
    .on('error', noop)
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'));
}

/**
 * Lint only client code
 */
function lintClientCode() {
  return gulp.src(mergeSources(
    config.assets.client.js.app,
    config.assets.client.js.tests
  )).pipe(cached('lintClient'))
    .pipe(jshint())
    .pipe(jscs())
    .on('error', noop)
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'));
}

/**
 * Lint only server code
 */
function lintServerCode() {
  return gulp.src(mergeSources(
    config.assets.server.js.app,
    config.assets.server.js.tests
  )).pipe(cached('lintServer'))
    .pipe(jshint())
    .pipe(jscs())
    .on('error', noop)
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'));
}

/*****************************************************************************
 * Testers
 ***/

/**
 * Run client side unit tests
 */
function testClientCode(done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    files: mergeSources(
      config.assets.client.js.vendor,
      config.assets.client.js.karma,
      config.assets.client.js.app,
      config.assets.client.js.tests
    )
  }, done).start();
}

/**
 * Run server side unit tests
 */
function testServerCode() {
  return gulp.src(config.assets.server.js.tests)
    .pipe(jasmine({
      reporter: new Jasminereporter()
    }));
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
  ]).pipe(replace(
    /([0-9]\.[0-9]+\.[0-9]+)/g, packageJson().version
  )).pipe(gulp.dest('./'));
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
function tagBump(cb) {
  var version = packageJson().version;
  git.checkout('master', function(error) {
    if (error) {
      return cb(error);
    }
    git.tag(version, 'Tag version ' + version, function(error) {
      if (error) {
        return cb(error);
      }
      git.push('origin', 'master', {
        args: '--tags'
      }, cb);
    });
  });
}

/*****************************************************************************
 * Watchers
 ***/

/**
 * Watch client side code
 */
function watchClientCode() {
  gulp.watch(mergeSources(
    config.assets.client.js.app,
    config.assets.client.html
  ), {
    debounceDelay: watchDebounceDelay
  }, gulp.series(lintCode, testClientCode, buildAppJs, buildIndex));
}

/**
 * Watch server side code
 */
function watchServerCode() {
  gulp.watch(config.assets.server.js.app, {
    debounceDelay: watchDebounceDelay
  }, gulp.series(lintCode));
}

/**
 * Watch client side tests
 */
function watchClientTests() {
  gulp.watch(config.assets.client.js.tests, {
    debounceDelay: watchDebounceDelay
  }, gulp.series(lintCode, testClientCode));
}

/**
 * Watch server side tests
 */
function watchServerTests() {
  gulp.watch(config.assets.server.js.tests, {
    debounceDelay: watchDebounceDelay
  }, gulp.series(lintCode));
}

/**
 * Watch vendor code
 */
function watchVendorCode() {
  gulp.watch(config.assets.client.js.vendor, {
    debounceDelay: watchDebounceDelay
  }, gulp.series(buildVendorJs, buildIndex));
}

/**
 * Watch styles
 */
function watchStyles() {
  gulp.watch(config.assets.client.scss.app, {
    debounceDelay: watchDebounceDelay
  }, gulp.series(buildAppScss));
}

/**
 * Watch static files
 */
function watchStatic() {
  gulp.watch(config.assets.client.static, {
    debounceDelay: watchDebounceDelay
  }, gulp.series(buildStatic));
}

/**
 * Watch index HTML file
 */
function watchIndex() {
  gulp.watch(config.assets.client.index, gulp.series(buildIndex));
}

/**
 * Watch environment files
 */
function watchEnv() {
  gulp.watch(config.assets.env.js, gulp.series(lintCode, testClientCode, buildAppJs, buildIndex));
}

/*****************************************************************************
 * Starters
 ***/

/**
 * Start nodemon
 */
function startNodemon() {
  nodemon({
    script: 'server/server.js'
  });
}

/**
 * Start live reload
 */
function startLiveReload() {
  livereload.listen();
}

/*****************************************************************************
 * CLI exposed tasks
 ***/

/**
 * Build the application
 */
gulp.task('build', gulp.series(
  clean,
  gulp.parallel(
    buildStatic,
    buildAppJs, buildAppScss,
    buildVendorJs, buildVendorCss
  ),
  buildIndex
));

/**
 * Build for deployment
 */
gulp.task('deploy', gulp.series(
  initDeployment, 'build', copyDeployAssets, deployOnModulus
));

/**
 * Start server
 */
gulp.task('start', startNodemon);

/**
 * Watch files for changes
 */
gulp.task('watch', gulp.parallel(
  watchClientCode, watchServerCode,
  watchClientTests, watchServerTests,
  watchVendorCode, watchIndex,
  watchStyles, watchStatic, watchEnv,
  startLiveReload
));

/**
 * Run code linting
 */
gulp.task('lint', lintCode);
gulp.task('lint-server', lintServerCode);
gulp.task('lint-client', lintClientCode);

/**
 * Run tests
 */
gulp.task('test', gulp.series(
  testServerCode, testClientCode
));
gulp.task('test-server', testServerCode);
gulp.task('test-client', testClientCode);

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
  gulp.parallel('lint', 'test'), 'build', gulp.parallel('watch', 'start')
));

/**
 * Helper tasks accessible via CLI
 */
gulp.task('clean', clean);
gulp.task('static', buildStatic);
