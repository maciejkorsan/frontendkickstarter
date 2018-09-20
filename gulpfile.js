const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const headerfooter = require('gulp-headerfooter');
const browserSync = require('browser-sync').create();
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const plumber = require( 'gulp-plumber' );
const beep = require( 'beepbeep' );
const notify = require( 'gulp-notify' ); // Sends message notification to you.


const errorHandler = r => {
	notify.onError( '\n\n❌  ===> ERROR: <%= error.message %>\n' )( r );
	beep();
};

gulp.task('assets', function() {
  return gulp.src('./app/assets/**/*').pipe(gulp.dest('./dist/assets/'));
});

gulp.task('scripts', function() {
  return gulp
    .src('app/js/app.js')
		.pipe( plumber( errorHandler ) )
    .pipe(
      babel({
        presets: ['env']
      })
    ) 
    .pipe(browserify()) 
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', function() {
  return gulp
    .src('./app/scss/main.scss')
		.pipe( plumber( () => {	notify.onError( '\n\n❌  ===> SASS ERROR %>\n' ) }))
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

gulp.task('serve', gulp.series('sass', 'html', 'scripts', 'assets', function() {
  browserSync.init({
    server: './dist',
    open: true // set to false to disable browser autostart
  });
  gulp.watch('app/scss/**/*', gulp.series('sass'));
  gulp.watch('app/content/*.html',  gulp.series('html'));
  gulp.watch('app/partials/*.html', gulp.series('html'));
  gulp.watch('app/js/*.js',  gulp.series('scripts'));
  gulp.watch('app/assets/**/*', gulp.series('assets'));
  gulp.watch('dist/*.html').on('change', browserSync.reload);
  gulp.watch('dist/js/*.js').on('change', browserSync.reload);
}));

gulp.task('build', gulp.series('sass', 'html' ,'scripts', 'assets'));
gulp.task('default', gulp.series('serve'));