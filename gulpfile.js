'use strict';

/**
 * Dependencies
 */
var fs = require('fs');
var gulp = require('gulp');
var git = require('gulp-git');
var bump = require('gulp-bump');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var cached = require('gulp-cached');
var jasmine = require('gulp-jasmine');
var stylish = require('gulp-jscs-stylish');
var Jasminereporter = require('jasmine-spec-reporter');

/**
 * Package
 */
var pkg = require('./package.json');
var noop = function() {};
var sources = [
  'src/env.js',
  'src/config.js',
  'src/gulpfile.js',
  'src/karma.conf.js',
  'src/env/**/*.js',
  'src/client/**/*.js',
  'src/server/**/*.js',
  '!src/client/vendor/**/*.js'
];

/*****************************************************************************
 * Helpers
 ***/

/**
 * Get package JSON directly from file system
 */
function packageJson() {
  return (pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8')));
}

/*****************************************************************************
 * Lint and test
 ***/

/**
 * Lint
 */
function lint() {
  return gulp.src(sources).pipe(cached('lint'))
    .pipe(jshint())
    .pipe(jscs())
    .on('error', noop)
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'));
}

/**
 * Run unit tests
 */
function test() {
  return gulp.src([
    'tests/**/*.spec.js'
  ]).pipe(jasmine({
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
 * Commit the version bump
 */
function commitBump() {
  return gulp.src([
    './package.json',
    './bower.json'
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
 * CLI exposed tasks
 ***/


/**
 * Run code linting
 */
gulp.task('lint', lint);
gulp.task('test', test);

/**
 * Bump version numbers
 */
gulp.task('patch', gulp.series(
  patchBump, commitBump, tagBump
));
gulp.task('minor', gulp.series(
  minorBump, commitBump, tagBump
));
gulp.task('major', gulp.series(
  majorBump, commitBump, tagBump
));

/**
 * Default task
 */
gulp.task('default', gulp.series(
  'lint', 'test'
));
