'use strict';

/**
 * Dependencies
 */
var es = require('event-stream');
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var inject = require('gulp-inject');
var ignore = require('gulp-ignore');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var cached = require('gulp-cached');
var addsrc = require('gulp-add-src');
var wrapper = require('gulp-wrapper');
var stylish = require('jshint-stylish');
var sourcemaps = require('gulp-sourcemaps');
var preprocess = require('gulp-preprocess');
var ngAnnotate = require('gulp-ng-annotate');
var autoprefixer = require('gulp-autoprefixer');
var removeEmptyLines = require('gulp-remove-empty-lines');
var removeHtmlComments = require('gulp-remove-html-comments');
var angularTemplateCache = require('gulp-angular-templatecache');

/**
 * Package and environment
 */
var pkg = require('./package.json');
var env = require('./env');
var config = require('./config');

/**
 * TODO
 *  - SCSS linting: gulp-scss-lint requires ruby, need a gulp task without this
 *    dependency.
 *  - Expose configuration and environment in Angular APP (MyApp.Env module)
 *  - Preprocessing
 */

/*****************************************************************************
 * Helpers
 ***/

/**
 * Get package file name
 */
function packageFileName(ext) {
  return pkg.name.toLowerCase() + '-' + pkg.version + (ext || '');
}

/**
 * Application JS files stream
 */
function jsAppStream() {
  return gulp.src(config.assets.app.js);
}

/**
 * Test JS files stream
 */
function jsTestStream() {
  return gulp.src(config.assets.app.tests);
}

/**
 * Templates JS module stream
 */
function jsTemplatesStream() {
  return gulp.src(config.assets.app.html)
    .pipe(angularTemplateCache({
      module: 'Templates',
      standalone: true
    }));
}

/**
 * Vendor JS files stream
 */
function jsVendorStream() {
  return gulp.src(config.assets.vendor.js);
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

/*****************************************************************************
 * Tasks
 ***/

/**
 * Clean public folder
 */
gulp.task('clean:public', function(callback) {
  return del([
    'public/**/*',
    '!public/js',
    '!public/css'
  ], callback);
});

/**
 * Copy static client assets
 */
gulp.task('static', ['clean:public'], function() {
  return gulp.src(config.assets.app.static)
    .pipe(gulp.dest('public'));
});

/**
 * Process application SASS files
 */
gulp.task('sass', function() {
  return gulp.src(config.assets.app.scss)
    .pipe(sass().on('error', sass.logError))        //Compile into CSS
    .pipe(sourcemaps.init())                        //Initialize source mapping
      .pipe(autoprefixer({                          //Use auto prefixer
         browsers: ['last 2 versions']
       }))
       .pipe(csso())                                //Optimize and minify CSS
       .pipe(rename(packageFileName('.min.css')))   //Rename output file
    .pipe(sourcemaps.write('./'))                   //Write source map file
    .pipe(gulp.dest('public/css'));                 //Save to public folder
});

/**
 * Process application JS files
 */
gulp.task('js', function() {
  return es.merge(jsAppStream(), jsTemplatesStream())
    .pipe(ngAnnotate())
    .pipe(sourcemaps.init())                        //Initialize source mapping
      .pipe(concat(packageFileName('.min.js')))     //Concatenate to one file
      .pipe(wrapper(angularWrapper()))              //Create wrapper
      .pipe(uglify())                               //Minify jS
    .pipe(sourcemaps.write('./'))                   //Write source map file
    .pipe(gulp.dest('public/js'));                  //Save to public folder
});

/**
 * Process vendor javascript files
 */
gulp.task('vendor:js', function() {
  return gulp.src(config.assets.vendor.js)
    .pipe(sourcemaps.init())                        //Initialize source mapping
      .pipe(concat('vendor.min.js'))                //Concatenate to one file
      .pipe(uglify())                               //Minify jS
    .pipe(sourcemaps.write('./'))                   //Write source map file
    .pipe(gulp.dest('public/js'));                  //Save to public folder
});

/**
 * Process vendor CSS files
 */
gulp.task('vendor:css', function() {
  return gulp.src(config.assets.vendor.css)
    .pipe(sourcemaps.init())                        //Initialize source mapping
       .pipe(csso())                                //Optimize and minify CSS
       .pipe(rename('vendor.min.css'))              //Rename output file
    .pipe(sourcemaps.write('./'))                   //Write source map file
    .pipe(gulp.dest('public/css'));                 //Save to public folder
});

/**
 * Combined vendor task
 */
gulp.task('vendor', ['vendor:js', 'vendor:css']);

/**
 * Build index.html file
 */
gulp.task('index', ['vendor', 'js', 'sass'], function() {

  //Read sources (in correct order)
  var sources = gulp.src([
    'js/vendor.min.js',
    'js/**/*.js',
    'js/' + packageFileName('.min.js'),
    'css/vendor.min.css',
    'css/**/*.css',
    'css/' + packageFileName('.min.css')
  ], {
    cwd: 'public',
    read: false
  });

  //Run task
  gulp.src('public/index.html')
    .pipe(inject(sources, {         //Inject the sources
      addRootSlash: false
    }))
    .pipe(preprocess())             //Preprocess
    .pipe(removeHtmlComments())     //Remove HTML comments
    .pipe(removeEmptyLines())       //Remove empty lines left by comments etc.
    .pipe(gulp.dest('public'));     //Output to public folder
});

/**
 * JS linting
 */
gulp.task('jslint', function() {
  return es.merge(jsAppStream(), jsTestStream())
    .pipe(cached('jslint'))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

/**
 * Build task
 */
gulp.task('build', ['static', 'index']);

/**
 * Watch task
 */
gulp.task('watch', function() {

  //Watch JS/HTML files
  watch(config.assets.watch.js, batch(function(events, done) {
    gulp.start('jslint', done);
    gulp.start('js', done);
  }));

  //Watch SASS files
  watch(config.assets.watch.scss, batch(function(events, done) {
    gulp.start('sass', done);
  }));
});

/**
 * Default task
 */
gulp.task('default', ['build']);
