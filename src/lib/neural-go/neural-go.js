import { wasmExec } from './wasm_exec';

const initNeuralGo = async () => {
  return new Promise((resolve) => {
    wasmExec();

    if (!WebAssembly.instantiateStreaming) { // polyfill
      WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer();
        return await WebAssembly.instantiate(source, importObject);
      };
    }

    // eslint-disable-next-line no-undef
    const go = new Go();
    let mod, inst;
    WebAssembly.instantiateStreaming(fetch('nnre.wasm'), go.importObject).then(async (result) => {
      mod = result.module;
      inst = result.instance;
      await initGoEngine();
    });

    const initGoEngine = async () => {
      resolve('Neural Go inited');
      await go.run(inst);
      inst = await WebAssembly.instantiate(mod, go.importObject);
    };

  });
};

export default initNeuralGo;
