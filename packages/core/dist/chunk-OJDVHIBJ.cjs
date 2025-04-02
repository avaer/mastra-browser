'use strict';

var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');

// src/tools/tool.ts
var _Tool = class _Tool {
  constructor(opts) {
    chunk7D636BPD_cjs.__publicField(this, "id");
    chunk7D636BPD_cjs.__publicField(this, "description");
    chunk7D636BPD_cjs.__publicField(this, "inputSchema");
    chunk7D636BPD_cjs.__publicField(this, "outputSchema");
    chunk7D636BPD_cjs.__publicField(this, "execute");
    chunk7D636BPD_cjs.__publicField(this, "mastra");
    this.id = opts.id;
    this.description = opts.description;
    this.inputSchema = opts.inputSchema;
    this.outputSchema = opts.outputSchema;
    this.execute = opts.execute;
    this.mastra = opts.mastra;
  }
};
chunk7D636BPD_cjs.__name(_Tool, "Tool");
var Tool = _Tool;
function createTool(opts) {
  return new Tool(opts);
}
chunk7D636BPD_cjs.__name(createTool, "createTool");

exports.Tool = Tool;
exports.createTool = createTool;
//# sourceMappingURL=chunk-OJDVHIBJ.cjs.map
//# sourceMappingURL=chunk-OJDVHIBJ.cjs.map