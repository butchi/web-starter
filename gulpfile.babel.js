'use strict';

// import
import gulp from 'gulp';
import source from 'vinyl-source-stream';
import sass from 'gulp-sass';
import pleeease from 'gulp-pleeease';
import browserify from 'browserify';
import babelify from 'babelify';
import debowerify from 'debowerify';
import pug from 'gulp-pug';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import decodecode from 'gulp-decodecode';
import browserSync from 'browser-sync';
import readConfig from 'read-config';
import watch from 'gulp-watch';


// const
const SRC = './src';
const CONFIG = './src/config';
const DEST = './docs';


// css
gulp.task('sass', () => {
  const config = readConfig(`${CONFIG}/pleeease.json`);
  return gulp.src(`${SRC}/scss/style.scss`)
    .pipe(sass())
    .pipe(pleeease(config))
    .pipe(gulp.dest(`${DEST}/css`))
  ;
});

gulp.task('css', gulp.series('sass'));


// js
gulp.task('copy-bower', () => { 
  return gulp.src(['jquery/dist/jquery.min.js', 'lodash/dist/lodash.min.js'], {
    cwd: 'bower_components',
  })
    .pipe(gulp.dest(`${DEST}/js/lib`))
  ;
});

gulp.task('browserify', () => {
  return browserify(`${SRC}/js/script.js`)
    .transform(babelify)
    .transform(debowerify)
    .bundle()
    .pipe(source('script.js'))
    .pipe(gulp.dest(`${DEST}/js`))
  ;
});

gulp.task('minify', () => {
  return gulp.src(`${DEST}/js/script.js`)
    .pipe(uglify({}))
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest(`${DEST}/js`))
  ;
});

gulp.task('deco', () => {
  return gulp.src(`${DEST}/js/script.js`)
    .pipe(decodecode({
      decoArr: ['b', 'u', 't', 'c', 'h', 'i'],
    }))
    .pipe(rename('script.deco.js'))
    .pipe(gulp.dest(`${DEST}/js`))
  ;
});

// gulp.task 'js', gulp.parallel('browserify', 'copy-bower')
gulp.task('js', gulp.series(gulp.parallel('browserify', 'copy-bower'), gulp.parallel('minify', 'deco')));


// html
gulp.task('pug', () => {
  const locals = readConfig(`${CONFIG}/meta.yml`);
  return gulp.src(`${SRC}/pug/*.pug`)
    .pipe(pug({
      locals: locals,
      pretty: true,
    }))
    .pipe(gulp.dest(`${DEST}`))
  ;
});

gulp.task('html', gulp.series('pug'));


gulp.task('browser-sync' , () => {
  browserSync({
    server: {
      baseDir: DEST
    },
  });

  watch([`${SRC}/scss/**/*.scss`], gulp.series('sass', browserSync.reload));
  watch([`${SRC}/js/**/*.js`], gulp.series('browserify', browserSync.reload));
  watch([
      `${SRC}/pug/**/*.pug`,
      `${SRC}/config/meta.yml`
  ], gulp.series('pug', browserSync.reload));
});

gulp.task('serve', gulp.series('browser-sync'));

gulp.task('build', gulp.parallel('css', 'js', 'html'));
gulp.task('default', gulp.series('build', 'serve'));
