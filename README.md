[![Build Status](https://travis-ci.org/aviklai/libtiffjs.svg?branch=master)](https://travis-ci.org/libtiffjs) 
[![Coverage Status](https://coveralls.io/repos/github/aviklai/libtiffjs/badge.svg?branch=master)](https://coveralls.io/github/aviklai/libtiffjs?branch=master) 
[![npm version](https://img.shields.io/npm/v/libtiffjs.svg)](https://www.npmjs.com/package/libtiffjs)

# libtiffjs

Reading tiff using libtiff, compiled to webassembly. <br />
Inspired by loam (Worker and wasm communication architecture) - https://github.com/azavea/loam <br />
Using libtiff wasm - https://github.com/Twinklebear/tiff.js

## Installation instructions - webpack
1. Run `npm install --save libtiffjs`
2. Install file-loader: `npm install --save-dev file-loader` 
3. Add the following alias to webpack config file: `libtiffjs: path.join(__dirname, 'node_modules', 'libtiffjs', 'lib')`
4. Load libtiffjs files using file-loader (add to webpack config):  
```
{ 
   test: /(libtiff-worker\.js|tiff\.raw\.wasm|tiff\.raw\.js)$/,
   type: 'javascript/auto',
   loader: 'file-loader?name=[name].[ext]',
}
```
5. To load the library in your code:  
```
import * as libtiffjs from 'libtiffjs';
require('libtiffjs/libtiff-worker.js'); 
require('libtiffjs/tiff.raw.js');
require('libtiffjs/tiff.raw.wasm');
libtiffjs.initialize();
```

## Demo
https://libtiffjs.netlify.app <br />
<br />
The demo code is available here: <br />
https://github.com/aviklai/libtiffjs-example