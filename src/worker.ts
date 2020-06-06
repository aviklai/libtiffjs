import { TiffTag } from "./tiffConsts";
import { uuidv4 } from "./utils";
const { libtiff, libtiffFS } = require('exports-loader?libtiff=Module,libtiffFS=FS!./tiff.raw.js');

const targetOrigin =  '*';

let initialized = false;

let registry: any = {};
let privateRegistry: any = {};

function readTiffFloat32(data: ArrayBuffer) {
    var fname = `${uuidv4()}.tiff`;
    libtiffFS.createDataFile("/", fname, new Uint8Array(data), true, false);
    var tiff = privateRegistry.TIFFOpen(fname, "r");

    if (privateRegistry.TIFFGetField(tiff, TiffTag.SAMPLESPERPIXEL) != 1) {
        alert("Only single channel images are supported");
        return;
    }

    var width = privateRegistry.TIFFGetField(tiff, TiffTag.IMAGEWIDTH);
    var height = privateRegistry.TIFFGetField(tiff, TiffTag.IMAGELENGTH);

    var numStrips = privateRegistry.TIFFNumberOfStrips(tiff);
    var rowsPerStrip = privateRegistry.TIFFGetField(tiff, TiffTag.ROWSPERSTRIP);

    var bytesPerSample = privateRegistry.TIFFGetField(tiff, TiffTag.BITSPERSAMPLE) / 8;
    var tiffFloatArray = new Float32Array(width * height);

    var sbuf = privateRegistry.TIFFMalloc(privateRegistry.TIFFStripSize(tiff));
    for (var s = 0; s < numStrips; ++s) {
        var read = privateRegistry.TIFFReadEncodedStrip(tiff, s, sbuf, -1);
        if (read == -1) {
            alert("Error reading encoded strip from TIFF file");
        }
        var stripData = new Float32Array(libtiff.HEAPU8.buffer, sbuf, read / bytesPerSample);
        tiffFloatArray.set(stripData, s * rowsPerStrip * width);
    }
    privateRegistry.TIFFFree(sbuf);    
    privateRegistry.TIFFClose(tiff);
    libtiffFS.unlink("/" + fname);
    return tiffFloatArray;
}


libtiff.onRuntimeInitialized = () => {
    privateRegistry.TIFFOpen = libtiff.cwrap('TIFFOpen', 'number', ['string', 'string']);
    privateRegistry.TIFFClose = libtiff.cwrap('TIFFClose', 'number', ['number']);
    privateRegistry.TIFFNumberOfStrips = libtiff.cwrap('TIFFNumberOfStrips', 'number', ['number']);
    privateRegistry.TIFFStripSize = libtiff.cwrap('TIFFStripSize', 'number', ['number']);
    privateRegistry.TIFFReadEncodedStrip = libtiff.cwrap('TIFFReadEncodedStrip', 'number', ['number', 'number', 'number', 'number']);
    privateRegistry.TIFFMalloc = libtiff.cwrap('_TIFFmalloc', 'number', ['number']);
    privateRegistry.TIFFFree = libtiff.cwrap('_TIFFfree', 'number', ['number']);
    privateRegistry.TIFFGetField = libtiff.cwrap('GetField', 'number', ['number', 'number']);
    privateRegistry.TIFFLastDirectory = libtiff.cwrap('LastDirectory', 'number', ['number']);
    privateRegistry.TIFFReadDirectory = libtiff.cwrap('ReadDirectory', 'number', ['number']);
    privateRegistry.TIFFSetDirectory = libtiff.cwrap('SetDirectory', 'number', ['number', 'number']);
    privateRegistry.TIFFGetStringField = libtiff.cwrap('GetStringField', 'string', ['number', 'number']);
    registry.readTiffFloat32 = readTiffFloat32; 
    initialized = true;
    postMessage({ready: true}, targetOrigin);
};


onmessage = function (msg) {
  if (!initialized) {
      postMessage({success: false, message: 'Runtime not yet initialized'}, targetOrigin);
      return;
  }
  if (msg.data['function'] && registry[msg.data['function']]) {
      let func = registry[msg.data['function']];

      let args = msg.data.arguments;

      try {
          let result = func(...args);

          postMessage({
              success: true,
              result: result,
              id: msg.data.id
          }, targetOrigin);
      } catch (error) {
          postMessage({
              success: false,
              message: error.message,
              id: msg.data.id
          }, targetOrigin);
      }
      return;
  }
  postMessage({
      success: false,
      message: 'No "function" key specified or function not found',
      id: msg.data.id
  }, targetOrigin);
};