const gulp = require('gulp');
const concat = require('gulp-concat');
const htmlReplace = require('gulp-html-replace');
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const bower = require('gulp-bower');
const htmlMin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const { series } = require('gulp');

function defaultTask(cb) {
	series(
		scripts,
		htmlReplaceTask,
		bowerTask,
		minifyCss,
		minifyTemplates,
		minifyIndex
	)(cb);
}

function scripts() {
	return gulp
		.src('admin-source/js/*.js')
		.pipe(concat('bundle.js'))
		.pipe(minify({ ext: { min: '.min.js' } }))
		.pipe(gulp.dest('admin/js'));
}

function htmlReplaceTask() {
	return gulp
		.src('admin-source/index.html')
		.pipe(
			htmlReplace({
				js: 'js/bundle.min.js',
				css: 'css/app.min.css',
			})
		)
		.pipe(gulp.dest('admin'));
}

function minifyCss() {
	return gulp
		.src('admin-source/css/app.css')
		.pipe(cleanCSS())
		.pipe(rename('app.min.css'))
		.pipe(gulp.dest('admin/css'));
}

function bowerTask() {
	return bower({ cwd: 'admin-source' }).pipe(gulp.dest('admin/lib'));
}

function minifyTemplates() {
	return gulp
		.src(['admin-source/view/*.html'])
		.pipe(htmlMin({ collapseWhitespace: true }))
		.pipe(gulp.dest('admin/view'));
}

function minifyIndex() {
	return gulp
		.src('admin/index.html')
		.pipe(htmlMin({ collapseWhitespace: true }))
		.pipe(gulp.dest('admin'));
}

exports.default = defaultTask;
exports.scripts = scripts;
exports.htmlReplace = htmlReplaceTask;
exports.minifyCss = minifyCss;
exports.bower = bowerTask;
exports.minifyTemplates = minifyTemplates;
exports.minifyIndex = minifyIndex;
