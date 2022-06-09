const {src, dest, series, watch, parallel} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();


const styles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync({outputStyle: 'expanded'}).on('error', notify.onError()))
    .pipe(autoprefixer({cascade: false}))
    .pipe(cleanCSS({level: 2}))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest('./app/css'))
}


exports.styles = styles;
