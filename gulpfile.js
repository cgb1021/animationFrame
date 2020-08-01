const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');

gulp.task('clean', function (cb) {
  return del([
    './index.js'
  ], cb)
});
gulp.task('js', function (cb) {
  return gulp.src('src/**/*')
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(gulp.dest('./'))
});
