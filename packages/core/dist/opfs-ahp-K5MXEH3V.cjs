'use strict';

var chunk2HHGZRYW_cjs = require('./chunk-2HHGZRYW.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');

// ../../node_modules/.pnpm/@electric-sql+pglite@0.2.17/node_modules/@electric-sql/pglite/dist/fs/opfs-ahp.js
chunk2HHGZRYW_cjs.u();
var $ = "state.txt";
var G = "data";
var T2 = { DIR: 16384, FILE: 32768 };
var H;
var v;
var F;
var M;
var y;
var b;
var m;
var x2;
var P;
var D;
var S;
var n;
var C;
var O;
var k;
var w;
var f;
var I;
var W;
var j;
var _a;
var L = (_a = class extends chunk2HHGZRYW_cjs.cr {
  constructor(e, { initialPoolSize: t = 1e3, maintainedPoolSize: o = 100, debug: i = false } = {}) {
    super(e, { debug: i });
    chunk2HHGZRYW_cjs.R(this, n);
    chunk2HHGZRYW_cjs.R(this, H);
    chunk2HHGZRYW_cjs.R(this, v);
    chunk2HHGZRYW_cjs.R(this, F);
    chunk2HHGZRYW_cjs.R(this, M);
    chunk2HHGZRYW_cjs.R(this, y);
    chunk2HHGZRYW_cjs.R(this, b, /* @__PURE__ */ new Map());
    chunk2HHGZRYW_cjs.R(this, m, /* @__PURE__ */ new Map());
    chunk2HHGZRYW_cjs.R(this, x2, 0);
    chunk2HHGZRYW_cjs.R(this, P, /* @__PURE__ */ new Map());
    chunk2HHGZRYW_cjs.R(this, D, /* @__PURE__ */ new Map());
    this.lastCheckpoint = 0;
    this.checkpointInterval = 1e3 * 60;
    this.poolCounter = 0;
    chunk2HHGZRYW_cjs.R(this, S, /* @__PURE__ */ new Set());
    this.initialPoolSize = t, this.maintainedPoolSize = o;
  }
  async init(e, t) {
    return await chunk2HHGZRYW_cjs.T(this, n, C).call(this), super.init(e, t);
  }
  async syncToFs(e = false) {
    await this.maybeCheckpointState(), await this.maintainPool(), e || this.flush();
  }
  async closeFs() {
    for (let e of chunk2HHGZRYW_cjs.h(this, m).values()) e.close();
    chunk2HHGZRYW_cjs.h(this, y).flush(), chunk2HHGZRYW_cjs.h(this, y).close(), this.pg.Module.FS.quit();
  }
  async maintainPool(e) {
    e = e || this.maintainedPoolSize;
    let t = e - this.state.pool.length, o = [];
    for (let i = 0; i < t; i++) o.push(new Promise(async (c) => {
      ++this.poolCounter;
      let a = `${(Date.now() - 1704063600).toString(16).padStart(8, "0")}-${this.poolCounter.toString(16).padStart(8, "0")}`, h2 = await chunk2HHGZRYW_cjs.h(this, F).getFileHandle(a, { create: true }), d = await h2.createSyncAccessHandle();
      chunk2HHGZRYW_cjs.h(this, b).set(a, h2), chunk2HHGZRYW_cjs.h(this, m).set(a, d), chunk2HHGZRYW_cjs.T(this, n, k).call(this, { opp: "createPoolFile", args: [a] }), this.state.pool.push(a), c();
    }));
    for (let i = 0; i > t; i--) o.push(new Promise(async (c) => {
      let a = this.state.pool.pop();
      chunk2HHGZRYW_cjs.T(this, n, k).call(this, { opp: "deletePoolFile", args: [a] });
      let h2 = chunk2HHGZRYW_cjs.h(this, b).get(a);
      chunk2HHGZRYW_cjs.h(this, m).get(a)?.close(), await chunk2HHGZRYW_cjs.h(this, F).removeEntry(h2.name), chunk2HHGZRYW_cjs.h(this, b).delete(a), chunk2HHGZRYW_cjs.h(this, m).delete(a), c();
    }));
    await Promise.all(o);
  }
  _createPoolFileState(e) {
    this.state.pool.push(e);
  }
  _deletePoolFileState(e) {
    let t = this.state.pool.indexOf(e);
    t > -1 && this.state.pool.splice(t, 1);
  }
  async maybeCheckpointState() {
    Date.now() - this.lastCheckpoint > this.checkpointInterval && await this.checkpointState();
  }
  async checkpointState() {
    let e = new TextEncoder().encode(JSON.stringify(this.state));
    chunk2HHGZRYW_cjs.h(this, y).truncate(0), chunk2HHGZRYW_cjs.h(this, y).write(e, { at: 0 }), chunk2HHGZRYW_cjs.h(this, y).flush(), this.lastCheckpoint = Date.now();
  }
  flush() {
    for (let e of chunk2HHGZRYW_cjs.h(this, S)) try {
      e.flush();
    } catch {
    }
    chunk2HHGZRYW_cjs.h(this, S).clear();
  }
  chmod(e, t) {
    chunk2HHGZRYW_cjs.T(this, n, O).call(this, { opp: "chmod", args: [e, t] }, () => {
      this._chmodState(e, t);
    });
  }
  _chmodState(e, t) {
    let o = chunk2HHGZRYW_cjs.T(this, n, f).call(this, e);
    o.mode = t;
  }
  close(e) {
    let t = chunk2HHGZRYW_cjs.T(this, n, I).call(this, e);
    chunk2HHGZRYW_cjs.h(this, P).delete(e), chunk2HHGZRYW_cjs.h(this, D).delete(t);
  }
  fstat(e) {
    let t = chunk2HHGZRYW_cjs.T(this, n, I).call(this, e);
    return this.lstat(t);
  }
  lstat(e) {
    let t = chunk2HHGZRYW_cjs.T(this, n, f).call(this, e), o = t.type === "file" ? chunk2HHGZRYW_cjs.h(this, m).get(t.backingFilename).getSize() : 0, i = 4096;
    return { dev: 0, ino: 0, mode: t.mode, nlink: 1, uid: 0, gid: 0, rdev: 0, size: o, blksize: i, blocks: Math.ceil(o / i), atime: t.lastModified, mtime: t.lastModified, ctime: t.lastModified };
  }
  mkdir(e, t) {
    chunk2HHGZRYW_cjs.T(this, n, O).call(this, { opp: "mkdir", args: [e, t] }, () => {
      this._mkdirState(e, t);
    });
  }
  _mkdirState(e, t) {
    let o = chunk2HHGZRYW_cjs.T(this, n, w).call(this, e), i = o.pop(), c = [], a = this.state.root;
    for (let d of o) {
      if (c.push(e), !Object.prototype.hasOwnProperty.call(a.children, d)) if (t?.recursive) this.mkdir(c.join("/"));
      else throw new p("ENOENT", "No such file or directory");
      if (a.children[d].type !== "directory") throw new p("ENOTDIR", "Not a directory");
      a = a.children[d];
    }
    if (Object.prototype.hasOwnProperty.call(a.children, i)) throw new p("EEXIST", "File exists");
    let h2 = { type: "directory", lastModified: Date.now(), mode: t?.mode || T2.DIR, children: {} };
    a.children[i] = h2;
  }
  open(e, t, o) {
    if (chunk2HHGZRYW_cjs.T(this, n, f).call(this, e).type !== "file") throw new p("EISDIR", "Is a directory");
    let c = chunk2HHGZRYW_cjs.T(this, n, W).call(this);
    return chunk2HHGZRYW_cjs.h(this, P).set(c, e), chunk2HHGZRYW_cjs.h(this, D).set(e, c), c;
  }
  readdir(e) {
    let t = chunk2HHGZRYW_cjs.T(this, n, f).call(this, e);
    if (t.type !== "directory") throw new p("ENOTDIR", "Not a directory");
    return Object.keys(t.children);
  }
  read(e, t, o, i, c) {
    let a = chunk2HHGZRYW_cjs.T(this, n, I).call(this, e), h2 = chunk2HHGZRYW_cjs.T(this, n, f).call(this, a);
    if (h2.type !== "file") throw new p("EISDIR", "Is a directory");
    return chunk2HHGZRYW_cjs.h(this, m).get(h2.backingFilename).read(new Uint8Array(t.buffer, o, i), { at: c });
  }
  rename(e, t) {
    chunk2HHGZRYW_cjs.T(this, n, O).call(this, { opp: "rename", args: [e, t] }, () => {
      this._renameState(e, t, true);
    });
  }
  _renameState(e, t, o = false) {
    let i = chunk2HHGZRYW_cjs.T(this, n, w).call(this, e), c = i.pop(), a = chunk2HHGZRYW_cjs.T(this, n, f).call(this, i.join("/"));
    if (!Object.prototype.hasOwnProperty.call(a.children, c)) throw new p("ENOENT", "No such file or directory");
    let h2 = chunk2HHGZRYW_cjs.T(this, n, w).call(this, t), d = h2.pop(), l = chunk2HHGZRYW_cjs.T(this, n, f).call(this, h2.join("/"));
    if (o && Object.prototype.hasOwnProperty.call(l.children, d)) {
      let u2 = l.children[d];
      chunk2HHGZRYW_cjs.h(this, m).get(u2.backingFilename).truncate(0), this.state.pool.push(u2.backingFilename);
    }
    l.children[d] = a.children[c], delete a.children[c];
  }
  rmdir(e) {
    chunk2HHGZRYW_cjs.T(this, n, O).call(this, { opp: "rmdir", args: [e] }, () => {
      this._rmdirState(e);
    });
  }
  _rmdirState(e) {
    let t = chunk2HHGZRYW_cjs.T(this, n, w).call(this, e), o = t.pop(), i = chunk2HHGZRYW_cjs.T(this, n, f).call(this, t.join("/"));
    if (!Object.prototype.hasOwnProperty.call(i.children, o)) throw new p("ENOENT", "No such file or directory");
    let c = i.children[o];
    if (c.type !== "directory") throw new p("ENOTDIR", "Not a directory");
    if (Object.keys(c.children).length > 0) throw new p("ENOTEMPTY", "Directory not empty");
    delete i.children[o];
  }
  truncate(e, t = 0) {
    let o = chunk2HHGZRYW_cjs.T(this, n, f).call(this, e);
    if (o.type !== "file") throw new p("EISDIR", "Is a directory");
    let i = chunk2HHGZRYW_cjs.h(this, m).get(o.backingFilename);
    if (!i) throw new p("ENOENT", "No such file or directory");
    i.truncate(t), chunk2HHGZRYW_cjs.h(this, S).add(i);
  }
  unlink(e) {
    chunk2HHGZRYW_cjs.T(this, n, O).call(this, { opp: "unlink", args: [e] }, () => {
      this._unlinkState(e, true);
    });
  }
  _unlinkState(e, t = false) {
    let o = chunk2HHGZRYW_cjs.T(this, n, w).call(this, e), i = o.pop(), c = chunk2HHGZRYW_cjs.T(this, n, f).call(this, o.join("/"));
    if (!Object.prototype.hasOwnProperty.call(c.children, i)) throw new p("ENOENT", "No such file or directory");
    let a = c.children[i];
    if (a.type !== "file") throw new p("EISDIR", "Is a directory");
    if (delete c.children[i], t) {
      let h2 = chunk2HHGZRYW_cjs.h(this, m).get(a.backingFilename);
      h2?.truncate(0), chunk2HHGZRYW_cjs.h(this, S).add(h2), chunk2HHGZRYW_cjs.h(this, D).has(e) && (chunk2HHGZRYW_cjs.h(this, P).delete(chunk2HHGZRYW_cjs.h(this, D).get(e)), chunk2HHGZRYW_cjs.h(this, D).delete(e));
    }
    this.state.pool.push(a.backingFilename);
  }
  utimes(e, t, o) {
    chunk2HHGZRYW_cjs.T(this, n, O).call(this, { opp: "utimes", args: [e, t, o] }, () => {
      this._utimesState(e, t, o);
    });
  }
  _utimesState(e, t, o) {
    let i = chunk2HHGZRYW_cjs.T(this, n, f).call(this, e);
    i.lastModified = o;
  }
  writeFile(e, t, o) {
    let i = chunk2HHGZRYW_cjs.T(this, n, w).call(this, e), c = i.pop(), a = chunk2HHGZRYW_cjs.T(this, n, f).call(this, i.join("/"));
    if (Object.prototype.hasOwnProperty.call(a.children, c)) {
      let l = a.children[c];
      l.lastModified = Date.now(), chunk2HHGZRYW_cjs.T(this, n, k).call(this, { opp: "setLastModified", args: [e, l.lastModified] });
    } else {
      if (this.state.pool.length === 0) throw new Error("No more file handles available in the pool");
      let l = { type: "file", lastModified: Date.now(), mode: o?.mode || T2.FILE, backingFilename: this.state.pool.pop() };
      a.children[c] = l, chunk2HHGZRYW_cjs.T(this, n, k).call(this, { opp: "createFileNode", args: [e, l] });
    }
    let h2 = a.children[c], d = chunk2HHGZRYW_cjs.h(this, m).get(h2.backingFilename);
    t.length > 0 && (d.write(typeof t == "string" ? new TextEncoder().encode(t) : new Uint8Array(t), { at: 0 }), e.startsWith("/pg_wal") && chunk2HHGZRYW_cjs.h(this, S).add(d));
  }
  _createFileNodeState(e, t) {
    let o = chunk2HHGZRYW_cjs.T(this, n, w).call(this, e), i = o.pop(), c = chunk2HHGZRYW_cjs.T(this, n, f).call(this, o.join("/"));
    c.children[i] = t;
    let a = this.state.pool.indexOf(t.backingFilename);
    return a > -1 && this.state.pool.splice(a, 1), t;
  }
  _setLastModifiedState(e, t) {
    let o = chunk2HHGZRYW_cjs.T(this, n, f).call(this, e);
    o.lastModified = t;
  }
  write(e, t, o, i, c) {
    let a = chunk2HHGZRYW_cjs.T(this, n, I).call(this, e), h2 = chunk2HHGZRYW_cjs.T(this, n, f).call(this, a);
    if (h2.type !== "file") throw new p("EISDIR", "Is a directory");
    let d = chunk2HHGZRYW_cjs.h(this, m).get(h2.backingFilename);
    if (!d) throw new p("EBADF", "Bad file descriptor");
    let l = d.write(new Uint8Array(t, o, i), { at: c });
    return a.startsWith("/pg_wal") && chunk2HHGZRYW_cjs.h(this, S).add(d), l;
  }
}, chunk7D636BPD_cjs.__name(_a, "L"), _a);
H = /* @__PURE__ */ new WeakMap(), v = /* @__PURE__ */ new WeakMap(), F = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakMap(), y = /* @__PURE__ */ new WeakMap(), b = /* @__PURE__ */ new WeakMap(), m = /* @__PURE__ */ new WeakMap(), x2 = /* @__PURE__ */ new WeakMap(), P = /* @__PURE__ */ new WeakMap(), D = /* @__PURE__ */ new WeakMap(), S = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakSet(), C = /* @__PURE__ */ chunk7D636BPD_cjs.__name(async function() {
  chunk2HHGZRYW_cjs.x(this, H, await navigator.storage.getDirectory()), chunk2HHGZRYW_cjs.x(this, v, await chunk2HHGZRYW_cjs.T(this, n, j).call(this, this.dataDir, { create: true })), chunk2HHGZRYW_cjs.x(this, F, await chunk2HHGZRYW_cjs.T(this, n, j).call(this, G, { from: chunk2HHGZRYW_cjs.h(this, v), create: true })), chunk2HHGZRYW_cjs.x(this, M, await chunk2HHGZRYW_cjs.h(this, v).getFileHandle($, { create: true })), chunk2HHGZRYW_cjs.x(this, y, await chunk2HHGZRYW_cjs.h(this, M).createSyncAccessHandle());
  let e = new ArrayBuffer(chunk2HHGZRYW_cjs.h(this, y).getSize());
  chunk2HHGZRYW_cjs.h(this, y).read(e, { at: 0 });
  let t, o = new TextDecoder().decode(e).split(`
`), i = false;
  try {
    t = JSON.parse(o[0]);
  } catch {
    t = { root: { type: "directory", lastModified: Date.now(), mode: T2.DIR, children: {} }, pool: [] }, chunk2HHGZRYW_cjs.h(this, y).truncate(0), chunk2HHGZRYW_cjs.h(this, y).write(new TextEncoder().encode(JSON.stringify(t)), { at: 0 }), i = true;
  }
  this.state = t;
  let c = o.slice(1).filter(Boolean).map((l) => JSON.parse(l));
  for (let l of c) {
    let u2 = `_${l.opp}State`;
    if (typeof this[u2] == "function") try {
      this[u2].bind(this)(...l.args);
    } catch (N) {
      console.warn("Error applying OPFS AHP WAL entry", l, N);
    }
  }
  let a = [], h2 = /* @__PURE__ */ chunk7D636BPD_cjs.__name(async (l) => {
    if (l.type === "file") try {
      let u2 = await chunk2HHGZRYW_cjs.h(this, F).getFileHandle(l.backingFilename), N = await u2.createSyncAccessHandle();
      chunk2HHGZRYW_cjs.h(this, b).set(l.backingFilename, u2), chunk2HHGZRYW_cjs.h(this, m).set(l.backingFilename, N);
    } catch (u2) {
      console.error("Error opening file handle for node", l, u2);
    }
    else for (let u2 of Object.values(l.children)) a.push(h2(u2));
  }, "h");
  await h2(this.state.root);
  let d = [];
  for (let l of this.state.pool) d.push(new Promise(async (u2) => {
    chunk2HHGZRYW_cjs.h(this, b).has(l) && console.warn("File handle already exists for pool file", l);
    let N = await chunk2HHGZRYW_cjs.h(this, F).getFileHandle(l), U2 = await N.createSyncAccessHandle();
    chunk2HHGZRYW_cjs.h(this, b).set(l, N), chunk2HHGZRYW_cjs.h(this, m).set(l, U2), u2();
  }));
  await Promise.all([...a, ...d]), await this.maintainPool(i ? this.initialPoolSize : this.maintainedPoolSize);
}, "C"), O = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(e, t) {
  let o = chunk2HHGZRYW_cjs.T(this, n, k).call(this, e);
  try {
    t();
  } catch (i) {
    throw chunk2HHGZRYW_cjs.h(this, y).truncate(o), i;
  }
}, "O"), k = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(e) {
  let t = JSON.stringify(e), o = new TextEncoder().encode(`
${t}`), i = chunk2HHGZRYW_cjs.h(this, y).getSize();
  return chunk2HHGZRYW_cjs.h(this, y).write(o, { at: i }), chunk2HHGZRYW_cjs.h(this, S).add(chunk2HHGZRYW_cjs.h(this, y)), i;
}, "k"), w = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(e) {
  return e.split("/").filter(Boolean);
}, "w"), f = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(e, t) {
  let o = chunk2HHGZRYW_cjs.T(this, n, w).call(this, e), i = t || this.state.root;
  for (let c of o) {
    if (i.type !== "directory") throw new p("ENOTDIR", "Not a directory");
    if (!Object.prototype.hasOwnProperty.call(i.children, c)) throw new p("ENOENT", "No such file or directory");
    i = i.children[c];
  }
  return i;
}, "f"), I = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function(e) {
  let t = chunk2HHGZRYW_cjs.h(this, P).get(e);
  if (!t) throw new p("EBADF", "Bad file descriptor");
  return t;
}, "I"), W = /* @__PURE__ */ chunk7D636BPD_cjs.__name(function() {
  let e = ++chunk2HHGZRYW_cjs.U(this, x2)._;
  for (; chunk2HHGZRYW_cjs.h(this, P).has(e); ) chunk2HHGZRYW_cjs.U(this, x2)._++;
  return e;
}, "W"), j = /* @__PURE__ */ chunk7D636BPD_cjs.__name(async function(e, t) {
  let o = chunk2HHGZRYW_cjs.T(this, n, w).call(this, e), i = t?.from || chunk2HHGZRYW_cjs.h(this, H);
  for (let c of o) i = await i.getDirectoryHandle(c, { create: t?.create });
  return i;
}, "j");
var _a2;
var p = (_a2 = class extends Error {
  constructor(A, e) {
    super(e), typeof A == "number" ? this.code = A : typeof A == "string" && (this.code = chunk2HHGZRYW_cjs.pr[A]);
  }
}, chunk7D636BPD_cjs.__name(_a2, "p"), _a2);

exports.OpfsAhpFS = L;
//# sourceMappingURL=opfs-ahp-K5MXEH3V.cjs.map
//# sourceMappingURL=opfs-ahp-K5MXEH3V.cjs.map