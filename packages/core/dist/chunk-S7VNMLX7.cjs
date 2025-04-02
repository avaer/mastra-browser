'use strict';

var chunkSUWCCDLE_cjs = require('./chunk-SUWCCDLE.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');
var fs = require('fs');
var dotenv = require('dotenv');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var fs__default = /*#__PURE__*/_interopDefault(fs);

var { readFile } = fs__default.default.promises;
var _MastraBundler = class _MastraBundler extends chunkSUWCCDLE_cjs.MastraBase {
  constructor({ name, component = "BUNDLER" }) {
    super({ component, name });
  }
  async loadEnvVars() {
    const envVars = /* @__PURE__ */ new Map();
    for (const file of await this.getEnvFiles()) {
      const content = await readFile(file, "utf-8");
      const config = dotenv.parse(content);
      Object.entries(config).forEach(([key, value]) => {
        envVars.set(key, value);
      });
    }
    return envVars;
  }
};
chunk7D636BPD_cjs.__name(_MastraBundler, "MastraBundler");
var MastraBundler = _MastraBundler;

exports.MastraBundler = MastraBundler;
//# sourceMappingURL=chunk-S7VNMLX7.cjs.map
//# sourceMappingURL=chunk-S7VNMLX7.cjs.map