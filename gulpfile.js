const gulp = require('gulp');

const fs = require('fs');
const path = require('path');

const AWS = require('aws-sdk'),
	awspublish = require('gulp-awspublish'),
	browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	bump = require('gulp-bump'),
	git = require('gulp-git'),
	gitStatus = require('git-get-status'),
	glob = require('glob'),
	jasmine = require('gulp-jasmine'),
	jshint = require('gulp-jshint'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	source = require('vinyl-source-stream'),
	docsify = require('docsify-cli/lib/commands/init'),
	jsdoc2md = require('jsdoc-to-markdown');

function getVersionFromPackage() {
	return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

function getVersionForComponent() {
	return getVersionFromPackage().split('.').slice(0, 2).join('.');
}

function generateDocs(cb, files = 'lib/**/*.js') {
	const sidebar = '* [Getting Started](/README.md)\n* [Documentation](documentation.md)';
	return jsdoc2md.render({
		files: files
	}).then(output => {
		fs.writeFileSync('./docs/documentation.md', output);
		fs.writeFileSync('./docs/_sidebar.md', sidebar);
		return cb();
	});
}

function toTitleCase(str) {
	return str.replace(/(^[a-z]| [a-z]|-[a-z]|_[a-z]|\/[a-z])/g,
		function (s) {
			return s.toUpperCase();
		}
	);
}

function preparePath(path, tab) {
	const name = toTitleCase(path.replace('-', '/'));
	return `${tab ? '\t' : ''}* [${name}](/content/sdk/${path})\n`;
}

gulp.task('generate_docs', (cb) => {
	const inputFile = 'lib/**/*.js';
	const docFolder = `${__dirname}/docs`;
	const contentDir = `${docFolder}/content`;
	const sdkDir = `${contentDir}/sdk`;
	const template = `{{>main}}`;
	let sdkReference = '# SDK Reference\n';
	let sdkReferenceMD = '<!--- sdk_open -->\n* [SDK Reference](/content/sdk_reference)\n';

	return jsdoc2md.clear().then(() => {
		return jsdoc2md.getTemplateData({
			files: inputFile
		}).then((templateData) => {
			return templateData.reduce((paths, identifier) => {
				//SOME objects hasn't meta.path
				if (!identifier.meta) {
					return paths;
				}

				const path = identifier.meta.path;
				const arrayFilePath = path.split('lib/');
				const filePath = arrayFilePath[1].replace('/', '-');

				if (!paths[filePath]) {
					paths[filePath] = [];
				} else {
					paths[filePath].push(identifier);
				}

				return paths;
			}, {});
		}).then((paths) => {
			const keys = Object.keys(paths).sort();
			keys.forEach((filePath) => {
				const data = paths[filePath];

				const output = jsdoc2md.renderSync({
					data: data,
					template,
					plugin: '@barchart/dmd-plugin',
					"global-index-format": 'md'
				});

				if (output) {
					sdkReference += preparePath(filePath);
					sdkReferenceMD += preparePath(filePath, true);
					fs.writeFileSync(path.resolve(sdkDir, `${filePath}.md`), output);
				}
			});

			sdkReferenceMD += '<!--- sdk_close -->';

			fs.writeFileSync(path.resolve(contentDir, `sdk_reference.md`), sdkReference);

			gulp.src([`${docFolder}/_sidebar.md`])
				.pipe(replace(/(<!--- sdk_open -->(\s|.)*<!--- sdk_close -->)/gm, sdkReferenceMD))
				.pipe(gulp.dest(docFolder));
		});
	});
});

gulp.task('docsify', (cb) => {
	const isInited = fs.existsSync("./docs/index.html");

	if (!isInited) {
		const docsifyConfig = 'window.$docsify = {\n\tloadSidebar: true,';

		docsify("./docs", "", "vue");

		gulp.src(['./docs/index.html'])
			.pipe(replace(/(window.\$docsify.*)/g, docsifyConfig))
			.pipe(gulp.dest('./docs/'));
	}

	return generateDocs(cb);
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
	return gulp.src(['./package.json'])
		.pipe(bump({type: 'patch'}))
		.pipe(gulp.dest('./'));
});

gulp.task('embed-version', () => {
	const version = getVersionFromPackage();

	return gulp.src(['./lib/meta.js'])
		.pipe(replace(/(version:\s*')([0-9]+\.[0-9]+\.[0-9]+)(')/g, '$1' + version + '$3'))
		.pipe(gulp.dest('./lib/'));
});

gulp.task('commit-changes', () => {
	return gulp.src(['./', './test/', './package.json', './lib/meta.js'])
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

gulp.task('upload-example-to-S3', () => {
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
			path.dirname = 'marketdata-api-js';
		}))
		.pipe(publisher.publish(headers, options))
		.pipe(publisher.cache())
		.pipe(awspublish.reporter());
});

gulp.task('deploy-example', gulp.series('upload-example-to-S3'));

gulp.task('build-browser-tests', () => {
	return browserify({entries: glob.sync('test/specs/**/*.js')}).bundle()
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
	'commit-changes',
	'push-changes',
	'create-tag'
));

gulp.task('watch', () => {
	gulp.watch('./lib/**/*.js', gulp.series('build-example-bundle'));
});

gulp.task('lint', () => {
	return gulp.src(['./lib/**/*.js', './test/specs/**/*.js'])
		.pipe(jshint({'esversion': 6}))
		.pipe(jshint.reporter('default'));
});

gulp.task('default', gulp.series('lint'));
