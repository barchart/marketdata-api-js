const gulp = require('gulp');

const fs = require('fs');

const browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	bump = require('gulp-bump'),
	git = require('gulp-git'),
	gitStatus = require('git-get-status'),
	glob = require('glob'),
	jasmine = require('gulp-jasmine'),
	jsdoc = require('gulp-jsdoc3'),
	jshint = require('gulp-jshint'),
	replace = require('gulp-replace'),
	source = require('vinyl-source-stream');

function getVersionFromPackage() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

function getVersionForComponent() {
    return getVersionFromPackage().split('.').slice(0, 2).join('.');
}

gulp.task('document', (cb) => {
	const config = {
		"opts": {
			"destination": "./docs"
		}
	};

	gulp.src(['README.md', './lib/**/*.js' ], {read: false})
		.pipe(jsdoc(config, cb));
});

gulp.task('ensure-clean-working-directory', (cb) => {
    gitStatus((err, status) => {
        if (err, !status.clean) {
            throw new Error('Unable to proceed, your working directory is not clean.');
        }

        cb();
    });
});

gulp.task('bump-version', () => {
    return gulp.src([ './package.json' ])
        .pipe(bump({ type: 'patch' }))
        .pipe(gulp.dest('./'));
});

gulp.task('embed-version', () => {
	const version = getVersionFromPackage();

	return gulp.src(['./lib/meta.js'])
		.pipe(replace(/(version:\s*')([0-9]+\.[0-9]+\.[0-9]+)(')/g, '$1' + version + '$3'))
		.pipe(gulp.dest('./lib/'));
});

gulp.task('commit-changes', () => {
    return gulp.src([ './', './test/', './package.json', './lib/meta.js' ])
        .pipe(git.add())
        .pipe(git.commit('Release. Bump version number'));
});

gulp.task('push-changes', (cb) => {
    git.push('origin', 'master', cb);
});

gulp.task('create-tag', (cb) => {
    const version = getVersionFromPackage();

    git.tag(version, 'Release ' + version, (error) => {
        if (error) {
            return cb(error);
        }

        git.push('origin', 'master', { args: '--tags' }, cb);
    });
});

gulp.task('build-example-bundle', () => {
	return browserify([ './example/browser/js/startup.js' ])
		.bundle()
		.pipe(source('example.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./example/browser/'));
});

gulp.task('build', gulp.series('build-example-bundle'));

gulp.task('build-browser-tests', () => {
	return browserify({ entries: glob.sync('test/specs/**/*.js') }).bundle()
		.pipe(source('barchart-marketdata-api-tests-' + getVersionForComponent() + '.js'))
		.pipe(buffer())
		.pipe(gulp.dest('test/dist'));
});

gulp.task('execute-browser-tests', () => {
	return gulp.src('test/dist/barchart-marketdata-api-tests-' + getVersionForComponent() + '.js')
		.pipe(jasmine());
});

gulp.task('execute-node-tests', () => {
	return gulp.src(['test/specs/**/*.js'])
		.pipe(jasmine());
});

gulp.task('test', gulp.series(
	'build-browser-tests',
	'execute-browser-tests',
	'execute-node-tests'
));

gulp.task('release', gulp.series(
	'ensure-clean-working-directory',
	'bump-version',
	'embed-version',
	'build',
	'build-browser-tests',
	'document',
	'commit-changes',
	'push-changes',
	'create-tag'
));

gulp.task('watch', () => {
	gulp.watch('./lib/**/*.js', gulp.series('build-example-bundle'));
});

gulp.task('lint', () => {
    return gulp.src([ './lib/**/*.js', './test/specs/**/*.js' ])
        .pipe(jshint({'esversion': 6}))
        .pipe(jshint.reporter('default'));
});

gulp.task('default', gulp.series('lint' ));
