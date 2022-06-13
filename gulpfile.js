'use strict';

const {src, dest, parallel, series, watch} = require('gulp');

const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const fileinclude = require('gulp-file-include');
const concat = require('gulp-concat');
const del = require('del');
const typograf = require('gulp-typograf');

const clean = () => {
    return del('dist')
}

const styles = () => {
    return src('app/scss/**/*.scss', {sourcemaps: true})
        .pipe(sass())
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 versions'], grid: true }))
        .pipe(cleanCSS( {level: { 1: { specialComments: 0 } } , format: 'beautify'} ))
        .pipe(dest('dist/css/', {sourcemaps: '.' }))
        .pipe(browserSync.stream());
}

const htmlInclude = () => {
    return src(`app/*.html`)
        .pipe(fileinclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(typograf({
            locale: ['ru', 'en-US']
        }))
        .pipe(dest('dist/'))
        .pipe(browserSync.stream());
}

const fonts = () => {
    return src('app/fonts/*.*')
        .pipe(dest('dist/fonts/'))
}

const watchingFiles = () => {
    browserSync.init({ // Инициализация Browsersync
        server: { baseDir: 'dist/' }, // Указываем папку сервера
        notify: false, // Отключаем уведомления
        online: true // Режим работы: true или false
    })

    watch('app/scss/**/*.scss', styles);
    watch('app/fonts/*.*', fonts);
    /*watch(["app/partials/!*.html", "app/!*.html"]).on('change', browserSync.reload);*/
    watch('app/partials/*.html', htmlInclude);
    watch('app/*.html', htmlInclude);
}

exports.styles = styles;
exports.clean = clean;


exports.default = series(clean, htmlInclude, fonts, styles, watchingFiles);