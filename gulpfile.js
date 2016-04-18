var gulp =          require('gulp')
var gutil =          require('gulp-util')
var autoprefixer =  require('gulp-autoprefixer')
var clean =         require('gulp-clean')
var connect =       require('gulp-connect')
var cssnano =       require('gulp-cssnano')
var less =          require('gulp-less')
var rename =        require('gulp-rename')
var run =           require('gulp-sequence')
var watch =         require('gulp-watch')

var path = {
  src: {
    root: './src',
    html: './src',
    js: './src/js',
    img:  './src/img',
    lib:   './src/lib',
    less: './src/less',
    fonts: './src/fonts',
  },
  dist: {
    root: './dist',
    css:  './dist/css',
    js:  './dist/js',
    fonts: './dist/fonts',
    lib: './dist/lib',
    img:  './dist/img'
  }
}

var config = {

}

var errorLogger = function(err){
  gutil.log(gutil.colors.cyan(err.plugin)+' >>> '+gutil.colors.red(err.fileName+': '+err.message));
  this.emit('end');
}

var fn = {
  clean: function () {
    return gulp.src(path.dist.root)
      .pipe(clean({force: true}))
  },
  fonts: function () {
    return gulp.src(path.src.fonts+'/**/*')
      .pipe(gulp.dest(path.dist.fonts))
      .pipe(connect.reload())
  },
  js: function () {
    return gulp.src(path.src.js+'/**/*.js')
      .pipe(gulp.dest(path.dist.js))
      .pipe(connect.reload())
  },
  html: function () {
    return gulp.src(path.src.html+'/**/*.html')
      .pipe(gulp.dest(path.dist.root))
      .pipe(connect.reload())
  },
  img: function () {
    return gulp.src(path.src.img+'/**/*')
      .pipe(gulp.dest(path.dist.img))
      .pipe(connect.reload())
  },
  lib: function () {
    return gulp.src(path.src.lib+'/**/*')
      .pipe(gulp.dest(path.dist.lib))
      .pipe(connect.reload())
  },
  localserver: function () {
    connect.server({
      livereload: true,
      root: path.dist.root,
      port: 9000
    })
  },
  less: function () {
    return gulp.src(path.src.less+'/app.less')
      .pipe(less().on('error', errorLogger))
      .pipe(autoprefixer({
          browsers: [
            "Android 2.3",
            "Android >= 4",
            "Chrome >= 20",
            "Firefox >= 24",
            "Explorer >= 8",
            "iOS >= 6",
            "Opera >= 12",
            "Safari >= 6"
          ],
          cascade: false
      }))
      .pipe(cssnano())
      .pipe(rename({
        basename: "style",
        extname: '.min.css'
      }))
      .pipe(gulp.dest(path.dist.css))
      .pipe(connect.reload())
  },
  watch: function () {
    watch(path.src.html+'/**/*.html', function () { gulp.start(['html']) })
    watch(path.src.img+'/**/*', function () { gulp.start(['img']) })
    watch(path.src.lib+'/**/*', function () { gulp.start(['lib']) })
    watch(path.src.fonts+'/**/*', function () { gulp.start(['fonts']) })
    watch(path.src.js+'/**/*.js', function () { gulp.start(['js']) })
    watch(path.src.less+'/**/*.less', function () { gulp.start(['less']) })
  }
}

gulp.task('clean',fn.clean)
gulp.task('fonts',fn.fonts)
gulp.task('html',fn.html)
gulp.task('js',fn.js)
gulp.task('img',fn.img)
gulp.task('lib',fn.lib)
gulp.task('less',fn.less)
gulp.task('localserver',fn.localserver)
gulp.task('watch',fn.watch)

gulp.task('build', run('clean','less','html','js','lib','img','fonts'))
gulp.task('develop', run('build','watch','localserver'))
