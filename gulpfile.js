var gulp = require('gulp'),
    gutil = require('gulp-util'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    uncss = require('gulp-uncss'),
    minifyCss = require('gulp-minify-css'),
    htmlmin = require('gulp-htmlmin');


gulp.task('copy', function() {
    gulp.src(['favicon.ico', 'dixit.js', 'package.json', 'README.md'])
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-server-lib', function() {
    gulp.src('lib/*.js')
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('html', function () {
    var assets = useref.assets();

    return gulp.src('index.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulpif('*.css', autoprefixer({ 
            browsers: ['last 2 versions', 'ie 8', 'ie 9'] 
        })))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['html', 'copy', 'copy-server-lib']);