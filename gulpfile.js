/* eslint-disable */
const gulp = require('gulp');
const twig = require('gulp-twig');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const glob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const browserSync = require('browser-sync');

gulp.task('twig', () => {
  return gulp
    .src('src/templates/index.html.twig')
    .pipe(twig())
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'));
});


gulp.task('copyImages', () =>
    gulp.src('src/images/*')
        .pipe(gulp.dest('dist/images'))
);

gulp.task('sass', () => {
  return gulp
    .src('src/sass/*.scss')
    .pipe(glob())
    .pipe(
      sass({
        includePaths: ['./node_modules']
      })
    )
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest('dist'));
});
gulp.task('js', function() {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js'])
        .pipe(gulp.dest("src/js"))
        .pipe(browserSync.stream());
});
gulp.task('stylelint', () => {
  return gulp.src('src/sass/*.scss').pipe(
    stylelint({
      reporters: [{ formatter: 'string', console: true }]
    })
  );
});

gulp.task('babel', () => {
  return gulp
    .src('src/js/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('eslint', () => {
  return gulp
    .src(['src/js/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});



gulp.task('browsersync', () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch(
    ['src/templates/*.twig','src/sass/**/*.scss', 'src/js/*.js'],
    ['build', browserSync.reload]
  );
});

gulp.task('lint', ['stylelint', 'eslint']);
gulp.task('build', ['twig', 'sass', 'copyImages', 'babel']);
gulp.task('server', ['browsersync']);

gulp.task('default', ['lint', 'build']);
