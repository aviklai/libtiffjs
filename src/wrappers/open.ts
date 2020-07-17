import { uuidv4 } from "../utils";

export default function open(privateRegistry) {
  return function (data) {
    const directory = "/";
    const filename = `${uuidv4()}.tiff`;
    if (data instanceof File) {
      // @ts-ignore
      FS.mount(WORKERFS, { files: [data] }, directory);
    } else if (data instanceof Blob) {
      FS.mount(
        // @ts-ignore
        WORKERFS,
        { blobs: [{ name: filename, data: data }] },
        directory
      );
    } else {
      FS.createDataFile("/", filename, new Uint8Array(data), true, false, true);
    }
    const filePath = `/${filename}`;
    const tiffPtr = privateRegistry.TIFFOpen(filePath, "r");
    return { tiffPtr, filePath, directory, filename };
  };
}
