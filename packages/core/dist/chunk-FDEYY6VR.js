import { InstrumentClass } from './chunk-GCXZG37R.js';
import { MastraBase } from './chunk-LE72NI7K.js';
import { __runInitializers, __publicField, __decoratorStart, __decorateElement, __name } from './chunk-WH5OY6PO.js';

// src/tts/index.ts
var _MastraTTS_decorators, _init, _a;
_MastraTTS_decorators = [InstrumentClass({
  prefix: "tts",
  excludeMethods: ["__setTools", "__setLogger", "__setTelemetry", "#log"]
})];
var _MastraTTS = class _MastraTTS extends (_a = MastraBase) {
  constructor({
    model
  }) {
    super({
      component: "TTS"
    });
    __publicField(this, "model");
    this.model = model;
  }
  traced(method, methodName) {
    return this.telemetry?.traceMethod(method, {
      spanName: `${this.model.name}-tts.${methodName}`,
      attributes: {
        "tts.type": `${this.model.name}`
      }
    }) ?? method;
  }
};
_MastraTTS = /*@__PURE__*/(_ => {
  _init = __decoratorStart(_a);
  _MastraTTS = __decorateElement(_init, 0, "MastraTTS", _MastraTTS_decorators, _MastraTTS);
  __name(_MastraTTS, "MastraTTS");
  return _MastraTTS;
})();
__runInitializers(_init, 1, _MastraTTS);
var MastraTTS = _MastraTTS;

export { MastraTTS };
//# sourceMappingURL=chunk-FDEYY6VR.js.map
//# sourceMappingURL=chunk-FDEYY6VR.js.map