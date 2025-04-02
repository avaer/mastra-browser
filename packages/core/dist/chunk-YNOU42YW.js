import { __name, __publicField } from './chunk-WH5OY6PO.js';

// src/tools/tool.ts
var _Tool = class _Tool {
  constructor(opts) {
    __publicField(this, "id");
    __publicField(this, "description");
    __publicField(this, "inputSchema");
    __publicField(this, "outputSchema");
    __publicField(this, "execute");
    __publicField(this, "mastra");
    this.id = opts.id;
    this.description = opts.description;
    this.inputSchema = opts.inputSchema;
    this.outputSchema = opts.outputSchema;
    this.execute = opts.execute;
    this.mastra = opts.mastra;
  }
};
__name(_Tool, "Tool");
var Tool = _Tool;
function createTool(opts) {
  return new Tool(opts);
}
__name(createTool, "createTool");

export { Tool, createTool };
//# sourceMappingURL=chunk-YNOU42YW.js.map
//# sourceMappingURL=chunk-YNOU42YW.js.map