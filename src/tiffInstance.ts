import { callWorker } from './workerApi';

export default class TiffInstance {
    tiffPtr: number;
    filePath: string;
    directory: string;
    filename: string;
    constructor(tiffPtr: number, filePath: string, directory: string, filename: string) {
        this.tiffPtr = tiffPtr;
        this.filePath = filePath;
        this.directory = directory;
        this.filename = filename;
    }

    _deleteSelf() {
        delete this.tiffPtr;
        delete this.filePath;
        delete this.directory;
        delete this.filename;
    }

    close() {
        return callWorker('close', [this.tiffPtr, this.filePath])
            .then(
                (result: any) => {
                    this._deleteSelf();
                    return result;
                },
                (reason: any) => {
                    this._deleteSelf();
                    throw reason;
                }
            );
    }    
    
    width() {
        return callWorker('width', [this.tiffPtr]);
    }

    height() {
        return callWorker('height', [this.tiffPtr]);
    }  

    readTiffFloat32() {
        return callWorker('readTiffFloat32', [this.tiffPtr]);
    }
}
