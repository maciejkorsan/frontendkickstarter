'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var headerfooter = require('gulp-headerfooter');
var browserSync = require('browser-sync').create();
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');


gulp.task('scripts', function() { 
    gulp.src('app/js/app.js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
});


gulp.task('sass', function () {
  return gulp.src('./app/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('html', function() {
  return gulp.src('./app/content/*.html')
        .pipe(headerfooter.header('./app/partials/header.html'))
        .pipe(headerfooter.footer('./app/partials/footer.html'))   
        .pipe(gulp.dest('./dist/'));
});

gulp.task('serve', ['sass','html','scripts'], function() {
    browserSync.init({
        server: "./dist"
    });
    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/content/*.html", ['html']);
    gulp.watch("app/partials/*.html", ['html']);
    gulp.watch("app/js/*.js", ['scripts']);
    gulp.watch("dist/*.html").on('change', browserSync.reload);
    gulp.watch("dist/js/*.js").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);