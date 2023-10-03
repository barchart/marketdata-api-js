const exec = require('child_process').exec,
	fs = require('fs'),
	path = require('path');

const AWS = require('aws-sdk'),
	awspublish = require('gulp-awspublish'),
	browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	git = require('gulp-git'),
	gitStatus = require('git-get-status'),
	glob = require('glob'),
	gulp = require('gulp'),
	jasmine = require('gulp-jasmine'),
	jshint = require('gulp-jshint'),
	merge = require('merge-stream'),
	prompt = require('gulp-prompt'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	source = require('vinyl-source-stream'),
	spawn = require('child_process').spawn;

function getVersionFromPackage() {
	return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

function getVersionForTestBundle() {
	return getVersionFromPackage().split('.').slice(0, 1).join('.');
}

gulp.task('ensure-clean-working-directory', (cb) => {
	gitStatus((err, status) => {
		if (err, !status.clean) {
			throw new Error('Unable to proceed, your working directory is not clean.');
		}

		cb();
	});
});

gulp.task('bump-choice', (cb) => {
	const processor = prompt.prompt({
		type: 'list',
		name: 'bump',
		message: 'What type of bump would you like to do?',
		choices: ['patch', 'minor', 'major'],
	}, (res) => {
		global.bump = res.bump;

		return cb();
	});

	return gulp.src(['./package.json']).pipe(processor);
});

gulp.task('bump-version', (cb) => {
	exec(`npm version ${global.bump || 'patch'} --no-git-tag-version`, {
		cwd: './'
	}, (error) => {
		if (error) {
			cb(error);
		}

		cb();
	});
});

gulp.task('embed-version', () => {
	const version = getVersionFromPackage();

	const meta = gulp.src(['./lib/meta.js'])
		.pipe(replace(/(version:\s*')([0-9]+\.[0-9]+\.[0-9]+)(')/g, '$1' + version + '$3'))
		.pipe(gulp.dest('./lib/'));

	const coverpage = gulp.src(['./docs/_coverpage.md'])
		.pipe(replace(/[0-9]+\.[0-9]+\.[0-9]+/g, version))
		.pipe(gulp.dest('./docs/'));

	return merge(meta, coverpage);
});

gulp.task('commit-changes', () => {
	return gulp.src(['./', './test/', './package.json', './lib/meta.js', './docs/_coverpage.md'])
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

		git.push('origin', 'master', {args: '--tags'}, cb);
	});
});

gulp.task('build-example-bundle', () => {
	return browserify(['./example/browser/js/startup.js'])
		.bundle()
		.pipe(source('example.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./example/browser/'));
});

gulp.task('build', gulp.series('build-example-bundle'));

gulp.task('upload-example-page-to-S3', () => {
	let publisher = awspublish.create({
		region: 'us-east-1',
		params: {
			Bucket: 'barchart-examples'
		},
		credentials: new AWS.SharedIniFileCredentials({profile: 'default'})
	});

	let headers = {'Cache-Control': 'no-cache'};
	let options = {};

	return gulp.src(['./example/browser/example.css', './example/browser/example.html', './example/browser/example.js'])
		.pipe(rename((path) => {
			path.dirname = 'legacy/marketdata-api-js';
		}))
		.pipe(publisher.publish(headers, options))
		.pipe(publisher.cache())
		.pipe(awspublish.reporter());
});

gulp.task('deploy-example-page', gulp.series('upload-example-page-to-S3'));

gulp.task('upload-documentation-site-to-S3', () => {
	let publisher = awspublish.create({
		region: 'us-east-1',
		params: {
			Bucket: 'docs.barchart.com'
		},
		credentials: new AWS.SharedIniFileCredentials({profile: 'default'})
	});

	let headers = {'Cache-Control': 'no-cache'};
	let options = {};

	return gulp.src(['./docs/**'])
		.pipe(rename((filePath) => {
			filePath.dirname = path.join('marketdata-api-js', filePath.dirname);
		}))
		.pipe(publisher.publish(headers, options))
		.pipe(publisher.cache())
		.pipe(awspublish.reporter());
});

gulp.task('deploy-documentation', gulp.series('upload-documentation-site-to-S3'));

gulp.task('build-browser-tests', () => {
	return browserify({entries: glob.sync('test/specs/**/*.js')}).bundle()
		.pipe(source('barchart-marketdata-api-tests-' + getVersionForTestBundle() + '.js'))
		.pipe(buffer())
		.pipe(gulp.dest('test/dist'));
});

gulp.task('execute-browser-tests', () => {
	return gulp.src('test/dist/barchart-marketdata-api-tests-' + getVersionForTestBundle() + '.js')
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

gulp.task('create-github-release', (cb) => {
	const version = getVersionFromPackage();

	const processor = prompt.prompt({
		type: 'input',
		name: 'path',
		message: 'Please enter release notes path (relative to gulpfile.js):'
	}, (res) => {
		const path = res.path;

		if (!fs.existsSync(path)) {
			return cb(new Error(`Release markdown file not found: ${path}`));
		}

		const child = spawn(`hub release create -f ${path} ${version}`, {
			stdio: 'inherit',
			shell: true,
		});

		child.on('error', (error) => {
			console.log(error);

			cb(error);
		});

		child.on('exit', () => {
			cb();
		});
	});

	return gulp.src('./package.json').pipe(processor);
});

gulp.task('release', gulp.series(
	'ensure-clean-working-directory',
	'bump-choice',
	'bump-version',
	'embed-version',
	'build',
	'build-browser-tests',
	'commit-changes',
	'push-changes',
	'create-tag',
	'deploy-example-page'
	// 'deploy-documentation'
));

gulp.task('watch', () => {
	gulp.watch('./lib/**/*.js', gulp.series('build-example-bundle'));
});

gulp.task('lint', () => {
	return gulp.src([ './lib/**/*.js', './test/specs/**/*.js' ])
		.pipe(jshint({ esversion: 9 }))
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('default', gulp.series('lint'));
