'use strict'

gulp = require 'gulp'
source = require 'vinyl-source-stream'
sass = require 'gulp-sass'
pleeease = require 'gulp-pleeease'
browserify = require 'browserify'
babelify = require 'babelify'
debowerify = require 'debowerify'
pug = require 'gulp-pug'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
decodecode = require 'gulp-decodecode'
browserSync = require 'browser-sync'

SRC = './src'
DEST = '.'

# html
gulp.task 'pug', () ->
  return gulp.src("#{SRC}/pug/*.pug")
    .pipe pug
      # locals: locals,
      pretty: true,
    .pipe gulp.dest "#{DEST}"

gulp.task 'html', gulp.series('pug')

gulp.task 'sass', () ->
  gulp.src "#{SRC}/scss/style.scss"
    .pipe do sass
    .pipe pleeease {
      autoprefixer: {
        browsers: [
          "ie >= 10",
          "ie_mob >= 10",
          "ff >= 30",
          "chrome >= 34",
          "safari >= 7",
          "opera >= 23",
          "ios >= 7",
          "android >= 4.4",
          "bb >= 10"
        ]
      },
      "minifier": false
    }
    .pipe gulp.dest "#{DEST}/css"

gulp.task 'css', gulp.series('sass')

gulp.task 'copy-bower', () -> 
  return gulp.src ['jquery/dist/jquery.min.js', 'lodash/dist/lodash.min.js'],
    cwd: 'bower_components',
  .pipe(gulp.dest "#{DEST}/js/lib")

gulp.task 'browserify', () ->
  return browserify("#{SRC}/js/main.js")
    .transform(babelify)
    .transform(debowerify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest("#{DEST}/js"))

gulp.task 'minify', () ->
  gulp.src("#{DEST}/js/main.js")
    .pipe (uglify {})
    .pipe (rename 'main.min.js')
    .pipe (gulp.dest "#{DEST}/js")

gulp.task 'deco', () ->
  gulp.src("#{DEST}/js/main.js")
    .pipe (decodecode
      decoArr: ['b', 'u', 't', 'c', 'h', 'i']
    )
    .pipe (rename 'main.deco.js')
    .pipe (gulp.dest "#{DEST}/js")

# gulp.task 'js', gulp.parallel('browserify', 'copy-bower')
gulp.task 'js', gulp.series(gulp.parallel('browserify', 'copy-bower'), gulp.parallel('minify', 'deco'))

gulp.task 'browser-sync' , () ->
  browserSync
    server: {
      baseDir: DEST
    }

  gulp.watch(["#{SRC}/scss/**/*.scss"], gulp.series('sass', browserSync.reload));
  gulp.watch(["#{SRC}/js/**/*.js"], gulp.series('browserify', browserSync.reload));
  gulp.watch(["#{SRC}/pug/**/*.pug"], gulp.series('pug', browserSync.reload));

gulp.task('serve', gulp.series('browser-sync'));

gulp.task('build', gulp.parallel('css', 'js', 'html'));
gulp.task 'default', gulp.series('build', 'serve');
