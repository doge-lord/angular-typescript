module.exports = function (config) {
  config.set({
    // preprocess matching files before serving them to the browser
    preprocessors: {
      "./src/*.ts": ["browserify"],
      "./src/*/*.ts": ["browserify"]
    },

    // frameworks to use
    frameworks: ["browserify", "jasmine"],

    // list of files / patterns to load in the browser
    files: [
      "./public/assets/js/vendor.js",
      "./app_components/angular-mocks/angular-mocks.js",
      "./src/*.ts",
      "./src/*/*.ts"
    ],

    // list of files to exclude
    exclude: [
    ],

    browserify: {
      plugin: ["tsify"]
    },

    // test results reporter to use
    // possible values: "dots", "progress"
    reporters: ["progress"],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    browsers: ["PhantomJS"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}