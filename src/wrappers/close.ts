export default function close(privateRegistry: any) {
  return function (tiffPtr: number, filePath: string): void {
    privateRegistry.TIFFClose(tiffPtr);
    FS.unlink(filePath);
  };
}
