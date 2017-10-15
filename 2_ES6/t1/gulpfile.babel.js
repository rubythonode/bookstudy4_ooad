'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
// import gutil from 'gulp-util';

const dirs = {
  src: './src', dest:'./build'
}


gulp.task('babel', () => {
  console.log('!!!!!!');
  return gulp.src(dirs.src + '/*.js')
      .pipe(babel())
	    .pipe(gulp.dest(dirs.dest));

});

gulp.task('default',['babel'], () => {
  console.log("gogogogo");
  // return gutil.log('Gulp is running');
});
