// Generated on 2016-04-01 using generator-angular 0.15.1
'use strict';

let gulp = require('gulp');
let $ = require('gulp-load-plugins')();
//let openURL = require("open");
let lazypipe = require('lazypipe');
let rimraf = require('rimraf');
let wiredep = require('wiredep').stream;
let runSequence = require('run-sequence');

let yeoman = {
  app: require('./bower.json').appPath || 'app',
  dist: 'dist'
};

let paths = {
  scripts: [yeoman.app + '/scripts/**/*.js'],
  buildScriptsDest: yeoman.app + '/build-scripts',
  buildScripts : [yeoman.app + '/build-scripts/**/*.js'],
  serverScripts: ['server/**/*.js'],
  styles: [yeoman.app + '/sass/**/*.scss'],
  mainStyles: [yeoman.app + '/sass/main.scss'],
  test: ['test/spec/**/*.js'],
  testRequire: [
    yeoman.app + '/bower_components/angular/angular.js',
    yeoman.app + '/bower_components/angular-mocks/angular-mocks.js',
    yeoman.app + '/bower_components/angular-resource/angular-resource.js',
    yeoman.app + '/bower_components/angular-cookies/angular-cookies.js',
    yeoman.app + '/bower_components/angular-sanitize/angular-sanitize.js',
    yeoman.app + '/bower_components/angular-route/angular-route.js',
    'test/mock/**/*.js',
    'test/spec/**/*.js'
  ],
  karma: 'karma.conf.js',
  views: {
    main: yeoman.app + '/index.html',
    files: [yeoman.app + '/views/**/*.html']
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

let lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

let styles = lazypipe()
  .pipe($.sass, {
    outputStyle: 'expanded',
    precision: 10
  })
  .pipe($.autoprefixer, 'last 1 version')
  .pipe(gulp.dest, 'app/styles');

let es6ClientScript = lazypipe()
  .pipe($.babel, {
    presets: ['es2015']
  })
  .pipe(gulp.dest, paths.buildScriptsDest);

let es6ServerScript = lazypipe()
  .pipe($.babel, {
    presets: ['es2015']
  })
  .pipe(gulp.dest, 'build-server');

///////////
// Tasks //
///////////

gulp.task('styles', function () {
  return gulp.src(paths.mainStyles)
    .pipe(styles());
});

gulp.task('lint:clientScripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('lint:serverScripts', function () {
  return gulp.src(paths.serverScripts)
    .pipe(lintScripts());
});

gulp.task('start:client', ['start:server'], function () {
  //openURL("http://localhost:9000","chrome");
});

gulp.task('start:server', ['styles', 'es6:frontend', 'es6:server', 'bower'], function(cb) {
  let started = false;
  return $.nodemon({
    script: 'build-server/app.js',
    ignore: ["app","dist","upload","node","node-v6.9.1","build-server"]
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('watch', function () {
  $.livereload.listen();
  $.watch(paths.styles, function(){
    return gulp.src(paths.mainStyles)
      .pipe($.plumber())
      .pipe(styles())
      .pipe($.livereload());
  });

  $.watch(paths.views.files)
    .pipe($.plumber())
    .pipe($.livereload());

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe(lintScripts())
    .pipe(es6ClientScript())
    .pipe($.livereload());

  $.watch(paths.serverScripts)
    .pipe($.plumber())
    .pipe(lintScripts())
    .pipe(es6ServerScript());

  $.watch(paths.test)
    .pipe($.plumber())
    .pipe($.livereload());

  gulp.watch('bower.json', ['bower']);
});

gulp.task('serve', function (cb) {
  runSequence(
    ['lint:clientScripts'],
    ['lint:serverScripts'],
    ['start:client'],
    'watch', cb);
});

// inject bower components
gulp.task('bower', function () {
  return gulp.src(paths.views.main)
    .pipe(wiredep({
      directory: yeoman.app + '/bower_components',
      ignorePath: '..',
      exclude: ['bower_components/mermaid/dist/mermaid.slim.js']
    }))
    .pipe(gulp.dest(yeoman.app));
});

///////////
// Build //
///////////

gulp.task('clean:dist', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('clean:server', function(cb) {
  rimraf('./build-server', cb);
});

gulp.task('clean:client', function(cb) {
  rimraf('./app/build-scripts', cb);
});

gulp.task('es6:frontend', () => {
  return gulp.src(paths.scripts)
    .pipe(es6ClientScript());
});

gulp.task('es6:server', () => {
  return gulp.src(paths.serverScripts)
    .pipe(es6ServerScript());
});

gulp.task('client:build', ['html', 'styles', 'es6:frontend', 'es6:server'], function () {
  let jsFilter = $.filter('**/*.js');
  let cssFilter = $.filter('**/*.css');

  return gulp.src(paths.views.main)
    .pipe($.useref({
      transformPath: function(filePath) {
        if(filePath.indexOf("/app/bower_components") === -1) {
          return filePath.replace('/bower_components', '/app/bower_components')
        }else{
          return filePath;
        }
      }
    }))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss({cache: true}))
    .pipe(cssFilter.restore())
    .pipe($.rev())
    .pipe($.revReplace())
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('client:rename', ['client:build'], function(){
  return gulp.src(yeoman.dist + "/index*.html")
    .pipe($.rimraf({force: true}))
    .pipe($.rename("index.html"))
    .pipe(gulp.dest(yeoman.dist))
});

gulp.task('html', function () {
  return gulp.src(yeoman.app + '/views/**/*')
    .pipe(gulp.dest(yeoman.dist + '/views'));
});

gulp.task('images', function () {
  return gulp.src(yeoman.app + '/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images'));
});

gulp.task('favicon', function(){
  return gulp.src(yeoman.app + '/favicon.ico')
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('pageNotFound', function(){
  return gulp.src(yeoman.app + '/404.html')
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('config', () => {
  return gulp.src("server/config.js.template")
    .pipe(gulp.dest("build-server"));
});

gulp.task('lib', ()=> {
  return gulp.src("server/lib/*").pipe(gulp.dest("build-server/lib"));
});

gulp.task('copy:extras', function () {
  return gulp.src(yeoman.app + '/*/.*', { dot: true })
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('copy:fonts', function () {
  return gulp.src(yeoman.app + '/bower_components/bootstrap/fonts/**/*')
    .pipe(gulp.dest(yeoman.dist + '/fonts'));
});

gulp.task('build', ['clean:dist', 'clean:server', 'clean:client'], function (cb) {
  runSequence(['config', 'lib', 'images', 'favicon', 'copy:extras', 'copy:fonts', 'client:rename', 'pageNotFound'], cb);
});

gulp.task('default', ['build']);
