import privateRegistry from '../privateRegistry';

export default function close() {
    return function(tiffPtr, filePath) {
        privateRegistry.TIFFClose(tiffPtr)
        // @ts-ignore
        FS.unlink(filePath);  
    }    
}