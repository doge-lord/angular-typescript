var gulp = require("gulp");
var concat = require("gulp-concat");
var clean = require('gulp-clean');
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var gutil = require("gulp-util");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var templateCache = require("gulp-angular-templatecache");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");

var browserify = require("browserify");
var tsify = require("tsify");
var watchify = require("watchify");

/*-
 * Source Paths
 */
var JS_SOURCE_PATH = "./src/app.ts";
var CSS_SOURCE_PATH = "./src/app.scss";

/*-
 * Build Paths
 */
var JS_BUILD_PATH = "./public/assets/js";
var CSS_BUILD_PATH = "./public/assets/css";
var FONTS_BUILD_PATH = "./public/assets/fonts";

//==============================================================================
// WATCH FUNCTIONS
//==============================================================================

/**
 * Watches the for any changes to the TS files and compiles if necessary
 * 
 * @param {any} sourcePath
 * @param {any} outFileName
 * @returns
 */
function watchTypescript(sourcePath, outFileName) {
    var bundler = watchify(browserify({
        basedir: ".",
        debug: true,
        entries: [sourcePath],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify));

    bundler.on("update", rebundle);
    bundler.on("log", gutil.log);

    function rebundle() {
        return bundler.bundle()
            .on("error", gutil.log)
            .pipe(source(outFileName))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            //.pipe(uglify())
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest(JS_BUILD_PATH));
    }

    return rebundle();
}

/**
 * Watches the for any changes to the HTML files and compiles if necessary
 */
function watchTemplates() {
    gulp.watch(["./src/**/*.html"], ["build-app:html"]);
}

/**
 * Watches the for any changes to the SCSS files and compiles if necessary
 */
function watchStyles() {
    gulp.watch(["./src/**/*.scss"], ["build-app:css"]);
}

//==============================================================================
// UTILITY FUNCTIONS
//==============================================================================
function prependUnderscoreFileName(filePath, fileDest) {
    return gulp.src(filePath)
        .pipe(rename({
            prefix: "_",
            dirname: ""
        }))
        .pipe(gulp.dest(fileDest));
}

//==============================================================================
// UTILITY TASKS
//==============================================================================
/*-
 * Clean generated SCSS modules 
 */
gulp.task("util-app:clean-scss", function () {
    return gulp.src("./src/styles/components/*.scss", { read: false })
        .pipe(clean());
});

/*-
 * Prepare SCSS files for compiling
 */
gulp.task("util-app:prepare-scss", ["util-app:clean-scss"], function () {
    return prependUnderscoreFileName("./src/components/**/*.scss", "./src/styles/components/");
});

/*-
 * Build CSS from SCSS files
 */
gulp.task("util-app:compile-scss", ["util-app:prepare-scss"], function () {
    return gulp.src([
        CSS_SOURCE_PATH
    ])
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sass({
            includePaths: [
                "./app_components/bootstrap-sass/assets/stylesheets"
            ]//,
            //outputStyle: "compressed"
        }).on("error", sass.logError))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(CSS_BUILD_PATH));
});

//==============================================================================
// BUILD TASKS
//==============================================================================
/*-
 * Build application source js file
 */
gulp.task("build-app:js", function () {
    return browserify({
        basedir: ".",
        debug: true,
        entries: [JS_SOURCE_PATH],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source("app.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
 //       .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(JS_BUILD_PATH));
});

/*-
 * Build application template js file
 */
gulp.task("build-app:html", function () {
    return gulp.src([
        "./src/components/**/*.html",
        "./src/templates/*.html"
    ])
        .pipe(templateCache("templates.js", {
            module: "app",
            transformUrl: function (url) {
                return url.replace(/^[^\\]*\\/, "")
            }
        }))
        .pipe(gulp.dest(JS_BUILD_PATH));
});

/*-
 * Build application styles css file
 */
gulp.task("build-app:css", ["util-app:compile-scss"], function () {
    return gulp.src("./src/styles/components/*.scss", { read: false })
        .pipe(clean());
});

/*-
 * Build application vendor js file
 */
gulp.task("build-vendor:js", function () {
    return gulp.src([
        "app_components/core.js/client/shim.js",
        "app_components/angular/angular.min.js",
        "app_components/angular-resource/angular-resource.min.js",
        "app_components/angular-route/angular-route.min.js"
    ])
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest(JS_BUILD_PATH))
        .pipe(uglify())
        .pipe(gulp.dest(JS_BUILD_PATH));
});

/*-
 * Build application fonts file
 */
gulp.task("build-vendor:fonts", function () {
    return gulp.src([
        "app_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.*"
    ])
        .pipe(gulp.dest(FONTS_BUILD_PATH));
});

//==============================================================================
// WATCH APP
//==============================================================================
gulp.task("watch", ["build"], function () {
    watchTypescript(JS_SOURCE_PATH, "app.js");
    watchTemplates();
    watchStyles();
});

//==============================================================================
// BUILD APP
//==============================================================================
gulp.task("build", [
    "build-vendor:js",
    "build-app:js",
    "build-app:html",
    "build-app:css",
    "build-vendor:fonts"
]);

//==============================================================================
// DEFAULT TASK
//==============================================================================
gulp.task("default", ["build"]);