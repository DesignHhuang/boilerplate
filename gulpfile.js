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
var addsrc = require('gulp-add-src');
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
var env = null;

//TODO
//csslint, environment

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
  return gulp.src([
    'client/app/**/*.js',
    'client/common/**/*.js'
  ]);
}

/**
 * Templates JS module stream
 */
function jsTemplatesStream() {
  return gulp.src([
    'client/app/**/*.html',
    'client/common/**/*.html'
  ]).pipe(angularTemplateCache({
    module: 'Templates',
    standalone: true
  }));
}

/**
 * Vendor JS files stream
 */
function jsVendorStream() {
  return gulp.src([

  ]);
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
  return gulp.src('client/static/**/*')
    .pipe(ignore('*.md'))
    .pipe(gulp.dest('public'));
});

/**
 * Process application SASS files
 *
 * Uses the main application SASS file as entry point.
 * You can import any other SASS files from within this file.
 */
gulp.task('sass', function() {
  return gulp.src('client/app/app.scss')
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
 *
 * Does not take file order into account, so make sure every file is
 * it's own Angular module. For examples, see the client/app folder.
 */
gulp.task('js', function() {
  return es.merge(jsAppStream(), jsTemplatesStream())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(ngAnnotate())
    .pipe(sourcemaps.init())                        //Initialize source mapping
      .pipe(concat(packageFileName('.min.js')))     //Concatenate to one file
      .pipe(uglify())                               //Minify jS
    .pipe(sourcemaps.write('./'))                   //Write source map file
    .pipe(gulp.dest('public/js'));                  //Save to public folder
});

/**
 * Build index.html file
 */
gulp.task('index', ['sass', 'js'], function() {

  //Read sources
  var sources = gulp.src([
    'js/**/*.js',
    'css/**/*.css'
  ], {
    cwd: 'public',
    read: false
  });

  //Run task
  gulp.src('public/index.html')
    .pipe(inject(sources, {         //Inject the sources
      addRootSlash: false
    }))
    .pipe(preprocess())
    .pipe(removeHtmlComments())     //Remove HTML comments
    .pipe(removeEmptyLines())       //Remove empty lines left by comments etc.
    .pipe(gulp.dest('public'));     //Output to public folder
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
  watch([
    'client/app/**/*.js',
    'client/common/**/*.js',
    'client/app/**/*.html',
    'client/common/**/*.html'
  ], batch(function(events, done) {
    gulp.start('js', done);
  }));

  //Watch SASS files
  watch('client/app/**/*.scss', batch(function(events, done) {
    gulp.start('sass', done);
  }));
});

/**
 * Default task
 */
gulp.task('default', ['build']);
