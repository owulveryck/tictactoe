let add = null;
import('./../assets/wasm/add.wasm').then(addModule => {
  add = addModule.add;
});

export { add };