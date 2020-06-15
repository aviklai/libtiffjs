import privateRegistry from '../privateRegistry';
import { TiffTag } from '../tiffConsts';

export default function readTiffFloat32() {
    return function(tiffPtr) {
        if (privateRegistry.TIFFGetField(tiffPtr, TiffTag.SAMPLESPERPIXEL) != 1) {
            return;
        }
        var width = privateRegistry.TIFFGetField(tiffPtr, TiffTag.IMAGEWIDTH);
        var height = privateRegistry.TIFFGetField(tiffPtr, TiffTag.IMAGELENGTH);

        var numStrips = privateRegistry.TIFFNumberOfStrips(tiffPtr);
        var rowsPerStrip = privateRegistry.TIFFGetField(tiffPtr, TiffTag.ROWSPERSTRIP);

        var bytesPerSample = privateRegistry.TIFFGetField(tiffPtr, TiffTag.BITSPERSAMPLE) / 8;
        var tiffFloatArray = new Float32Array(width * height);

        var sbuf = privateRegistry.TIFFMalloc(privateRegistry.TIFFStripSize(tiffPtr));
        for (var s = 0; s < numStrips; ++s) {
            var read = privateRegistry.TIFFReadEncodedStrip(tiffPtr, s, sbuf, -1);
            if (read == -1) {
                alert("Error reading encoded strip from TIFF file");
            }
            // @ts-ignore
            var stripData = new Float32Array(HEAPF32.buffer, sbuf, read / bytesPerSample);
            tiffFloatArray.set(stripData, s * rowsPerStrip * width);
        }
        privateRegistry.TIFFFree(sbuf);    
        return tiffFloatArray;
    }    
}