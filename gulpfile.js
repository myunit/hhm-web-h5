/**
 * @author qianqing
 * @create by 16-2-2
 * @description
 */
var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload');

// 样式处理任务
gulp.task('css', function() {
  return gulp.src('public/css/*.css')    //引入所有CSS
    .pipe(concat('my-h5.css'))           //合并CSS文件
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/dist/css'))      //完整版输出
    .pipe(rename({ suffix: '.min' }))   //重命名
    .pipe(gulp.dest('public/dist/css'))      //压缩版输出
    .pipe(notify({ message: '样式文件处理完成' }));
});

// JS处理任务
gulp.task('js', function() {
  return gulp.src('public/js/controller/*.js')      //引入所有需处理的JS
    .pipe(jshint.reporter('default'))         //S代码检查
    .pipe(concat('my.js'))                  //合并输出的JS文件名称
    .pipe(gulp.dest('public/dist/js'))        //完整版输出路径
    .pipe(rename({ suffix: '.min' }))         //重命名
    .pipe(uglify())                           //压缩JS
    .pipe(gulp.dest('public/dist/js'))        //压缩版输出路径
    .pipe(notify({ message: 'JS文件处理完成' }));
});

// JS处理任务
gulp.task('city-js', function() {
  return gulp.src('public/js/lib/sm-city-picker.js')      //引入所有需处理的JS
    .pipe(jshint.reporter('default'))         //S代码检查
    .pipe(concat('sm-city-picker.js'))                  //合并输出的JS文件名称
    .pipe(gulp.dest('public/js/lib'))        //完整版输出路径
    .pipe(rename({ suffix: '.min' }))         //重命名
    .pipe(uglify())                           //压缩JS
    .pipe(gulp.dest('public/js/lib'))        //压缩版输出路径
    .pipe(notify({ message: 'JS文件处理完成' }));
});

// 目标目录清理
gulp.task('clean', function() {
  return gulp.src(['public/dist/css', 'public/dist/js'], {read: false})
    .pipe(clean());
});

// 预设任务，执行清理后，
gulp.task('default', ['clean'], function() {
  gulp.start('css', 'js');
});


// 文档临听
gulp.task('watch', function() {
  // 监听所有css文档
  gulp.watch('public/css/*.css', ['css']);
  // 监听所有.js档
  gulp.watch('public/js/controller/*.js', ['js']);
});
