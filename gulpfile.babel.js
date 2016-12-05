import gulp from 'gulp'
import loadPlugins from 'gulp-load-plugins'
import del from 'del'
import glob from 'glob'
import path from 'path'
import {Instrumenter} from 'isparta'
import babel from 'gulp-babel'
import source from 'vinyl-source-stream'

import mochaGlobals from './test/setup/.globals'
import manifest from './package.json'

// Load all of our Gulp plugins
const $ = loadPlugins()

// Gather the library data from `package.json`
const config = manifest.babelBoilerplateOptions
const mainFile = manifest.main
const destinationFolder = path.dirname(mainFile)
const exportFileName = path.basename(mainFile, path.extname(mainFile))

function cleanLib(done) {
  del([destinationFolder]).then(() => done())
}

function cleanTmp(done) {
  del(['tmp']).then(() => done())
}

function onError() {
  $.util.beep()
}

// Lint a set of files
function lint(files) {
  return gulp.src(files)
    .pipe($.plumber())
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError())
    .pipe($.jscs())
    .pipe($.jscs.reporter())
    .pipe($.jscs.reporter('fail'))
    .on('error', onError)
}

function lintSrc() {
  return lint('src/**/*.js')
}

function lintTest() {
  return lint('test/**/*.js')
}

function lintGulpfile() {
  return lint('gulpfile.babel.js')
}

function build() {
  return gulp.src('src/**/*.js')
    .pipe($.plumber())
    .pipe(babel())
    .pipe(gulp.dest(destinationFolder))
}

function _mocha() {
  return gulp.src(['test/setup/node.js', 'test/unit/**/*.js'], { read: false })
    .pipe($.mocha({
      reporter: 'dot',
      globals: Object.keys(mochaGlobals.globals),
      ignoreLeaks: false,
    }))
}

function _registerBabel() {
  require('babel-register')
}

function test() {
  _registerBabel()
  return _mocha()
}

function coverage(done) {
  _registerBabel()
  gulp.src(['src/**/*.js'])
    .pipe($.istanbul({ instrumenter: Instrumenter }))
    .pipe($.istanbul.hookRequire())
    .on('finish', () => test()
        .pipe($.istanbul.writeReports())
        .on('end', done)
    )
}

const watchFiles = ['src/**/*', 'test/**/*', 'package.json', '**/.eslintrc', '.jscsrc']

// Run the headless unit tests as you make changes.
function watch() {
  gulp.watch(watchFiles, ['test'])
}

// Run build while we make changes
function building() {
  gulp.watch(['src/**/*'], ['build'])
}

// Remove the built files
gulp.task('clean', cleanLib)

// Remove our temporary files
gulp.task('clean-tmp', cleanTmp)

// Lint our source code
gulp.task('lint-src', lintSrc)

// Lint our test code
gulp.task('lint-test', lintTest)

// Lint this file
gulp.task('lint-gulpfile', lintGulpfile)

// Lint everything
gulp.task('lint', ['lint-src', 'lint-test', 'lint-gulpfile'])

// Build two versions of the library
gulp.task('build', ['lint', 'clean'], build)

// Lint and run our tests
gulp.task('test', ['lint'], test)

// Set up coverage and run tests
gulp.task('coverage', ['lint'], coverage)

// Run the headless unit tests as you make changes.
gulp.task('watch', watch)

// Build as we make changes
gulp.task('building', building)

// An alias of test
gulp.task('default', ['test'])
