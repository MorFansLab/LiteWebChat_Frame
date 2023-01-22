'use strict';

const { parallel, series } = require('gulp');

const gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require("gulp-rename"),
  cleanCSS = require('gulp-clean-css'),
  header = require('gulp-header'),
  pkg = require('./package.json'),
  banner = `
/*!
 * LiteWebChat_Frame ${pkg.version} (${pkg.homepage})
 * MorFans Lab(c) 2017-${new Date().getFullYear()} ${pkg.author}
 * Licensed under ${pkg.license}
 */
`.trim();

function css(path, newName) {
  return gulp.src(path)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(header(banner))
    .pipe(autoprefixer())
    .pipe(rename({
      basename: newName,
      extname: ".css"
    }))
    .pipe(sourcemaps.write(`./map`))
    .pipe(gulp.dest('./dist/css'))
}

function cssMin(path, newName) {
  return gulp.src(path)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(header(banner))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: 'ie11' }))
    .pipe(rename({
      basename: newName,
      extname: ".min.css"
    }))
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest('./dist/css'))
}

const buildLiteChat = () => {
  return css('./src/css/index.scss', 'litewebchat')
};
const buildLiteChatMin = () => {
  return cssMin('./src/css/index.scss', 'litewebchat')
};

const buildLiteChatInput = () => {
  return css('./src/css/chatinput.scss', 'litewebchat_input')
}
const buildLiteChatInputMin = () => {
  return cssMin('./src/css/chatinput.scss', 'litewebchat_input')
}


// export.buildLiteChat

// const buildLiteChat = css('./src/index.scss', 'litewebchat'),
//   buildLiteChatMini = cssMin('./src/index.scss', 'litewebchat');

// const buildLiteChatInput = css('./src/chatinput.scss', 'litewebchat_input'),
//   buildLiteChatInputMini = cssMin('./src/chatinput.scss', 'litewebchat_input');

exports.buildLiteChat = buildLiteChat;
exports.buildLiteChatMin = buildLiteChatMin;
exports.buildLiteChatInput = buildLiteChatInput;
exports.buildLiteChatInputMin = buildLiteChatInputMin;

exports.buildCss = series(
  parallel(buildLiteChat, buildLiteChatMin),
  parallel(buildLiteChatInput, buildLiteChatInputMin)
);

// exports.default
