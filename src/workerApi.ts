import { uuidv4 } from "./utils";

const messages: any = {};
let workerPromise: any;
const _scripts = document.getElementsByTagName("script");
const THIS_SCRIPT = _scripts[_scripts.length - 1];

function getPathPrefix() {
  return THIS_SCRIPT.src.substring(0, THIS_SCRIPT.src.lastIndexOf("/")) + "/";
}

function initWorker() {
  if (typeof workerPromise === "undefined") {
    workerPromise = new Promise(function (resolve, reject) {
      const _worker = new Worker(getPathPrefix() + "libtiff-worker.js");

      _worker.onmessage = function (msg) {
        if (msg.data.ready) {
          _worker.onmessage = function (msg) {
            if (msg.data.success) {
              messages[msg.data.id][0](msg.data.result);
            } else {
              messages[msg.data.id][1](new Error(msg.data.message));
            }
            delete messages[msg.data.id];
          };
          resolve(_worker);
        }
      };
    });
  }
  return workerPromise;
}

function addMessageResolver(callback: any, errback: any) {
  let key = uuidv4();

  while (messages.hasOwnProperty(key)) {
    key = uuidv4();
  }
  messages[key] = [callback, errback];
  return key;
}

function callWorker(name: string, args: any) {
  return initWorker().then((worker: any) => {
    return new Promise(function (resolve, reject) {
      const resolverId = addMessageResolver(
        function (libtiffResult: any) {
          resolve(libtiffResult);
        },
        function (reason: any) {
          reject(reason);
        }
      );

      worker.postMessage({
        id: resolverId,
        function: name,
        arguments: args,
      });
    });
  });
}

export { initWorker, callWorker };
