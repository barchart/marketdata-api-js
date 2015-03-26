var gulp = require('gulp'),
    concat = require('gulp-concat'),
    srcmaps = require('gulp-sourcemaps');

var version = '1.0';

gulp.task('default', function() {
	return gulp.src(['barchart-realtimedata-util-1.0.js']
		.concat('barchart-realtimedata-!(util)-1.0.js'))
        .pipe(srcmaps.init())
        .pipe(concat('barchart-marketdata-api-' + version + '.js'))
        .pipe(srcmaps.write('../dist/'))
        .pipe(gulp.dest('./dist'));
});
