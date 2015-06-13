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
var wrapper = require('gulp-wrapper');
var nodemon = require('gulp-nodemon');
var stylish = require('jshint-stylish');
var vinylBuffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var preprocess = require('gulp-preprocess');
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

/**
 * Paths
 */
var paths = {
  public: 'public'
};

/**
 * TODO
 *  - SCSS linting: gulp-scss-lint requires ruby, need a gulp task without this
 *    dependency.
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
 * Exposed tasks for CLI
 ***/

/**
 * Build the application
 */
gulp.task('build', gulp.series(
  clean,
  gulp.parallel(static, app, vendor),
  index
));

/**
 * Clean the public folder
 */
gulp.task(clean);

/*****************************************************************************
 * Task functions
 ***/

/**
 * Clean the public folder
 */
function clean(done) {
  del(paths.public, done);
}

/**
 * Copy static client assets
 */
function static() {
  return gulp.src(config.assets.client.static)
    .pipe(gulp.dest('public'));
}

/**
 * Build application SCSS files
 */
gulp.task('app:scss', function() {
  return gulp.src(config.assets.client.scss.app)
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
 * Build application JS files
 */
gulp.task('app:js', function() {
  return es.merge(
    gulp.src(config.assets.client.js.app),
    templatesStream(),
    environmentStream()
  )
    .pipe(ngAnnotate())                             //Annotate module dependencies
    .pipe(sourcemaps.init())                        //Initialize source mapping
      .pipe(concat(packageFileName('.min.js')))     //Concatenate to one file
      .pipe(wrapper(angularWrapper()))              //Create wrapper
      .pipe(uglify())                               //Minify jS
    .pipe(sourcemaps.write('./'))                   //Write source map file
    .pipe(gulp.dest('public/js'));                  //Save to public folder
});

/**
 * Build vendor javascript files
 */
gulp.task('vendor:js', function() {
  return gulp.src(config.assets.client.js.vendor)
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
  return gulp.src(config.assets.client.css.vendor)
    .pipe(sourcemaps.init())                        //Initialize source mapping
       .pipe(csso())                                //Optimize and minify CSS
       .pipe(rename('vendor.min.css'))              //Rename output file
    .pipe(sourcemaps.write('./'))                   //Write source map file
    .pipe(gulp.dest('public/css'));                 //Save to public folder
});

/**
 * Combined app/vendor build tasks
 */
gulp.task('app', function() {
  return gulp.start('app:js', 'app:scss');
});
gulp.task('vendor', function() {
  return gulp.start('vendor:js', 'vendor:css');
});

/**
 * Build index.html file
 */
gulp.task('index', ['app', 'vendor'], function() {

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
  return gulp.src('public/index.html')
    .pipe(inject(sources, {         //Inject the sources
      addRootSlash: false
    }))
    .pipe(preprocess())             //Preprocess
    .pipe(removeHtmlComments())     //Remove HTML comments
    .pipe(removeEmptyLines())       //Remove empty lines left by comments etc.
    .pipe(gulp.dest('public'));     //Output to public folder
});

/*****************************************************************************
 * Linting tasks
 ***/

/**
 * JS linting
 */
gulp.task('jslint', function() {
  return es.merge(
    gulp.src(config.assets.client.js),
    gulp.src(config.assets.client.test),
    gulp.src(config.assets.server.js)
  )
    .pipe(cached('jslint'))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

/*****************************************************************************
 * Run & watch tasks
 ***/

/**
 * Start nodemon
 */
gulp.task('start', function () {
  nodemon({
    script: 'main.js'
  });
});

/**
 * Watch task
 */
gulp.task('watch', ['build'], function() {

  //Watch static assets
  watch(config.assets.client.static, batch(function(events, done) {
    gulp.start('static', done);
  }));

  //Watch server JS files (these only need to be linted)
  watch(config.assets.watch.server.js, batch(function(events, done) {
    gulp.start('jslint', done);
  }));

  //Watch client JS/HTML files (these need linting and compiling)
  watch(config.assets.watch.client.js, batch(function(events, done) {
    gulp.start('jslint', done);
    gulp.start('js', done);
  }));

  //Watch SASS files
  watch(config.assets.watch.client.scss, batch(function(events, done) {
    gulp.start('sass', done);
  }));
});

/**
 * Default task
 */
gulp.task('default', ['build', 'watch', 'start']);
