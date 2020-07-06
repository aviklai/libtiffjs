const tinyFloatTifPath = '/base/test/assets/tiny-float.tif';
const tiff8bit1channel = 'base/test/assets/palette-1c-8b.tif'

function xhrAsPromiseArrayBuffer(url) {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    return new Promise(function (resolve, reject) {
        xhr.onload = function (oEvent) {
            resolve(xhr.response);
        };
        xhr.onerror = function (oEvent) {
            reject(oEvent);
        };
        xhr.send();
    });
}

describe('Given that libtiffjs exists', () => {
    before(function () {
        this.timeout(15000);
        return libtiffjs.initialize();
    });   

    describe('Checking close', function () {
        it('should close the file', () => {
            return xhrAsPromiseArrayBuffer(tinyFloatTifPath)
                .then((tifBlob) => libtiffjs.open(tifBlob))
                .then((tiffInstance) => tiffInstance.close())
        });
    });

    describe('Checking width', function () {
        it('should return a number', () => {
            return xhrAsPromiseArrayBuffer(tinyFloatTifPath)
                .then((tifBlob) => libtiffjs.open(tifBlob))
                .then((tiffInstance) => tiffInstance.width())
                .then((width) => expect(width).to.be.a('number'));
        });
    });

    describe('Checking height', function () {
        it('should return a number', () => {
            return xhrAsPromiseArrayBuffer(tinyFloatTifPath)
                .then((tifBlob) => libtiffjs.open(tifBlob))
                .then((tiffInstance) => tiffInstance.height())
                .then((height) => expect(height).to.be.a('number'));
        });
    });

    describe('calling open with arraybuffer', function () {
        it('should return a float32array', () => {
            return xhrAsPromiseArrayBuffer(tinyFloatTifPath)
                .then((tifBlob) => libtiffjs.open(tifBlob))
                .then((tiffInstance) => tiffInstance.readTiffFloat32())
                .then((data) => expect(data).to.be.a('float32array'));
        });
    });

    describe('calling readRGBAImage', function () {
        it('should return a rgba image', () => {
            return xhrAsPromiseArrayBuffer(tiff8bit1channel)
                .then((tifBlob) => libtiffjs.open(tifBlob))
                .then((tiffInstance) => tiffInstance.readRGBAImage())
                .then((data) => expect(data).to.be.a('uint8Array'));
        });
    });    
});