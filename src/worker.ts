// @ts-nocheck
import { TiffTag } from "./tiffConsts";
import { uuidv4 } from "./utils";
import open from './wrappers/open';
import readTiffFloat32 from './wrappers/readTiffFloat32';
import privateRegistry from './privateRegistry';

let initialized = false;
let registry: any = {};
var openedFiles = [];

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
        registry.open = open(
            self.Module.cwrap('TIFFOpen', 'number', ['string', 'string']),
            openedFiles
        );  
        registry.close = (tiffPtr: number, filePath: string) => {
            privateRegistry.TIFFClose(tiffPtr)
            FS.unlink(filePath);
        };              
        registry.width = (tiffPtr: number) => (privateRegistry.TIFFGetField(tiffPtr, TiffTag.IMAGEWIDTH));
        registry.height = (tiffPtr: number) => (privateRegistry.TIFFGetField(tiffPtr, TiffTag.IMAGELENGTH));
        registry.readTiffFloat32 = readTiffFloat32();
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