'use strict';

var chunkEDBJG533_cjs = require('./chunk-EDBJG533.cjs');
var chunkUV2QUUKW_cjs = require('./chunk-UV2QUUKW.cjs');
var chunkRWTSGWWL_cjs = require('./chunk-RWTSGWWL.cjs');

// src/tts/index.ts
var _MastraTTS_decorators, _init, _a;
_MastraTTS_decorators = [chunkEDBJG533_cjs.InstrumentClass({
  prefix: "tts",
  excludeMethods: ["__setTools", "__setLogger", "__setTelemetry", "#log"]
})];
exports.MastraTTS = class MastraTTS extends (_a = chunkUV2QUUKW_cjs.MastraBase) {
  model;
  constructor({
    model
  }) {
    super({
      component: "TTS"
    });
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
exports.MastraTTS = /*@__PURE__*/(_ => {
  _init = chunkRWTSGWWL_cjs.__decoratorStart(_a);
  exports.MastraTTS = chunkRWTSGWWL_cjs.__decorateElement(_init, 0, "MastraTTS", _MastraTTS_decorators, exports.MastraTTS);
  chunkRWTSGWWL_cjs.__runInitializers(_init, 1, exports.MastraTTS);
  return exports.MastraTTS;
})();
