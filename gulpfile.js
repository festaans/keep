var gulp = require('gulp');

var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var cdnizer = require("gulp-cdnizer");
var sass = require('gulp-sass');
var bower = require('gulp-bower');
//Bower
gulp.task('bower', function() {
  return bower()
});
//Servers
gulp.task('connectDev', function () {
  connect.server({
    root: 'dev',
    port: 8001,
    livereload: true
  });
});
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist',
    port: 8002,
    livereload: false
  });
});
//sass
//sass
gulp.task('sass', ['bower'], function () {
  gulp.src('./dev/resources/sass/app.scss')
  .pipe(sass())
  .pipe(gulp.dest('./dev/resources/styles/'))
  .pipe(connect.reload());
});
gulp.task('BuildCSS', ['bower'], function () {
  gulp.src('./dev/resources/sass/app.scss')
  .pipe(sass())
  .pipe(gulp.dest('./dist/resources/styles/'));
});
//watchDev
gulp.task('watchDev', function () {
  gulp.watch(['./dev/**/*.scss'], ['sass']);
  gulp.watch(['./dev/**/*.controller.js'], ['createAppJS']);
  gulp.watch(['./dev/**/*.factory.js'], ['createAppJS']);
  gulp.watch(['./dev/**/*.state.js'], ['createAppJS']);
  gulp.watch(['./dev/**/*.html'], ['reloadDev']);

  //gulp.watch(['./development/assets/javascript/**/*.js'], ['concat-scripts']);
  //gulp.watch(['./development/assets/images/**/*.{png,jpg,jpeg,gif}'], ['images']);
});

gulp.task('reloadDev', function () {
  gulp.src('./dev/index.html')
  .pipe(connect.reload());
});
//concat scripts
gulp.task('createAppJS', function() {
  gulp.src([
    './dev/**/app.start.js',
    './dev/**/stateProvider.start.js',
    './dev/**/*.state.js',
    './dev/**/stateProvider.end.js',
    './dev/**/*.factory.js',
    './dev/**/*.controller.js'
  ])
  .pipe(concat('app.js'))
  .pipe(gulp.dest('./dev/scripts/'))
  .pipe(connect.reload());
});
gulp.task('createAngularExtentions', ['bower'], function() {
  gulp.src([
    './dev/bower_components/angular-ui-router/release/angular-ui-router.js'
  ])
  .pipe(concat('angular-extentions.js'))
  .pipe(gulp.dest('./dev/scripts/'))
  .pipe(connect.reload());
});

gulp.task('BuildAE', ['bower'], function() {
  gulp.src([
    './dev/bower_components/angular-ui-router/release/angular-ui-router.js'
  ])
  .pipe(concat('angular-extentions.js'))
  .pipe(gulp.dest('./dist/scripts/'))
  .pipe(connect.reload());
});

//Dist
gulp.task('minify-js', ['createAppJS', 'createAngularExtentions', 'CDN'], function() {
  return gulp.src(['./dev/scripts/app.js', './dev/scripts/angular-extentions.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('minify-css', ['sass'], function() {
  return gulp.src('./dev/resources/styles/*.css')
    .pipe(minifyCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/resources/styles/'));
});

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };

  return gulp.src('./dev/**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./dist/'));
});
gulp.task('CDN' , ['minify-html', 'bower'], function() {
  gulp.src("./dist/index.html")
        .pipe(cdnizer({
            allowRev: true,
            allowMin: true,
            files: [
                {
                    file: 'bower_components/angular/angular.js',
                    package: 'angular',
                    test: 'window.angular',
                    cdn: '//ajax.googleapis.com/ajax/libs/angularjs/${ version }/angular.min.js'
                }
            ]
        }))
        .pipe(gulp.dest("./dist"));
});
gulp.task('copy-angularjs', function() {
  var filesToMove = [
  './dev/bower_components/angular/angular.min.js',
  './dev/bower_components/angular/angular.min.js.map',
  './dev/bower_components/angular-mocks/angular-mocks.js'
  ];
  gulp.src(filesToMove, { base: './dev/bower_components/' })
  .pipe(gulp.dest('./dist/bower_components/'));
});
gulp.task('copy-data', function() {
  var filesToMove = [
  './dev/data/**/*.json'
  ];
  gulp.src(filesToMove, { base: './dev/data/' })
  .pipe(gulp.dest('./dist/data/'));
});

gulp.task('default', ['connectDev', 'sass', 'watchDev', 'createAppJS', 'createAngularExtentions']);
gulp.task('dist', ['connectDist', 'copy-data', 'minify-js', 'minify-css', 'minify-html', 'CDN', 'copy-angularjs']);
//For CI
gulp.task('build', ['copy-data', 'BuildCSS', 'BuildAE', 'minify-js', 'minify-css', 'minify-html', 'CDN', 'copy-angularjs']);
