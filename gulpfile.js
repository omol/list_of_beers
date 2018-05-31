var gulp = require('gulp'),
cleanCSS = require('gulp-clean-css'),
rename = require('gulp-rename'),
notify = require('gulp-notify'),
sass = require('gulp-sass'),
livereload = require('gulp-livereload'),
autoprefixer = require('gulp-autoprefixer'),
browserSync = require("browser-sync"),
reload = browserSync.reload;

gulp.task('default', function () {
    return gulp.src('resources/scss/main.scss')
    .pipe(sass())
    .pipe(cleanCSS({
        relativeTo: 'resources/scss',
        processImport: true
    }))
    .pipe(autoprefixer())
    .pipe(rename("main.css"))
    .pipe(gulp.dest('resources/css'))
    .pipe(notify("CSS is ready!"))
    .pipe(livereload())
    .pipe(livereload({stream: true}));
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('resources/scss/main.scss', ['default']);
});