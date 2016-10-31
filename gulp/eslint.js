/*eslint no-process-exit:0 */

'use strict';

var path = require('path');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');


module.exports = function(gulp, plugins, args, config, taskTarget, browserSync) {
  var dirs = config.directories;

  // ESLint
  gulp.task('eslint', function() {
    gulp.src([
      path.join('gulpfile.js'),
      path.join(dirs.source, '**/*.js'),
      // Ignore all vendor folder files
      '!' + path.join('**/vendor/**', '*'),
      '!' + path.join(dirs.source, '_scripts/js/*.js')
    ])
    .pipe(browserSync.reload({stream: true, once: true}))
    .pipe(plugins.eslint({
      useEslintrc: true
    }))
    .pipe(plugins.eslint.format())
    .pipe(gulpif(!browserSync.active, plugins.eslint.failAfterError()))
    .on('error', function() {
      if (!browserSync.active) {
        process.exit(1);
      }
    });
  });

  gulp.task('compress', function () {
    pump([
      gulp.src(path.join(dirs.source, '_scripts/js/*.js')),
      uglify(),
      concat('template.js'),
      gulp.dest(path.join(dirs.destination, 'scripts'))
    ])
  })
};
