/** 
  * @desc Gulpfile 
  * @author Maciej Korsan 
*/

var gulp = require('gulp'), 
    notify = require("gulp-notify")
    gulpLoadPlugins = require('gulp-load-plugins');
    plugins = gulpLoadPlugins();
    uglify = require('gulp-uglify');
    path = require('path');
    concat = require('gulp-concat');
    plumber = require('gulp-plumber');
    through = require('gulp-through');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var headerfooter = require('gulp-headerfooter');



var config = {
    sassPath: 'app/scss',
    jsPath: 'app/js',
    nodeDir: 'node_modules'
}

function startExpress() {
    var express = require('express');
    var app = express();
    app.use(express.static(__dirname + "/public/"));
    app.listen(4000);
}
 
gulp.task('javascripts', function() {
    return gulp.src(['./app/js/addons/*.js','./app/js/main.js']) 
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")})) 
        .pipe(concat('javascripts.js')) 
        .pipe(uglify())
        .pipe(gulp.dest('./public/Scripts/'))
        .pipe(plugins.livereload())
        .pipe(notify("JavaScripts ok"));
});

gulp.task('css', function() {
    return gulp.src('./app/scss/main.scss')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")})) 
        .pipe(sass())  
        .pipe(autoprefixer({
            browsers: ['last 5 versions','ie 8-10'],
            cascade: false
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('./public/css'))
        .pipe(plugins.livereload())
        .pipe(notify("CSSs ok"));
}); 



gulp.task('watch', function() {
    startExpress();
    plugins.livereload.listen();
    gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
    gulp.watch('app/content/*.html', ['html']);
    gulp.watch('app/partials/*.html', ['html']);
    gulp.watch(config.jsPath + '/*.js', ['javascripts']);
    gulp.watch('app/img/**/*.+(png|jpg|jpeg|gif|svg)', ['images']);
});

gulp.task('html', function() {
  return gulp.src('./app/content/*.html')
        .pipe(headerfooter.header('./app/partials/header.html'))
        .pipe(headerfooter.footer('./app/partials/footer.html'))  
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")})) 
        .pipe(gulp.dest('./public/'))
        .pipe(plugins.livereload())
        .pipe(notify("HTML ok"));
});

gulp.task('images', function() {
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(imagemin({
            interlaced: true
        }))
        .pipe(gulp.dest('public/img'))
        .pipe(gulp.dest('dist/img'));
});

 

gulp.task('default', ['html', 'javascripts', 'css', 'watch', 'images', 'html']);

var onError = function(err) {
    this.emit('end');
    console.log(err);
};