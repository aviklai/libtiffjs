import privateRegistry from '../privateRegistry';
import { TiffTag } from '../tiffConsts';

export default function readTiffFloat32() {
    return function(tiffPtr) {
        if (privateRegistry.TIFFGetField(tiffPtr, TiffTag.SAMPLESPERPIXEL) != 1) {
            return;
        }
        const width = privateRegistry.TIFFGetField(tiffPtr, TiffTag.IMAGEWIDTH);
        const height = privateRegistry.TIFFGetField(tiffPtr, TiffTag.IMAGELENGTH);

        const numStrips = privateRegistry.TIFFNumberOfStrips(tiffPtr);
        const rowsPerStrip = privateRegistry.TIFFGetField(tiffPtr, TiffTag.ROWSPERSTRIP);

        const bytesPerSample = privateRegistry.TIFFGetField(tiffPtr, TiffTag.BITSPERSAMPLE) / 8;
        const tiffFloatArray = new Float32Array(width * height);

        const sbuf = privateRegistry.TIFFMalloc(privateRegistry.TIFFStripSize(tiffPtr));
        for (let s = 0; s < numStrips; ++s) {
            const read = privateRegistry.TIFFReadEncodedStrip(tiffPtr, s, sbuf, -1);
            if (read == -1) {
                throw new Error("Error reading encoded strip from TIFF file");
            }
            // @ts-ignore
            const stripData = new Float32Array(HEAPF32.buffer, sbuf, read / bytesPerSample);
            tiffFloatArray.set(stripData, s * rowsPerStrip * width);
        }
        privateRegistry.TIFFFree(sbuf);    
        return tiffFloatArray;
    }    
}