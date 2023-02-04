import gulp from 'gulp';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import del from 'del';
import browser from 'browser-sync';
import terser from 'gulp-terser';

// Styles

export const styles = () => {
  return gulp.src('source/*.css', '!source/bootstrap/*.css')
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'));
}

// JS

const js = () => {
  return gulp.src('source/*.js', '!source/bootstrap/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build'))
    .pipe(browser.stream());
};

//Copy

const copy = (done) => {
  gulp.src([
    'source/bootstrap/*.*',
    'source/img/*.*'
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}


// Clean

const clean = () => {
  return del('build');
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

export const watcher = () => {
  gulp.watch('source/*.css', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(html, reload));
  gulp.watch('source/*.{js,json}', gulp.series(js));
}

// Build

export const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    js,
    copy
  ),
);

// Default


export default gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    js,
    copy
  ),
  gulp.series(
    server,
    watcher
  ));
