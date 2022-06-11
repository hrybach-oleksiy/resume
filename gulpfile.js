const {src, dest, series, watch} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const fileInclude = require('gulp-file-include');
/*const htmlmin = require('gulp-htmlmin');*/
const notify = require('gulp-notify');
const typograf = require('gulp-typograf');
const del = require('del');





/*const path = require('path');*/

/*const rootFolder = path.basename(path.resolve());*/

// paths
const srcFolder = './src';
const buildFolder = './app';
const paths = {
  srcSvg: `${srcFolder}/img/svg/**.svg`,
  srcImgFolder: `${srcFolder}/img`,
  buildImgFolder: `${buildFolder}/img`,
  srcScss: `${srcFolder}/scss/**/*.scss`,
  buildCssFolder: `${buildFolder}/css`,
  srcFullJs: `${srcFolder}/js/**/*.js`,
  srcMainJs: `${srcFolder}/js/main.js`,
  buildJsFolder: `${buildFolder}/js`,
  srcPartialsFolder: `${srcFolder}/partials`,
  resourcesFolder: `${srcFolder}/resources`,
};

const clean = () => {
  return del([buildFolder])
}

//svg sprite
/*const svgSprites = () => {
  return src(paths.srcSvg)
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: {
          xmlMode: true
        },
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      },
    }))
    .pipe(dest(paths.buildImgFolder));
}*/

// scss styles
const styles = () => {
  return src(paths.srcScss, { sourcemaps: true })
    .pipe(sass().on('error', notify.onError))
    .pipe(autoprefixer({cascade: false, format: 'beautify'}))
    .pipe(cleanCSS({level: 2}))
    .pipe(dest(paths.buildCssFolder, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
};


const resources = () => {
  return src(`${paths.resourcesFolder}/**`)
    .pipe(dest(buildFolder))
}

/*const images = () => {
  return src([`${paths.srcImgFolder}/!**!/!**.{jpg,jpeg,png,svg}`])
    .pipe(gulpif(isProd, image([
      image.mozjpeg({
        quality: 80,
        progressive: true
      }),
      image.optipng({
        optimizationLevel: 2
      }),
    ])))
    .pipe(dest(paths.buildImgFolder))
};

const webpImages = () => {
  return src([`${paths.srcImgFolder}/!**!/!**.{jpg,jpeg,png}`])
    .pipe(webp())
    .pipe(dest(paths.buildImgFolder))
};

const avifImages = () => {
  return src([`${paths.srcImgFolder}/!**!/!**.{jpg,jpeg,png}`])
    .pipe(avif())
    .pipe(dest(paths.buildImgFolder))
};*/

const htmlInclude = () => {
  return src([`${srcFolder}/*.html`])
    .pipe(fileInclude({
      prefix: '@',
      basePath: '@file'
    }))
    .pipe(typograf({
      locale: ['ru', 'en-US']
    }))
    .pipe(dest(buildFolder))
    .pipe(browserSync.stream());
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: `${buildFolder}`
    },
  });

  watch(paths.srcScss, styles);
  /*watch(paths.srcFullJs, scripts);*/
  watch(`${paths.srcPartialsFolder}/*.html`, htmlInclude);
  watch(`${srcFolder}/*.html`, htmlInclude);
  watch(`${paths.resourcesFolder}/**`, resources);
 /* watch(`${paths.srcImgFolder}/!**!/!**.{jpg,jpeg,png,svg}`, images);
  watch(`${paths.srcImgFolder}/!**!/!**.{jpg,jpeg,png}`, webpImages);
  watch(`${paths.srcImgFolder}/!**!/!**.{jpg,jpeg,png}`, avifImages);
  watch(paths.srcSvg, svgSprites);*/
}


/*const htmlMinify = () => {
  return src(`${buildFolder}/!**!/!*.html`)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest(buildFolder));
}*/



exports.default = series(clean, htmlInclude, styles, resources, watchFiles);

/*exports.backend = series(clean, htmlInclude, scriptsBackend, stylesBackend, resources, images, webpImages, avifImages, svgSprites)*/

/*exports.build = series(toProd, clean, htmlInclude, scripts, styles, resources, images, webpImages, avifImages, svgSprites, htmlMinify);*/

/*exports.cache = series(cache, rewrite);*/

/*exports.zip = zipFiles;*/
