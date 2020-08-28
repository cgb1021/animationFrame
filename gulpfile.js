const gulp = require('gulp')
const del = require('del')
const rollup = require('rollup')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')

gulp.task('clean', function (cb) {
	return del([
		'./dist',
		'./index.js'
	], cb)
})
gulp.task('rollup', () => {
	return rollup.rollup({
		input: './src/index.js',
		plugins: []
	}).then(bundle => {
		return bundle.write({
			file: './dist/index.js',
			format: 'umd',
			name: 'Animation'
		})
	})
})
gulp.task('copy', () => {
	return gulp.src('./src/**/*')
		.pipe(gulp.dest('./'))
})
gulp.task('babel', () => {
	return gulp.src('./dist/**/*')
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('./dist'))
})
gulp.task('build', gulp.series('clean', 'rollup', 'babel', 'copy'))
