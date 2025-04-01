import { MastraBase } from './chunk-WUPACWA6.js';
import fs from 'fs';
import { parse } from 'dotenv';

var { readFile } = fs.promises;
var MastraBundler = class extends MastraBase {
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

export { MastraBundler };
