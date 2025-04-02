import { MastraBase } from './chunk-LE72NI7K.js';
import { __name } from './chunk-WH5OY6PO.js';
import fs from 'fs';
import { parse } from 'dotenv';

var { readFile } = fs.promises;
var _MastraBundler = class _MastraBundler extends MastraBase {
  constructor({ name, component = "BUNDLER" }) {
    super({ component, name });
  }
  async loadEnvVars() {
    const envVars = /* @__PURE__ */ new Map();
    for (const file of await this.getEnvFiles()) {
      const content = await readFile(file, "utf-8");
      const config = parse(content);
      Object.entries(config).forEach(([key, value]) => {
        envVars.set(key, value);
      });
    }
    return envVars;
  }
};
__name(_MastraBundler, "MastraBundler");
var MastraBundler = _MastraBundler;

export { MastraBundler };
//# sourceMappingURL=chunk-CHKJU2XI.js.map
//# sourceMappingURL=chunk-CHKJU2XI.js.map