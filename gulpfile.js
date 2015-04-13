var gulp = require('gulp'),
	gutil = require('gulp-util');

var jshint = require('gulp-jshint');
gulp.task('jshint', function () {
	return gulp.src('app/scripts/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(require('jshint-stylish')));
});

var watching = false;
gulp.task('enable-watch-mode', function () { watching = true });

var browserify = require('browserify');
var watchify = require('watchify');
var xtend = require('xtend');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var hbsfy = require('hbsfy');
var aliasify = require('aliasify');
var sourcemaps = require('gulp-sourcemaps');
gulp.task('scripts', function () {
	var opts = {
		entries: './js/app.js',
		debug: (gutil.env.debug),
		extensions: ['.hbs']
	}
	if (watching) {
		 opts = xtend(opts, watchify.args);
	}
	var bundler = browserify(opts);
	if (watching) {
		bundler = watchify(bundler);
	}
	// optionally transform
	bundler.transform(hbsfy);
	bundler.transform(aliasify);

	bundler.on('update', function (ids) {
		gutil.log('File(s) changed: ' + gutil.colors.cyan(ids));
		gutil.log('Rebunlding...');
		rebundle();
	});

	function rebundle() {
		return bundler
			.bundle()
			.on('error', function (e) {
				 gutil.log(gutil.colors.red('Browserify ' + e));
			})
			.pipe(source('main.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist'));
	}
	return rebundle();
});

var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var csso = require('gulp-csso');
gulp.task('styles', function () {
	return gulp.src('scss/**/*.scss')
		.pipe(plumber({
			errorHandler: function (err) {
				gutil.log(gutil.colors.red('Styles error:\n' + err.message));
				// emit `end` event so the stream can resume https://github.com/dlmanning/gulp-sass/issues/101
				if (this.emit) {
					this.emit('end');
				}
			}
		}))
		.pipe(sass())
		.pipe(prefix())
		.pipe(csso())
		.pipe(gulp.dest('dist'));
});

var connect = require('gulp-connect');
gulp.task('connect', function () {
	return connect.server({
		root: ['./', './dist'],
		port: 4005
	});
});

gulp.task('watch', ['enable-watch-mode', 'scripts', 'styles', 'connect'], function () {
	gulp.watch('scss/**/*.scss', ['styles']);
});

gulp.task('default', ['watch']);

var ghPages = require('gulp-gh-pages');
gulp.task('deploy', ['scripts', 'styles'], function () {
	return gulp.src(['dist/**/*', '*.html'])
		.pipe(ghPages());
});
