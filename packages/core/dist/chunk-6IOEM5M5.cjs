'use strict';

var chunkUV2QUUKW_cjs = require('./chunk-UV2QUUKW.cjs');
var fs = require('fs');
var dotenv = require('dotenv');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var fs__default = /*#__PURE__*/_interopDefault(fs);

var { readFile } = fs__default.default.promises;
var MastraBundler = class extends chunkUV2QUUKW_cjs.MastraBase {
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

exports.MastraBundler = MastraBundler;
