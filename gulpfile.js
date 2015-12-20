var gulp = require('gulp');

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var bump = require('gulp-bump');
var git = require('gulp-git');
var gitModified = require('gulp-gitmodified');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var util = require('gulp-util');

var fs = require('fs');

function getVersionFromPackage() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

function getVersionForComponent() {
    return getVersionFromPackage().split('.').slice(0, 2).join('.');
}

gulp.task('ensure-clean-working-directory', function() {
    return gulp.src('./**/*')
        .pipe(gitModified('M', 'A', 'D', 'R', 'C', 'U', '??'))
        .on('data', function (file) {
            if (file) {
                throw new Error('Unable to proceed, your working directory is not clean.');
            }
        });
});

gulp.task('bump-version', function () {
    return gulp.src([ './package.json' ])
        .pipe(bump({ type: 'patch' }).on('error', util.log))
        .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
    return gulp.src([ './', './dist/' ])
        .pipe(git.add())
        .pipe(gitModified('M', 'A'))
        .pipe(git.commit('Release. Bump version number'));
});

gulp.task('push-changes', function (cb) {
    git.push('origin', 'master', cb);
});

gulp.task('create-tag', function (cb) {
    var version = 'v' + getVersionFromPackage();

    git.tag(version, 'Release ' + version, function (error) {
        if (error) {
            return cb(error);
        }

        git.push('origin', 'master', { args: '--tags' }, cb);
    });
});

gulp.task('build-browser', function() {
    return browserify('./lib/index.js', { standalone: 'Barchart.RealtimeData' }).bundle()
        .pipe(source('barchart-marketdata-api.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist'))
        .pipe(uglify())
        .pipe(rename('barchart-marketdata-api-min.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('build-connection', function() {
    return browserify('./lib/connection/index.js', { standalone: 'Barchart.RealtimeData.Connection' }).bundle()
        .pipe(source('barchart-realtimedata-connection-' + getVersionForComponent() + '.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-util', function() {
    return browserify('./lib/util/index.js', { standalone: 'Barchart.RealtimeData.Util' }).bundle()
        .pipe(source('barchart-realtimedata-util-' + getVersionForComponent() + '.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-historical-data', function() {
    return browserify('./lib/historicalData/index.js', { standalone: 'Barchart.RealtimeData.HistoricalData' }).bundle()
        .pipe(source('barchart-realtimedata-historicaldata-' + getVersionForComponent() + '.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-market-state', function() {
    return browserify('./lib/marketState/index.js', { standalone: 'Barchart.RealtimeData.MarketState' }).bundle()
        .pipe(source('barchart-realtimedata-marketstate-' + getVersionForComponent() + '.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-message-parser', function() {
    return browserify('./lib/messageParser/index.js', { standalone: 'Barchart.RealtimeData.MessageParser' }).bundle()
        .pipe(source('barchart-realtimedata-messageparser-' + getVersionForComponent() + '.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-browser-components', [ 'build-connection', 'build-util', 'build-historical-data', 'build-market-state', 'build-message-parser' ]);

gulp.task('build', [ 'build-browser', 'build-browser-components' ]);

gulp.task('release', function (callback) {
    runSequence(
        'ensure-clean-working-directory',
        'build',
        'bump-version',
        'commit-changes',
        'push-changes',
        'create-tag',

        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Release complete');
            }

            callback(error);
        });
});

gulp.task('lint', function() {
    return gulp.src('lib/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('default', [ 'lint' ]);