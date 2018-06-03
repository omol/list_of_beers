var gulp = require('gulp'),
serve = require('gulp-serve'),
inject = require('gulp-inject'),
jslint = require('gulp-jslint'),
cleanCSS = require('gulp-clean-css'),
rename = require('gulp-rename'),
notify = require('gulp-notify'),
sass = require('gulp-sass'),
livereload = require('gulp-livereload'),
autoprefixer = require('gulp-autoprefixer');
var paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/**/*.js',
    tmp: 'tmp', 
    tmpIndex: 'tmp/index.html', 
    tmpCSS: 'tmp/**/*.css', 
    tmpJS: 'tmp/**/*.js', 
  };
gulp.task('default', function () {
    return gulp.src('src/scss/main.scss')
        .pipe(sass())
        .pipe(cleanCSS({
            relativeTo: 'src/scss',
            processImport: true
        }))
        .pipe(autoprefixer())
        .pipe(rename("main.css"))
        .pipe(gulp.dest('src/css'))
        .pipe(notify("CSS is ready!"))
        .pipe(livereload())
        .pipe(livereload({stream: true})),
        gulp.src(['src/js/main.js'])
            .pipe(jslint())
            .pipe(jslint.reporter('stylish'));
});

gulp.task('html', function () {
    return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});
gulp.task('css', function () {
    return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});
gulp.task('js', function () {
    return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});
gulp.task('copy', ['html', 'css', 'js']);
gulp.task('inject', ['copy'], function () {
    var css = gulp.src(paths.tmpCSS);
    var js = gulp.src(paths.tmpJS);
    return gulp.src(paths.tmpIndex)
      .pipe(inject( css, { relative:true } ))
      .pipe(inject( js, { relative:true } ))
      .pipe(gulp.dest(paths.tmp));
});
gulp.task('serve', serve('tmp'));
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/scss/main.scss', ['default']);
});

