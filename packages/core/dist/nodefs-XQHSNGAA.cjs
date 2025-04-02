'use strict';

var chunk2HHGZRYW_cjs = require('./chunk-2HHGZRYW.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');
var s = require('fs');
var o = require('path');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var s__namespace = /*#__PURE__*/_interopNamespace(s);
var o__namespace = /*#__PURE__*/_interopNamespace(o);

chunk2HHGZRYW_cjs.u();
var _a;
var m = (_a = class extends chunk2HHGZRYW_cjs.ur {
  constructor(t) {
    super(t), this.rootDir = o__namespace.resolve(t), s__namespace.existsSync(o__namespace.join(this.rootDir)) || s__namespace.mkdirSync(this.rootDir);
  }
  async init(t, e) {
    return this.pg = t, { emscriptenOpts: { ...e, preRun: [...e.preRun || [], (r) => {
      let c = r.FS.filesystems.NODEFS;
      r.FS.mkdir(chunk2HHGZRYW_cjs.C), r.FS.mount(c, { root: this.rootDir }, chunk2HHGZRYW_cjs.C);
    }] } };
  }
  async closeFs() {
    this.pg.Module.FS.quit();
  }
}, chunk7D636BPD_cjs.__name(_a, "m"), _a);

exports.NodeFS = m;
//# sourceMappingURL=nodefs-XQHSNGAA.cjs.map
//# sourceMappingURL=nodefs-XQHSNGAA.cjs.map