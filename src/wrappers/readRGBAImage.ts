import privateRegistry from '../privateRegistry';
import { TiffTag } from '../tiffConsts';

export default function readRGBAImage() {
    return function(tiffPtr) {
        const width = privateRegistry.TIFFGetField(tiffPtr, TiffTag.IMAGEWIDTH);
        const height = privateRegistry.TIFFGetField(tiffPtr, TiffTag.IMAGELENGTH);
        const raster: number = privateRegistry.TIFFMalloc(width * height * 4);
        const result = privateRegistry.TIFFReadRGBAImageOriented(tiffPtr, width, height, raster, 1, 0);
        if (result === 0) {
            throw new Error(`readRGBAImage returns null`);
        }
        // @ts-ignore
        const image = HEAPU8.subarray(raster, raster + width * height * 4);
        privateRegistry.TIFFFree(raster);
        return image;    
    }    
}