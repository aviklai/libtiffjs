import { initWorker, callWorker } from './workerApi';
import TiffInstace from './tiffInstance'

function open(data: any) {
    return callWorker('open', [data]).then(
        function (result: any) {
            return new TiffInstace(
                result.tiffPtr,
                result.filePath,
                result.directory,
                result.filename
            );
        },
        function (error: any) { throw error; }
    );
}

function initialize() {
    return initWorker();
}

export { initialize, open };
