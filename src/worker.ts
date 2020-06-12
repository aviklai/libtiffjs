// @ts-nocheck
import { TiffTag } from "./tiffConsts";
import { uuidv4 } from "./utils";

let initialized = false;
let registry: any = {};
let privateRegistry: any = {};

function readTiffFloat32(data: ArrayBuffer) {
    var fname = `${uuidv4()}.tiff`;
    FS.createDataFile("/", fname, new Uint8Array(data), true, false);
    var tiff = privateRegistry.TIFFOpen(fname, "r");

    if (privateRegistry.TIFFGetField(tiff, TiffTag.SAMPLESPERPIXEL) != 1) {
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
        var stripData = new Float32Array(HEAPF32.buffer, sbuf, read / bytesPerSample);
        tiffFloatArray.set(stripData, s * rowsPerStrip * width);
    }
    privateRegistry.TIFFFree(sbuf);    
    privateRegistry.TIFFClose(tiff);
    FS.unlink("/" + fname);
    return tiffFloatArray;
}

self.Module = {
    onRuntimeInitialized: function() {
        privateRegistry.TIFFOpen = self.Module.cwrap('TIFFOpen', 'number', ['string', 'string']);
        privateRegistry.TIFFClose = self.Module.cwrap('TIFFClose', 'number', ['number']);
        privateRegistry.TIFFNumberOfStrips = self.Module.cwrap('TIFFNumberOfStrips', 'number', ['number']);
        privateRegistry.TIFFStripSize = self.Module.cwrap('TIFFStripSize', 'number', ['number']);
        privateRegistry.TIFFReadEncodedStrip = self.Module.cwrap('TIFFReadEncodedStrip', 'number', ['number', 'number', 'number', 'number']);
        privateRegistry.TIFFMalloc = self.Module.cwrap('_TIFFmalloc', 'number', ['number']);
        privateRegistry.TIFFFree = self.Module.cwrap('_TIFFfree', 'number', ['number']);
        privateRegistry.TIFFGetField = self.Module.cwrap('GetField', 'number', ['number', 'number']);
        privateRegistry.TIFFLastDirectory = self.Module.cwrap('LastDirectory', 'number', ['number']);
        privateRegistry.TIFFReadDirectory = self.Module.cwrap('ReadDirectory', 'number', ['number']);
        privateRegistry.TIFFSetDirectory = self.Module.cwrap('SetDirectory', 'number', ['number', 'number']);
        privateRegistry.TIFFGetStringField = self.Module.cwrap('GetStringField', 'string', ['number', 'number']);
        registry.readTiffFloat32 = readTiffFloat32; 
        initialized = true;
        postMessage({ready: true});
    }
};

importScripts('tiff.raw.js');

onmessage = function (msg) {
  if (!initialized) {
      postMessage({success: false, message: 'Runtime not yet initialized'});
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
          });
      } catch (error) {
          postMessage({
              success: false,
              message: error.message,
              id: msg.data.id
          });
      }
      return;
  }
  postMessage({
      success: false,
      message: 'No "function" key specified or function not found',
      id: msg.data.id
  });
};