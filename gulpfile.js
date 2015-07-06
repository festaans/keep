var gulp = require('gulp');

var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var cdnizer = require("gulp-cdnizer");
var sass = require('gulp-sass');
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
gulp.task('sass', function () {
  gulp.src('./dev/resources/sass/app.scss')
  .pipe(sass())
  .pipe(gulp.dest('./dev/resources/styles/'))
  .pipe(connect.reload());
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
gulp.task('createAngularExtentions', function() {
  gulp.src([
    './dev/bower_components/angular-ui-router/release/angular-ui-router.js'
  ])
  .pipe(concat('angular-extentions.js'))
  .pipe(gulp.dest('./dev/scripts/'))
  .pipe(connect.reload());
});

//Dist
gulp.task('minify-js', function() {
  return gulp.src(['./dev/scripts/app.js', './dev/scripts/angular-extentions.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('minify-css', function() {
  return gulp.src('./dev/resources/styles/*.css')
    .pipe(minifyCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/resources/styles/'));
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
gulp.task('CDN' , ['minify-html'], function() {
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
  './dev/bower_components/angular/angular.min.js.map'
  ];
  gulp.src(filesToMove, { base: './dev/bower_components/angular/' })
  .pipe(gulp.dest('./dist/bower_components/angular/'));
});

gulp.task('default', ['connectDev', 'sass', 'watchDev', 'createAppJS', 'createAngularExtentions']);
gulp.task('dist', ['connectDist', 'minify-js', 'minify-css', 'minify-html', 'CDN', 'copy-angularjs']);
