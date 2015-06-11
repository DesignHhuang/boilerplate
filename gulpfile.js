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

//DEV:
//Compile SCSS into CSS
//Auto prefix CSS
//Output as single file

//PROD:
//
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
gulp.task('copy:assets', ['clean:public'], function() {
  gulp.src('client/assets/**/*')
    .pipe(ignore('*.md'))
    .pipe(gulp.dest('./public'));
});

/**
 * Compile SASS files
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
 * Build task
 */
gulp.task('build', ['copy:assets', 'sass']);

/**
 * Default task
 */
gulp.task('default', ['build']);
