const gulp = require("gulp"),
  pug = require("gulp-pug"),
  htmlmin = require("gulp-htmlmin"),
  sass = require("gulp-sass"),
  sassGlob = require('gulp-sass-glob'),
  prefix = require("gulp-autoprefixer"),
  cssmin = require("gulp-cssnano"),
  babel = require("gulp-babel"),
  jsmin = require("gulp-uglify"),
  srcmap = require("gulp-sourcemaps"),
  concat = require("gulp-concat"),
  notify = require("gulp-notify"),
  connect = require("gulp-connect"),
  openurl = require("openurl");

// HTML 
gulp.task("html", () => {
  return gulp.src("./pug/pages/index.pug")
    .pipe(pug({
      pretty: true
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("../"))
    .pipe(connect.reload())
    .pipe(notify("HTML task is done."));
});

// CSS
gulp.task("css", () => {
  return gulp
    .src("./style/sass/app.scss")
    .pipe(srcmap.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(
      prefix({
        cascade: false
      })
    )
    .pipe(concat("app.min.css"))
    .pipe(cssmin())
    .pipe(srcmap.write("../maps"))
    .pipe(gulp.dest("../style"))
    .pipe(connect.reload())
    .pipe(notify("CSS task is done."));
});

// JS
gulp.task("js", () => {
  return gulp
    .src(["./script/app.js"])
    .pipe(srcmap.init())
    .pipe(babel())
    .pipe(concat("app.min.js"))
    .pipe(jsmin())
    .pipe(srcmap.write("../maps"))
    .pipe(gulp.dest("../script"))
    .pipe(connect.reload())
    .pipe(notify("JS task is done."));
});

// Other
// copy htmlshiv
gulp.task("htmlshiv", () => {
  return gulp
    .src("./script/html5shiv.js")
    .pipe(babel())
    .pipe(jsmin())
    .pipe(gulp.dest("../script"))
    .pipe(connect.reload())
    .pipe(notify("HTMLSHIV task is done."));
});

// copy darkmode 
gulp.task('darkmode', () => {
  return gulp.src(["./style/darkmode.css"])
    .pipe(
      prefix({
        cascade: false
      })
    )
    .pipe(cssmin())
    .pipe(gulp.dest("../style"))
    .pipe(notify("Darkmode task is done."));
});

// copy files
gulp.task('copy', () => {
  return gulp.src(["./README.md", "./manifest.json", "./serviceWorker.js","./.gitignore"])
    .pipe(gulp.dest("../"))
    .pipe(notify("Files task is done."));
});

// copy images
gulp.task('img', () => {
  return gulp.src(["./img/**/*.*"])
    .pipe(gulp.dest("../img"))
    .pipe(notify("Images task is done."));
});

// gitignore
gulp.task('gitignore', () => {
  return gulp.src(["./.gitignore"])
    .pipe(gulp.dest("../"))
    .pipe(notify("Git ignore task is done."));
});

// readme
gulp.task('readme', () => {
  return gulp.src(["./README.md"])
    .pipe(gulp.dest("../"))
    .pipe(notify("README task is done."));
});

// service worker
gulp.task('serviceworker', () => {
  return gulp.src(["./serviceWorker.js"])
    .pipe(gulp.dest("../"))
    .pipe(notify("service worker task is done."));
});

// service worker
gulp.task('manifest', () => {
  return gulp.src(["./manifest.json"])
    .pipe(gulp.dest("../"))
    .pipe(notify("manifest task is done."));
});

// WATCH 
gulp.task("watch", async () => {
  // init server 
  let port = 8080;
  connect.server({
    root: "../",
    port,
    livereload: true
  });
  openurl.open(`http://localhost:${port}`);

  // watch files
  gulp.watch("./pug/**/*.pug", gulp.series("html"));
  gulp.watch("./style/sass/**/*.scss", gulp.series("css"));
  gulp.watch(["./script/*.js", "!./script/html5shiv.js"], gulp.series("js"));
  gulp.watch("./script/html5shiv.js", gulp.series("htmlshiv"));
  gulp.watch("./style/darkmode.css", gulp.series("darkmode"));
  gulp.watch("./README.md", gulp.series("readme"));
  gulp.watch("./.gitignore", gulp.series("gitignore"));
  gulp.watch("./serviceWorker.js", gulp.series("serviceworker"));
  gulp.watch("./manifest.json", gulp.series("manifest"));
});

// DEFAULT 
gulp.task("default", gulp.series("html", "css", "js", "htmlshiv", "darkmode", "copy", "img", "watch"));