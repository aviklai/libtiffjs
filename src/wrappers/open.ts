// @ts-nocheck
import { uuidv4 } from "../utils";
import privateRegistry from '../privateRegistry';

export default function open() {
    return function (data) {
        const directory = '/';
        const filename = `${uuidv4()}.tiff`;
        if (data instanceof File) {
            FS.mount(WORKERFS, { files: [data] }, directory);
        } else if (data instanceof Blob) {
            FS.mount(WORKERFS, { blobs: [{ name: filename, data: data }] }, directory);
        } else {
            FS.createDataFile("/", filename, new Uint8Array(data), true, false);
        }
        const filePath = `/${filename}`;
        let tiffPtr = privateRegistry.TIFFOpen(filePath, 'r');
        return {tiffPtr, filePath, directory, filename};
    };
}