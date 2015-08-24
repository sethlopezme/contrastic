/* eslint strict: 0, no-var: 0, no-console: 0 */
'use strict';

var path = require('path');
var gulp = require('gulp');
var cache = require('gulp-cached');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');
var webpack = require('webpack');

var config = {
	html: {
		input: ['./renderer/src/*.html'],
		output: './renderer/build/',
		// omit "./" to pick up future files
		watch: ['renderer/src/*.html']
	},
	images: {
		input: ['./renderer/src/images/**/*.{jpg,gif,png,svg}'],
		output: './renderer/build/images/',
		// omit "./" to pick up future files
		watch: ['renderer/src/images/**/*.{jpg,gif,png,svg}']
	},
	styles: {
		input: ['./renderer/src/styles/*.scss'],
		output: './renderer/build/styles/',
		// omit "./" to pick up future files
		watch: ['renderer/src/styles/**/*.scss']
	},
	scripts: {
		input: ['./renderer/src/scripts/app.js'],
		output: './renderer/build/scripts/',
		// omit "./" to pick up future files; include html files for templates
		watch: ['renderer/src/scripts/**/*.{js,html}'],
		lint: ['./renderer/src/scripts/**/*.js']
	},
	plugins: {
		autoprefixer: {
			browsers: ['chrome 43']
		},
		imagemin: {
			svgoPlugins: [
				{ cleanupIDs: false },
				{ convertPathData: false },
				{ convertShapeToPath: false },
				{ mergePaths: false },
				{ removeUselessDefs: false }
			]
		},
		sass: {
			outputStyle: 'compressed'
		}
	}
};

var compiler = webpack({
	target: 'atom',
	entry: config.scripts.input,
	output: {
		path: path.resolve(__dirname, config.scripts.output),
		publicPath: '/app/',
		filename: 'app.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel?optional[]=runtime'
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.html$/,
				loader: 'html'
			}
		]
	},
	resolve: {
		modulesDirectories: ['node_modules', 'lib', 'scripts']
	}
});

/**
 * Default task. Takes the guess-work out of running default tasks by telling
 * you to run the specific task that you want to perform.
 */
gulp.task('default', function defaultTask() {
	console.error('ERROR: You must run a specific task. List all tasks with "gulp --tasks".');
	process.exit(9);
});

/**
 * Handles copying of HTML files from the input directory to the output
 * directory.
 */
gulp.task('html', function html() {
	return gulp.src(config.html.input)
		.pipe(cache('html'))
		.pipe(gulp.dest(config.html.output));
});

/**
 * Handles copying and optimizing images.
 */
gulp.task('images', function images() {
	return gulp.src(config.images.input)
		.pipe(cache('images'))
		.pipe(imagemin(config.plugins.imagemin))
		.pipe(gulp.dest(config.images.output));
});

/**
 * Handles linting JavaScript files with ESLint.
 */
gulp.task('lint-scripts', function lintScripts() {
	return gulp.src(config.scripts.lint)
		.pipe(cache('eslint'))
		.pipe(eslint())
		.pipe(eslint.format('stylish'))
		.pipe(eslint.failAfterError());
});

/**
 * Handles transpilation and packing of JavaScript.
 */
gulp.task('scripts', ['lint-scripts'], function scripts(cb) {
	compiler.run(function compilerHandler(error, stats) {
		console.log(error || stats.toString({
			colors: true,
			chunks: false,
			cached: true
		}));
		cb();
	});
});

/**
 * Handles compilation of Sass files.
 */
gulp.task('styles', function styles() {
	return gulp.src(config.styles.input)
		.pipe(sass(config.plugins.sass).on('error', sass.logError))
		.pipe(autoprefixer(config.plugins.autoprefixer))
		.pipe(gulp.dest(config.styles.output));
});

/**
 * Handles a basic build of the entire project.
 */
gulp.task('build', ['html', 'images', 'scripts', 'styles']);

/**
 * Handles building project, serving the project locally, and watching the
 * project files for changes.
 */
gulp.task('dev', ['html', 'images', 'scripts', 'styles'], function serve() {
	gulp.watch(config.html.watch, ['html']);
	gulp.watch(config.images.watch, ['images']);
	gulp.watch(config.scripts.watch, ['scripts']);
	gulp.watch(config.styles.watch, ['styles']);
});
