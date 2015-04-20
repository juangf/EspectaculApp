var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
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
        .pipe(wrap('"use strict";(function(_w, _d){<%= contents %>})(window, document);'))
        .pipe(gulp.dest('dist/js/'));
        /*.pipe(notify({ message: 'Js Concat successfully' }));*/
});

//Minify js
gulp.task('minjs', function() {
    return gulp.src('dist/js/*.js')
        .pipe(uglify())                     
        .pipe(gulp.dest('dist/js/'));                     
        /*.pipe(notify({ message: 'Js compiled successfully' }));*/
}); 

// Compile sass and show sourcemaps
gulp.task('sass', function() {
    return gulp.src('./sass/espectaculapp.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css/'));
        /*.pipe(notify({ message: 'Sass compiled successfully' }));*/
});


// Minify css
gulp.task('minifycss', function(){
    return gulp.src('dist/css/espectaculapp.css')
        .pipe( minifycss( { keepBreaks : false } ) )
        .pipe( gulp.dest('dist/css/'))
        .pipe(rename({suffix: '.min'}))
        .pipe( gulp.dest('dist/css/'));
        /*.pipe(notify({ message: 'Sass compiled and minified successfully' }));*/
});


// Style tasks
gulp.task('styles', ['sass','minifycss'], function() {  });


//Gulp watch task
gulp.task('watch', function() { 
    //Watch sass files
    gulp.watch('sass/*.scss', ['styles']);
    //Watch js files
    gulp.watch('js/*.js', ['concat','minjs']);
});