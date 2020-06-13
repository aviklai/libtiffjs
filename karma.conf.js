module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'chai'],
        preprocessors: {
            'test/**/*.spec.js': ['babel']
        },
        babelPreprocessor: {
            filename: function (file) {
                return file.originalPath.replace(/\.js$/, '.es5.js');
            },
            sourceFileName: function (file) {
                return file.originalPath;
            }
        },
        files: [
            'lib/index.js',
            {
                pattern: 'lib/libtiff-worker.js',
                watched: true,
                included: false,
                served: true
            },
            {
                pattern: 'lib/*.js.map',
                watched: false,
                included: false,
                served: true
            },
            'test/**/*.spec.js',
            {
                pattern: 'lib/tiff.raw.*',
                watched: false,
                included: false,
                served: true
            },
            {
                pattern: 'test/assets/*',
                watched: false,
                included: false,
                served: true
            }
        ],     
        proxies: {
            '/base/lib/libtiffjs': '/base/base/index.js',
        },   
        // WebAssembly takes a while to parse
        browserDisconnectTimeout: 4000,
        reporters: ['progress'],
        port: 9876, // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        concurrency: Infinity
    });
};
