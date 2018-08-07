/// <binding ProjectOpened='onproject' />
var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps');


gulp.task('amd', function () {
    var tsProject = ts.createProject('tsconfig.json', { module: 'amd', target: 'es5' });
    return gulp.src('*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('wwwroot/amd'));
});

gulp.task('harmony', function () {
    var tsProject = ts.createProject('tsconfig.json', { module: 'es2015', target: 'es2016' });
    return gulp.src('*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('wwwroot/harmony'));
});

gulp.task('default', ['amd', 'harmony'], function () {
    gulp.watch('*.ts', ['amd','harmony']);
});
