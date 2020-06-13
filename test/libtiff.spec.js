const tinyFloatTifPath = '/base/test/assets/tiny-float.tif';

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

    describe('calling open with arraybuffer', function () {
        it('should return a float32array', () => {
            return xhrAsPromiseArrayBuffer(tinyFloatTifPath)
                .then((tifBlob) => libtiffjs.readTiffFloat32(tifBlob))
                .then((data) => expect(data).to.be.a('float32array'));
        });
    });
});