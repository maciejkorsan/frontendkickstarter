/* gulpfile by Maciej Korsan 07.2017 */

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const headerfooter = require('gulp-headerfooter');
const browserSync = require('browser-sync').create();
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const tinypng = require('gulp-tinypng-compress');


gulp.task('assets', function() {
  return gulp.src('./app/assets/**/*').pipe(gulp.dest('./dist/assets/'));
});

gulp.task('tinypng', function () {
  gulp.src('./app/assets/img/**/*.{png,jpg,jpeg}')
    .pipe(tinypng({
      key: 'APIKEY',
      sigFile: './app/assets/img/.tinypng-sigs',
      log: true,
    }))
    .pipe(gulp.dest('./app/assets/img/'));
});

gulp.task('scripts', function() {
  gulp
    .src('app/js/app.js')
    .pipe(eslint())
    .on('error', function(err) {
      browserSync.notify(err.message, 3000);
      this.emit('end');
    })
    .pipe(
      babel({
        presets: ['es2015']
      })
    )
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', function() {
  return gulp
    .src('./app/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('html', function() {
  return gulp
    .src('./app/content/*.html')
    .pipe(headerfooter.header('./app/partials/header.html'))
    .pipe(headerfooter.footer('./app/partials/footer.html'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('serve', ['sass', 'html', 'scripts', 'assets'], function() {
  browserSync.init({
    server: './dist',
  });
  gulp.watch('app/scss/**/*', ['sass']);
  gulp.watch('app/content/*.html', ['html']);
  gulp.watch('app/partials/*.html', ['html']);
  gulp.watch('app/js/*.js', ['scripts']);
  gulp.watch('app/assets/**/*', ['assets']);
  gulp.watch('dist/*.html').on('change', browserSync.reload);
  gulp.watch('dist/js/*.js').on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
