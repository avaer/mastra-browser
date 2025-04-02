import { u, ur, C } from './chunk-Q7PGSIJU.js';
import { __name } from './chunk-WH5OY6PO.js';
import * as s from 'fs';
import * as o from 'path';

u();
var _a;
var m = (_a = class extends ur {
  constructor(t) {
    super(t), this.rootDir = o.resolve(t), s.existsSync(o.join(this.rootDir)) || s.mkdirSync(this.rootDir);
  }
  async init(t, e) {
    return this.pg = t, { emscriptenOpts: { ...e, preRun: [...e.preRun || [], (r) => {
      let c = r.FS.filesystems.NODEFS;
      r.FS.mkdir(C), r.FS.mount(c, { root: this.rootDir }, C);
    }] } };
  }
  async closeFs() {
    this.pg.Module.FS.quit();
  }
}, __name(_a, "m"), _a);

export { m as NodeFS };
//# sourceMappingURL=nodefs-BLMIS4EY.js.map
//# sourceMappingURL=nodefs-BLMIS4EY.js.map