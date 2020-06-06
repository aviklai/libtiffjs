// @ts-ignore
import libtiffModule from './tiff.raw.wasm';
import { initWorker, callWorker } from './workerApi';

function readTiffFloat32(data: any) {
    return callWorker('readTiffFloat32', [data], [data]).then(
        function (result: any) {
            return result;
        },
        function (error: any) { throw error; }
    );
}

function initialize() {
    return initWorker();
}

export { initialize, readTiffFloat32 };
