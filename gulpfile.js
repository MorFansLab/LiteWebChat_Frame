'use strict';

const { src, dest, parallel, series } = require('gulp'),
  rename = require("gulp-rename"),

  sass = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  cleanCSS = require('gulp-clean-css'),
  header = require('gulp-header'),
  pkg = require('./package.json'),
  banner = `
/*!
 * LiteWebChat_Frame ${pkg.version} (${pkg.homepage})
 * MorFans Lab(c) 2017-${new Date().getFullYear()}
 * Licensed under ${pkg.license}
 */
`.trim(),

  pug = require('gulp-pug'),
  pangu = require('gulp-pangu'),

  babel = require('gulp-babel'),
  terser = require('gulp-terser'),

  clean = require('gulp-clean'),
  imagemin = require('gulp-imagemin');

const paths = {
  src_css: "./src/css",
  src_js: "./src/js",
  src_pug: "./src/pug",
  src_images: "./src/images/**/*",

  dist_images: "./dist/images",
  dist_html: "./dist/html",
  dist_css: "./dist/css",
  dist_js: "./dist/js",
}

function css(path, newName) {
  return src(path)
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: ['node_modules'] }).on('error', sass.logError))
    .pipe(header(banner))
    .pipe(autoprefixer())
    .pipe(rename({
      basename: newName,
      extname: ".css"
    }))
    .pipe(sourcemaps.write(`./map`))
    .pipe(dest(paths.dist_css))
}

function cssMin(path, newName) {
  return src(path)
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: ['node_modules'] }).on('error', sass.logError))
    .pipe(header(banner))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: 'ie11' }))
    .pipe(rename({
      basename: newName,
      extname: ".min.css"
    }))
    .pipe(sourcemaps.write('./map'))
    .pipe(dest(paths.dist_css))
}

function js(path, newName) {
  return src(path)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(header(banner))
    .pipe(rename({
      basename: newName,
      extname: ".js"
    }))
    .pipe(sourcemaps.write('./map'))
    .pipe(dest(paths.dist_js))
}

function jsMin(path, newName) {
  return src(path)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(terser())
    .pipe(header(banner))
    .pipe(rename({
      basename: newName,
      extname: ".min.js"
    }))
    .pipe(sourcemaps.write('./map'))
    .pipe(dest(paths.dist_js))
}

const buildLiteChat = (callback) => {
  css(paths.src_css + '/index.scss', 'litewebchat');
  cssMin(paths.src_css + '/index.scss', 'litewebchat');
  callback();
},

  buildLiteChatInput = (cb) => {
    css(paths.src_css + '/chatinput.scss', 'litewebchat_input');
    cssMin(paths.src_css + '/chatinput.scss', 'litewebchat_input');
    cb();
  },

  buildHtml = (cb) => {
    // 这里不压缩 html, 防止其他使用者不能接受激进的 html 编写方式,但又需要方便的查看代码
    src(paths.src_pug + '/*.pug')
      .pipe(pug({
        locals: {},
        // pretty: true,
      }))
      .pipe(pangu())
      .pipe(dest(paths.dist_html));
    cb();
  },

  buildRenderJs = (cb) => {
    js(paths.src_js + '/render.js', 'litewebchat_render');
    jsMin(paths.src_js + '/render.js', 'litewebchat_render');
    cb();
  },

  buildInputJs = (cb) => {
    js(paths.src_js + '/input.js', 'litewebchat_input');
    jsMin(paths.src_js + '/input.js', 'litewebchat_input');
    cb();
  },

  minImage = (cb) => {
    src(paths.src_images)
      .pipe(imagemin())
      .pipe(dest(paths.dist_images));
    cb();
  }


  ;

function cleanFiles() {
  return src('./dist', { read: false })
    .pipe(clean({ force: true }));
}

/**
 * build css
 */
exports.buildLiteChat = buildLiteChat;
exports.buildLiteChatInput = buildLiteChatInput;

/**
 * build html
 */
exports.buildHtml = buildHtml;

/**
 * build js
 */
exports.buildRenderJs = buildRenderJs;
exports.buildInputJs = buildInputJs;

/**
 * build all
 */
exports.build = series(
  parallel(buildLiteChat, buildLiteChatInput),
  parallel(buildRenderJs, buildInputJs),
  parallel(minImage, buildHtml),
);

exports.rebuild = series(
  cleanFiles,
  parallel(buildLiteChat, buildLiteChatInput),
  parallel(buildRenderJs, buildInputJs),
  parallel(minImage, buildHtml),
);

exports.default = exports.build;
