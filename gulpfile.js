'use strict';

/**
 * Dependencies
 */
var gulp = require('gulp');
var ignore = require('gulp-ignore');
var sass = require('gulp-sass');
var del = require('del');

/**
 * Needed tasks
 */

//COPY client/assets

//DEV:
//Compile SCSS into CSS
//Auto prefix CSS
//Output as single file

//PROD:
//Minify CSS

/**
 * Clean public folder
 */
gulp.task('clean:public', function(callback) {
  del(['public/**/*'], callback);
});

/**
 * Copy client assets
 */
gulp.task('assets', ['clean:public'], function() {
  gulp.src('client/assets/**/*')
    .pipe(ignore('*.md'))
    .pipe(gulp.dest('./public'));
});

/**
 * SASS
 */
gulp.task('sass', function () {
  gulp.src('./client/app/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});
gulp.task('sass:watch', function () {
  gulp.watch('./client/app/**/*.scss', ['sass']);
});

/**
 * Build
 */
gulp.task('build', ['assets', 'sass']);

/**
 * Default task
 */
gulp.task('default', function() {

});
