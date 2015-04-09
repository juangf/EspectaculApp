var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    wrap = require("gulp-wrap");

//Concat js
gulp.task('concat', function() {
    gulp.src(['js/core.js','js/*.js'])
        .pipe(concat('espectaculapp.js'))
        .pipe(wrap('(function(_w, _d){\n"use strict";\n<%= contents %>\n})(window, document);'))
        .pipe(gulp.dest('dist/js/'))
        .pipe(notify({ message: 'Js Concat successfully' }));           
});

//Minify js
gulp.task('minjs', function() {
    return gulp.src('dist/js/*.js')
        .pipe(uglify())                     
        .pipe(gulp.dest('dist/js/'))                       
        .pipe(notify({ message: 'Js compiled successfully' }));
}); 


gulp.task('default', ['concat', 'minjs']);