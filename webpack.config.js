const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const outputPath = 'lib';

module.exports = {
    // Change to your "entry-point".
    entry: {
        index: __dirname + '/src/index.ts',
        'libtiff-worker': __dirname + '/src/worker.ts'
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, outputPath),
        filename: '[name].js',
        library: 'libtiffjs',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'this'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            // Include ts, tsx, js, and jsx files.
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        },
        {
            test: /\.wasm$/,
            type: 'javascript/auto',
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: 'lib/',
            },
        }],        
    },
    node: {
        fs: 'empty'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.join('./src', 'tiff.raw.wasm'), to: path.join(__dirname, outputPath) },
                { from: path.join('./src', 'tiff.raw.js'), to: path.join(__dirname, outputPath) }   
            ]
        })        
      ],
};