'use strict';

var chunkXXM463NA_cjs = require('./chunk-XXM463NA.cjs');
var chunkSUWCCDLE_cjs = require('./chunk-SUWCCDLE.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');

// src/tts/index.ts
var _MastraTTS_decorators, _init, _a;
_MastraTTS_decorators = [chunkXXM463NA_cjs.InstrumentClass({
  prefix: "tts",
  excludeMethods: ["__setTools", "__setLogger", "__setTelemetry", "#log"]
})];
var _MastraTTS = class _MastraTTS extends (_a = chunkSUWCCDLE_cjs.MastraBase) {
  constructor({
    model
  }) {
    super({
      component: "TTS"
    });
    chunk7D636BPD_cjs.__publicField(this, "model");
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
  _init = chunk7D636BPD_cjs.__decoratorStart(_a);
  _MastraTTS = chunk7D636BPD_cjs.__decorateElement(_init, 0, "MastraTTS", _MastraTTS_decorators, _MastraTTS);
  chunk7D636BPD_cjs.__name(_MastraTTS, "MastraTTS");
  return _MastraTTS;
})();
chunk7D636BPD_cjs.__runInitializers(_init, 1, _MastraTTS);
var MastraTTS = _MastraTTS;

exports.MastraTTS = MastraTTS;
//# sourceMappingURL=chunk-LUYBA3WN.cjs.map
//# sourceMappingURL=chunk-LUYBA3WN.cjs.map