'use strict';

var llamaindex = require('llamaindex');
var nodeHtmlBetterParser = require('node-html-better-parser');
var jsTiktoken = require('js-tiktoken');
var relevance = require('@mastra/core/relevance');
var tools = require('@mastra/core/tools');
var zod = require('zod');
var ai = require('ai');

// src/document/document.ts

// src/document/types.ts
var Language = /* @__PURE__ */ ((Language2) => {
  Language2["CPP"] = "cpp";
  Language2["GO"] = "go";
  Language2["JAVA"] = "java";
  Language2["KOTLIN"] = "kotlin";
  Language2["JS"] = "js";
  Language2["TS"] = "ts";
  Language2["PHP"] = "php";
  Language2["PROTO"] = "proto";
  Language2["PYTHON"] = "python";
  Language2["RST"] = "rst";
  Language2["RUBY"] = "ruby";
  Language2["RUST"] = "rust";
  Language2["SCALA"] = "scala";
  Language2["SWIFT"] = "swift";
  Language2["MARKDOWN"] = "markdown";
  Language2["LATEX"] = "latex";
  Language2["HTML"] = "html";
  Language2["SOL"] = "sol";
  Language2["CSHARP"] = "csharp";
  Language2["COBOL"] = "cobol";
  Language2["C"] = "c";
  Language2["LUA"] = "lua";
  Language2["PERL"] = "perl";
  Language2["HASKELL"] = "haskell";
  Language2["ELIXIR"] = "elixir";
  Language2["POWERSHELL"] = "powershell";
  return Language2;
})(Language || {});
var TextTransformer = class {
  size;
  overlap;
  lengthFunction;
  keepSeparator;
  addStartIndex;
  stripWhitespace;
  constructor({
    size = 4e3,
    overlap = 200,
    lengthFunction = (text) => text.length,
    keepSeparator = false,
    addStartIndex = false,
    stripWhitespace = true
  }) {
    if (overlap > size) {
      throw new Error(`Got a larger chunk overlap (${overlap}) than chunk size (${size}), should be smaller.`);
    }
    this.size = size;
    this.overlap = overlap;
    this.lengthFunction = lengthFunction;
    this.keepSeparator = keepSeparator;
    this.addStartIndex = addStartIndex;
    this.stripWhitespace = stripWhitespace;
  }
  setAddStartIndex(value) {
    this.addStartIndex = value;
  }
  createDocuments(texts, metadatas) {
    const _metadatas = metadatas || Array(texts.length).fill({});
    const documents = [];
    texts.forEach((text, i) => {
      let index = 0;
      let previousChunkLen = 0;
      this.splitText({ text }).forEach((chunk) => {
        const metadata = { ..._metadatas[i] };
        if (this.addStartIndex) {
          const offset = index + previousChunkLen - this.overlap;
          index = text.indexOf(chunk, Math.max(0, offset));
          metadata.startIndex = index;
          previousChunkLen = chunk.length;
        }
        documents.push(
          new llamaindex.Document({
            text: chunk,
            metadata
          })
        );
      });
    });
    return documents;
  }
  splitDocuments(documents) {
    const texts = [];
    const metadatas = [];
    for (const doc of documents) {
      texts.push(doc.text);
      metadatas.push(doc.metadata);
    }
    return this.createDocuments(texts, metadatas);
  }
  transformDocuments(documents) {
    const texts = [];
    const metadatas = [];
    for (const doc of documents) {
      texts.push(doc.text);
      metadatas.push(doc.metadata);
    }
    return this.createDocuments(texts, metadatas);
  }
  joinDocs(docs, separator) {
    let text = docs.join(separator);
    if (this.stripWhitespace) {
      text = text.trim();
    }
    return text === "" ? null : text;
  }
  mergeSplits(splits, separator) {
    const docs = [];
    let currentDoc = [];
    let total = 0;
    for (const d of splits) {
      const len = this.lengthFunction(d);
      const separatorLen = separator ? this.lengthFunction(separator) : 0;
      if (total + len + (currentDoc.length > 0 ? separatorLen : 0) > this.size) {
        if (total > this.size) {
          console.warn(`Created a chunk of size ${total}, which is longer than the specified ${this.size}`);
        }
        if (currentDoc.length > 0) {
          const doc = this.joinDocs(currentDoc, separator);
          if (doc !== null) {
            docs.push(doc);
          }
          if (this.overlap > 0) {
            let overlapContent = [];
            let overlapSize = 0;
            for (let i = currentDoc.length - 1; i >= 0; i--) {
              const piece = currentDoc[i];
              const pieceLen = this.lengthFunction(piece);
              if (overlapSize + pieceLen > this.overlap) {
                break;
              }
              overlapContent.unshift(piece);
              overlapSize += pieceLen + (overlapContent.length > 1 ? separatorLen : 0);
            }
            currentDoc = overlapContent;
            total = overlapSize;
          } else {
            currentDoc = [];
            total = 0;
          }
        }
      }
      currentDoc.push(d);
      total += len + (currentDoc.length > 1 ? separatorLen : 0);
    }
    if (currentDoc.length > 0) {
      const doc = this.joinDocs(currentDoc, separator);
      if (doc !== null) {
        docs.push(doc);
      }
    }
    return docs;
  }
};

// src/document/transformers/character.ts
function splitTextWithRegex(text, separator, keepSeparator) {
  if (!separator) {
    return text.split("");
  }
  if (!keepSeparator) {
    return text.split(new RegExp(separator)).filter((s) => s !== "");
  }
  if (!text) {
    return [];
  }
  const splits = text.split(new RegExp(`(${separator})`));
  const result = [];
  if (keepSeparator === "end") {
    for (let i = 0; i < splits.length - 1; i += 2) {
      if (i + 1 < splits.length) {
        const chunk = splits[i] + (splits[i + 1] || "");
        if (chunk) result.push(chunk);
      }
    }
    if (splits.length % 2 === 1 && splits[splits.length - 1]) {
      result.push(splits?.[splits.length - 1]);
    }
  } else {
    if (splits[0]) result.push(splits[0]);
    for (let i = 1; i < splits.length - 1; i += 2) {
      const separator2 = splits[i];
      const text2 = splits[i + 1];
      if (separator2 && text2) {
        result.push(separator2 + text2);
      }
    }
  }
  return result.filter((s) => s !== "");
}
var CharacterTransformer = class extends TextTransformer {
  separator;
  isSeparatorRegex;
  constructor({
    separator = "\n\n",
    isSeparatorRegex = false,
    options = {}
  }) {
    super(options);
    this.separator = separator;
    this.isSeparatorRegex = isSeparatorRegex;
  }
  splitText({ text }) {
    const separator = this.isSeparatorRegex ? this.separator : this.separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const initialSplits = splitTextWithRegex(text, separator, this.keepSeparator);
    const chunks = [];
    for (const split of initialSplits) {
      if (this.lengthFunction(split) <= this.size) {
        chunks.push(split);
      } else {
        const subChunks = this.__splitChunk(split);
        chunks.push(...subChunks);
      }
    }
    return chunks;
  }
  __splitChunk(text) {
    const chunks = [];
    let currentPosition = 0;
    while (currentPosition < text.length) {
      let chunkEnd = currentPosition;
      while (chunkEnd < text.length && this.lengthFunction(text.slice(currentPosition, chunkEnd + 1)) <= this.size) {
        chunkEnd++;
      }
      const currentChunk = text.slice(currentPosition, chunkEnd);
      const chunkLength = this.lengthFunction(currentChunk);
      chunks.push(currentChunk);
      if (chunkEnd >= text.length) break;
      currentPosition += Math.max(1, chunkLength - this.overlap);
    }
    return chunks;
  }
};
var RecursiveCharacterTransformer = class _RecursiveCharacterTransformer extends TextTransformer {
  separators;
  isSeparatorRegex;
  constructor({
    separators,
    isSeparatorRegex = false,
    options = {}
  }) {
    super(options);
    this.separators = separators || ["\n\n", "\n", " ", ""];
    this.isSeparatorRegex = isSeparatorRegex;
  }
  _splitText(text, separators) {
    const finalChunks = [];
    let separator = separators?.[separators.length - 1];
    let newSeparators = [];
    for (let i = 0; i < separators.length; i++) {
      const s = separators[i];
      const _separator2 = this.isSeparatorRegex ? s : s?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (s === "") {
        separator = s;
        break;
      }
      if (new RegExp(_separator2).test(text)) {
        separator = s;
        newSeparators = separators.slice(i + 1);
        break;
      }
    }
    const _separator = this.isSeparatorRegex ? separator : separator?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const splits = splitTextWithRegex(text, _separator, this.keepSeparator);
    const goodSplits = [];
    const mergeSeparator = this.keepSeparator ? "" : separator;
    for (const s of splits) {
      if (this.lengthFunction(s) < this.size) {
        goodSplits.push(s);
      } else {
        if (goodSplits.length > 0) {
          const mergedText = this.mergeSplits(goodSplits, mergeSeparator);
          finalChunks.push(...mergedText);
          goodSplits.length = 0;
        }
        if (newSeparators.length === 0) {
          finalChunks.push(s);
        } else {
          const otherInfo = this._splitText(s, newSeparators);
          finalChunks.push(...otherInfo);
        }
      }
    }
    if (goodSplits.length > 0) {
      const mergedText = this.mergeSplits(goodSplits, mergeSeparator);
      finalChunks.push(...mergedText);
    }
    return finalChunks;
  }
  splitText({ text }) {
    return this._splitText(text, this.separators);
  }
  static fromLanguage(language, options = {}) {
    const separators = _RecursiveCharacterTransformer.getSeparatorsForLanguage(language);
    return new _RecursiveCharacterTransformer({ separators, isSeparatorRegex: true, options });
  }
  static getSeparatorsForLanguage(language) {
    switch (language) {
      case "markdown" /* MARKDOWN */:
        return [
          // First, try to split along Markdown headings (starting with level 2)
          "\n#{1,6} ",
          // End of code block
          "```\n",
          // Horizontal lines
          "\n\\*\\*\\*+\n",
          "\n---+\n",
          "\n___+\n",
          // Note that this splitter doesn't handle horizontal lines defined
          // by *three or more* of ***, ---, or ___, but this is not handled
          "\n\n",
          "\n",
          " ",
          ""
        ];
      case "cpp" /* CPP */:
      case "c" /* C */:
        return [
          "\nclass ",
          "\nvoid ",
          "\nint ",
          "\nfloat ",
          "\ndouble ",
          "\nif ",
          "\nfor ",
          "\nwhile ",
          "\nswitch ",
          "\ncase ",
          "\n\n",
          "\n",
          " ",
          ""
        ];
      case "ts" /* TS */:
        return [
          "\nenum ",
          "\ninterface ",
          "\nnamespace ",
          "\ntype ",
          "\nclass ",
          "\nfunction ",
          "\nconst ",
          "\nlet ",
          "\nvar ",
          "\nif ",
          "\nfor ",
          "\nwhile ",
          "\nswitch ",
          "\ncase ",
          "\ndefault ",
          "\n\n",
          "\n",
          " ",
          ""
        ];
      // ... (add other language cases following the same pattern)
      default:
        throw new Error(`Language ${language} is not supported! Please choose from ${Object.values(Language)}`);
    }
  }
};
var HTMLHeaderTransformer = class {
  headersToSplitOn;
  returnEachElement;
  constructor(headersToSplitOn, returnEachElement = false) {
    this.returnEachElement = returnEachElement;
    this.headersToSplitOn = [...headersToSplitOn].sort();
  }
  splitText({ text }) {
    const root = nodeHtmlBetterParser.parse(text);
    const headerFilter = this.headersToSplitOn.map(([header]) => header);
    const headerMapping = Object.fromEntries(this.headersToSplitOn);
    const elements = [];
    const headers = root.querySelectorAll(headerFilter.join(","));
    headers.forEach((header) => {
      let content = "";
      const parentNode = header.parentNode;
      if (parentNode && parentNode.childNodes) {
        let foundHeader = false;
        for (const node of parentNode.childNodes) {
          if (node === header) {
            foundHeader = true;
            continue;
          }
          if (foundHeader && node.tagName && headerFilter.includes(node.tagName.toLowerCase())) {
            break;
          }
          if (foundHeader) {
            content += this.getTextContent(node) + " ";
          }
        }
      }
      elements.push({
        url: text,
        xpath: this.getXPath(header),
        content: content.trim(),
        metadata: {
          [headerMapping?.[header.tagName.toLowerCase()]]: header.text || ""
        }
      });
    });
    return this.returnEachElement ? elements.map(
      (el) => new llamaindex.Document({
        text: el.content,
        metadata: { ...el.metadata, xpath: el.xpath }
      })
    ) : this.aggregateElementsToChunks(elements);
  }
  getXPath(element) {
    if (!element) return "";
    const parts = [];
    let current = element;
    while (current && current.tagName) {
      let index = 1;
      const parent = current.parentNode;
      if (parent && parent.childNodes) {
        for (const sibling of parent.childNodes) {
          if (sibling === current) break;
          if (sibling.tagName === current.tagName) {
            index++;
          }
        }
      }
      parts.unshift(`${current.tagName.toLowerCase()}[${index}]`);
      current = current.parentNode;
    }
    return "/" + parts.join("/");
  }
  getTextContent(element) {
    if (!element) return "";
    if (!element.tagName) {
      return element.text || "";
    }
    let content = element.text || "";
    if (element.childNodes) {
      for (const child of element.childNodes) {
        const childText = this.getTextContent(child);
        if (childText) {
          content += " " + childText;
        }
      }
    }
    return content.trim();
  }
  aggregateElementsToChunks(elements) {
    const aggregatedChunks = [];
    for (const element of elements) {
      if (aggregatedChunks.length > 0 && JSON.stringify(aggregatedChunks[aggregatedChunks.length - 1].metadata) === JSON.stringify(element.metadata)) {
        aggregatedChunks[aggregatedChunks.length - 1].content += "  \n" + element.content;
      } else {
        aggregatedChunks.push({ ...element });
      }
    }
    return aggregatedChunks.map(
      (chunk) => new llamaindex.Document({
        text: chunk.content,
        metadata: { ...chunk.metadata, xpath: chunk.xpath }
      })
    );
  }
  createDocuments(texts, metadatas) {
    const _metadatas = metadatas || Array(texts.length).fill({});
    const documents = [];
    for (let i = 0; i < texts.length; i++) {
      const chunks = this.splitText({ text: texts[i] });
      for (const chunk of chunks) {
        const metadata = { ..._metadatas[i] || {} };
        const chunkMetadata = chunk.metadata;
        if (chunkMetadata) {
          for (const [key, value] of Object.entries(chunkMetadata || {})) {
            if (value === "#TITLE#") {
              chunkMetadata[key] = metadata["Title"];
            }
          }
        }
        documents.push(
          new llamaindex.Document({
            text: chunk.text,
            metadata: { ...metadata, ...chunkMetadata }
          })
        );
      }
    }
    return documents;
  }
  transformDocuments(documents) {
    const texts = [];
    const metadatas = [];
    for (const doc of documents) {
      texts.push(doc.text);
      metadatas.push(doc.metadata);
    }
    return this.createDocuments(texts, metadatas);
  }
};
var HTMLSectionTransformer = class {
  headersToSplitOn;
  options;
  constructor(headersToSplitOn, options = {}) {
    this.headersToSplitOn = Object.fromEntries(headersToSplitOn.map(([tag, name]) => [tag.toLowerCase(), name]));
    this.options = options;
  }
  splitText(text) {
    const sections = this.splitHtmlByHeaders(text);
    return sections.map(
      (section) => new llamaindex.Document({
        text: section.content,
        metadata: {
          [this.headersToSplitOn[section.tagName.toLowerCase()]]: section.header,
          xpath: section.xpath
        }
      })
    );
  }
  getXPath(element) {
    const parts = [];
    let current = element;
    while (current && current.nodeType === 1) {
      let index = 1;
      let sibling = current.previousSibling;
      while (sibling) {
        if (sibling.nodeType === 1 && sibling.tagName === current.tagName) {
          index++;
        }
        sibling = sibling.previousSibling;
      }
      if (current.tagName) {
        parts.unshift(`${current.tagName.toLowerCase()}[${index}]`);
      }
      current = current.parentNode;
    }
    return "/" + parts.join("/");
  }
  splitHtmlByHeaders(htmlDoc) {
    const sections = [];
    const root = nodeHtmlBetterParser.parse(htmlDoc);
    const headers = Object.keys(this.headersToSplitOn);
    const headerElements = root.querySelectorAll(headers.join(","));
    headerElements.forEach((headerElement, index) => {
      const header = headerElement.text?.trim() || "";
      const tagName = headerElement.tagName;
      const xpath = this.getXPath(headerElement);
      let content = "";
      let currentElement = headerElement.nextElementSibling;
      const nextHeader = headerElements[index + 1];
      while (currentElement && (!nextHeader || currentElement !== nextHeader)) {
        if (currentElement.text) {
          content += currentElement.text.trim() + " ";
        }
        currentElement = currentElement.nextElementSibling;
      }
      content = content.trim();
      sections.push({
        header,
        content,
        tagName,
        xpath
      });
    });
    return sections;
  }
  async splitDocuments(documents) {
    const texts = [];
    const metadatas = [];
    for (const doc of documents) {
      texts.push(doc.text);
      metadatas.push(doc.metadata);
    }
    const results = await this.createDocuments(texts, metadatas);
    const textSplitter = new RecursiveCharacterTransformer({ options: this.options });
    return textSplitter.splitDocuments(results);
  }
  createDocuments(texts, metadatas) {
    const _metadatas = metadatas || Array(texts.length).fill({});
    const documents = [];
    for (let i = 0; i < texts.length; i++) {
      const chunks = this.splitText(texts[i]);
      for (const chunk of chunks) {
        const metadata = { ..._metadatas[i] || {} };
        const chunkMetadata = chunk.metadata;
        if (chunkMetadata) {
          for (const [key, value] of Object.entries(chunkMetadata || {})) {
            if (value === "#TITLE#") {
              chunkMetadata[key] = metadata["Title"];
            }
          }
        }
        documents.push(
          new llamaindex.Document({
            text: chunk.text,
            metadata: { ...metadata, ...chunkMetadata }
          })
        );
      }
    }
    return documents;
  }
  transformDocuments(documents) {
    const texts = [];
    const metadatas = [];
    for (const doc of documents) {
      texts.push(doc.text);
      metadatas.push(doc.metadata);
    }
    return this.createDocuments(texts, metadatas);
  }
};
var RecursiveJsonTransformer = class _RecursiveJsonTransformer {
  maxSize;
  minSize;
  constructor({ maxSize = 2e3, minSize }) {
    this.maxSize = maxSize;
    this.minSize = minSize ?? Math.max(maxSize - 200, 50);
  }
  static jsonSize(data) {
    const seen = /* @__PURE__ */ new WeakSet();
    function getStringifiableData(obj) {
      if (obj === null || typeof obj !== "object") {
        return obj;
      }
      if (seen.has(obj)) {
        return "[Circular]";
      }
      seen.add(obj);
      if (Array.isArray(obj)) {
        const safeArray = [];
        for (const item of obj) {
          safeArray.push(getStringifiableData(item));
        }
        return safeArray;
      }
      const safeObj = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          safeObj[key] = getStringifiableData(obj[key]);
        }
      }
      return safeObj;
    }
    const stringifiable = getStringifiableData(data);
    const jsonString = JSON.stringify(stringifiable);
    return jsonString.length;
  }
  /**
   * Transform JSON data while handling circular references
   */
  transform(data) {
    const size = _RecursiveJsonTransformer.jsonSize(data);
    const seen = /* @__PURE__ */ new WeakSet();
    function createSafeCopy(obj) {
      if (obj === null || typeof obj !== "object") {
        return obj;
      }
      if (seen.has(obj)) {
        return "[Circular]";
      }
      seen.add(obj);
      if (Array.isArray(obj)) {
        return obj.map((item) => createSafeCopy(item));
      }
      const copy = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          copy[key] = createSafeCopy(obj[key]);
        }
      }
      return copy;
    }
    return {
      size,
      data: createSafeCopy(data)
    };
  }
  /**
   * Set a value in a nested dictionary based on the given path
   */
  static setNestedDict(d, path, value) {
    let current = d;
    for (const key of path.slice(0, -1)) {
      current[key] = current[key] || {};
      current = current[key];
    }
    current[path[path.length - 1]] = value;
  }
  /**
   * Convert lists in the JSON structure to dictionaries with index-based keys
   */
  listToDictPreprocessing(data) {
    if (data && typeof data === "object") {
      if (Array.isArray(data)) {
        return Object.fromEntries(data.map((item, index) => [String(index), this.listToDictPreprocessing(item)]));
      }
      return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, this.listToDictPreprocessing(v)]));
    }
    return data;
  }
  /**
   * Handles primitive values (strings, numbers, etc) by either adding them to the current chunk
   * or creating new chunks if they don't fit
   */
  handlePrimitiveValue(value, key, currentChunk, chunks, fullPath) {
    const testValue = { [key]: value };
    if (_RecursiveJsonTransformer.jsonSize(testValue) <= this.maxSize) {
      if (_RecursiveJsonTransformer.jsonSize({ ...currentChunk, ...testValue }) <= this.maxSize) {
        return {
          currentChunk: { ...currentChunk, ...testValue },
          chunks
        };
      } else {
        return {
          currentChunk: testValue,
          chunks: [...chunks, currentChunk]
        };
      }
    } else if (typeof value === "string") {
      const stringChunks = this.splitLongString(value);
      const newChunks = stringChunks.map((chunk) => {
        return this.createChunk(chunk, fullPath);
      }).filter((chunk) => _RecursiveJsonTransformer.jsonSize(chunk) <= this.maxSize);
      return {
        currentChunk,
        chunks: [...chunks, ...newChunks]
      };
    }
    const newChunk = this.createChunk(value, fullPath);
    return {
      currentChunk,
      chunks: _RecursiveJsonTransformer.jsonSize(newChunk) <= this.maxSize ? [...chunks, newChunk] : chunks
    };
  }
  /**
   * Creates a nested dictionary chunk from a value and path
   * e.g., path ['a', 'b'], value 'c' becomes { a: { b: 'c' } }
   */
  createChunk(value, path) {
    const chunk = {};
    _RecursiveJsonTransformer.setNestedDict(chunk, path, value);
    return chunk.root ? chunk.root : chunk;
  }
  /**
   * Checks if value is within size limits
   */
  isWithinSizeLimit(value, currentSize = 0) {
    const size = _RecursiveJsonTransformer.jsonSize(value);
    return currentSize === 0 ? size <= this.maxSize : size + currentSize <= this.maxSize || currentSize < this.minSize;
  }
  /**
   * Splits arrays into chunks based on size limits
   * Handles nested objects by recursing into handleNestedObject
   */
  handleArray(value, key, currentPath, depth, maxDepth) {
    const path = currentPath.length ? [...currentPath, key] : ["root", key];
    const chunk = this.createChunk(value, path);
    if (this.isWithinSizeLimit(chunk)) {
      return [chunk];
    }
    const chunks = [];
    let currentGroup = [];
    const saveCurrentGroup = () => {
      if (currentGroup.length > 0) {
        const groupChunk = this.createChunk(currentGroup, path);
        if (_RecursiveJsonTransformer.jsonSize(groupChunk) >= this.minSize) {
          chunks.push(groupChunk);
          currentGroup = [];
        }
      }
    };
    for (const item of value) {
      const testGroup = [...currentGroup, item];
      const testChunk = this.createChunk(testGroup, path);
      if (this.isWithinSizeLimit(testChunk)) {
        currentGroup = testGroup;
        continue;
      }
      saveCurrentGroup();
      if (typeof item === "object" && item !== null) {
        const singleItemArray = [item];
        const singleItemChunk = this.createChunk(singleItemArray, path);
        if (this.isWithinSizeLimit(singleItemChunk)) {
          currentGroup = singleItemArray;
        } else {
          const itemPath = [...path, String(chunks.length)];
          const nestedChunks = this.handleNestedObject(item, itemPath, depth + 1, maxDepth);
          chunks.push(...nestedChunks);
        }
      } else {
        currentGroup = [item];
      }
    }
    saveCurrentGroup();
    return chunks;
  }
  /**
   * Splits objects into chunks based on size limits
   * Handles nested arrays and objects by recursing into handleArray and handleNestedObject
   */
  handleNestedObject(value, fullPath, depth, maxDepth) {
    const path = fullPath.length ? fullPath : ["root"];
    if (depth > maxDepth) {
      console.warn(`Maximum depth of ${maxDepth} exceeded, flattening remaining structure`);
      return [this.createChunk(value, path)];
    }
    const wholeChunk = this.createChunk(value, path);
    if (this.isWithinSizeLimit(wholeChunk)) {
      return [wholeChunk];
    }
    const chunks = [];
    let currentChunk = {};
    const saveCurrentChunk = () => {
      if (Object.keys(currentChunk).length > 0) {
        const objChunk = this.createChunk(currentChunk, path);
        if (_RecursiveJsonTransformer.jsonSize(objChunk) >= this.minSize) {
          chunks.push(objChunk);
          currentChunk = {};
        }
      }
    };
    for (const [key, val] of Object.entries(value)) {
      if (val === void 0) continue;
      if (Array.isArray(val)) {
        saveCurrentChunk();
        const arrayChunks = this.handleArray(val, key, path, depth, maxDepth);
        chunks.push(...arrayChunks);
        continue;
      }
      const testChunk = this.createChunk({ ...currentChunk, [key]: val }, path);
      if (this.isWithinSizeLimit(testChunk)) {
        currentChunk[key] = val;
        continue;
      }
      saveCurrentChunk();
      if (typeof val === "object" && val !== null) {
        const nestedChunks = this.handleNestedObject(val, [...path, key], depth + 1, maxDepth);
        chunks.push(...nestedChunks);
      } else {
        currentChunk = { [key]: val };
      }
    }
    saveCurrentChunk();
    return chunks;
  }
  /**
   * Splits long strings into smaller chunks at word boundaries
   * Ensures each chunk is within maxSize limit
   */
  splitLongString(value) {
    const chunks = [];
    let remaining = value;
    while (remaining.length > 0) {
      const overhead = 20;
      const chunkSize = Math.floor(this.maxSize - overhead);
      if (remaining.length <= chunkSize) {
        chunks.push(remaining);
        break;
      }
      const lastSpace = remaining.slice(0, chunkSize).lastIndexOf(" ");
      const splitAt = lastSpace > 0 ? lastSpace + 1 : chunkSize;
      chunks.push(remaining.slice(0, splitAt));
      remaining = remaining.slice(splitAt);
    }
    return chunks;
  }
  /**
   * Core chunking logic that processes JSON data recursively
   * Handles arrays, objects, and primitive values while maintaining structure
   */
  jsonSplit({
    data,
    currentPath = [],
    chunks = [{}],
    depth = 0,
    maxDepth = 100
  }) {
    if (!data || typeof data !== "object") {
      return chunks;
    }
    if (depth > maxDepth) {
      console.warn(`Maximum depth of ${maxDepth} exceeded, flattening remaining structure`);
      _RecursiveJsonTransformer.setNestedDict(chunks[chunks.length - 1] || {}, currentPath, data);
      return chunks;
    }
    let currentChunk = {};
    let accumulatedChunks = chunks;
    for (const [key, value] of Object.entries(data)) {
      const fullPath = [...currentPath, key];
      if (Array.isArray(value)) {
        const arrayChunks = this.handleArray(value, key, currentPath, depth, maxDepth);
        accumulatedChunks = [...accumulatedChunks, ...arrayChunks];
      } else if (typeof value === "object" && value !== null) {
        const objectChunks = this.handleNestedObject(value, fullPath, depth, maxDepth);
        accumulatedChunks = [...accumulatedChunks, ...objectChunks];
      } else {
        const { currentChunk: newCurrentChunk, chunks: newChunks } = this.handlePrimitiveValue(
          value,
          key,
          currentChunk,
          accumulatedChunks,
          fullPath
        );
        currentChunk = newCurrentChunk;
        accumulatedChunks = newChunks;
      }
    }
    if (Object.keys(currentChunk).length > 0) {
      accumulatedChunks = [...accumulatedChunks, currentChunk];
    }
    return accumulatedChunks.filter((chunk) => Object.keys(chunk).length > 0);
  }
  /**
   * Splits JSON into a list of JSON chunks
   */
  splitJson({
    jsonData,
    convertLists = false
  }) {
    const processedData = convertLists ? this.listToDictPreprocessing(jsonData) : jsonData;
    const chunks = this.jsonSplit({ data: processedData });
    if (Object.keys(chunks[chunks.length - 1] || {}).length === 0) {
      chunks.pop();
    }
    return chunks;
  }
  /**
   * Converts Unicode characters to their escaped ASCII representation
   * e.g., 'café' becomes 'caf\u00e9'
   */
  escapeNonAscii(obj) {
    if (typeof obj === "string") {
      return obj.replace(/[\u0080-\uffff]/g, (char) => {
        return `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`;
      });
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => this.escapeNonAscii(item));
    }
    if (typeof obj === "object" && obj !== null) {
      return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, this.escapeNonAscii(value)]));
    }
    return obj;
  }
  /**
   * Splits JSON into a list of JSON formatted strings
   */
  splitText({
    jsonData,
    convertLists = false,
    ensureAscii = true
  }) {
    const chunks = this.splitJson({ jsonData, convertLists });
    if (ensureAscii) {
      const escapedChunks = chunks.map((chunk) => this.escapeNonAscii(chunk));
      return escapedChunks.map((chunk) => JSON.stringify(chunk));
    }
    return chunks.map(
      (chunk) => JSON.stringify(chunk, (key, value) => {
        if (typeof value === "string") {
          return value.replace(/\\u[\da-f]{4}/gi, (match) => String.fromCharCode(parseInt(match.slice(2), 16)));
        }
        return value;
      })
    );
  }
  /**
   * Create documents from a list of json objects
   */
  createDocuments({
    texts,
    convertLists = false,
    ensureAscii = true,
    metadatas
  }) {
    const _metadatas = metadatas || Array(texts.length).fill({});
    const documents = [];
    texts.forEach((text, i) => {
      const chunks = this.splitText({ jsonData: JSON.parse(text), convertLists, ensureAscii });
      chunks.forEach((chunk) => {
        const metadata = { ..._metadatas[i] || {} };
        documents.push(
          new llamaindex.Document({
            text: chunk,
            metadata
          })
        );
      });
    });
    return documents;
  }
  transformDocuments({
    ensureAscii,
    documents,
    convertLists
  }) {
    const texts = [];
    const metadatas = [];
    for (const doc of documents) {
      texts.push(doc.text);
      metadatas.push(doc.metadata);
    }
    return this.createDocuments({
      texts,
      metadatas,
      ensureAscii,
      convertLists
    });
  }
};

// src/document/transformers/latex.ts
var LatexTransformer = class extends RecursiveCharacterTransformer {
  constructor(options = {}) {
    const separators = RecursiveCharacterTransformer.getSeparatorsForLanguage("latex" /* LATEX */);
    super({ separators, isSeparatorRegex: true, options });
  }
};
var MarkdownTransformer = class extends RecursiveCharacterTransformer {
  constructor(options = {}) {
    const separators = RecursiveCharacterTransformer.getSeparatorsForLanguage("markdown" /* MARKDOWN */);
    super({ separators, isSeparatorRegex: true, options });
  }
};
var MarkdownHeaderTransformer = class {
  headersToSplitOn;
  returnEachLine;
  stripHeaders;
  constructor(headersToSplitOn, returnEachLine = false, stripHeaders = true) {
    this.headersToSplitOn = [...headersToSplitOn].sort((a, b) => b[0].length - a[0].length);
    this.returnEachLine = returnEachLine;
    this.stripHeaders = stripHeaders;
  }
  aggregateLinesToChunks(lines) {
    if (this.returnEachLine) {
      return lines.flatMap((line) => {
        const contentLines = line.content.split("\n");
        return contentLines.filter((l) => l.trim() !== "" || this.headersToSplitOn.some(([sep]) => l.trim().startsWith(sep))).map(
          (l) => new llamaindex.Document({
            text: l.trim(),
            metadata: line.metadata
          })
        );
      });
    }
    const aggregatedChunks = [];
    for (const line of lines) {
      if (aggregatedChunks.length > 0 && JSON.stringify(aggregatedChunks?.[aggregatedChunks.length - 1].metadata) === JSON.stringify(line.metadata)) {
        const aggChunk = aggregatedChunks[aggregatedChunks.length - 1];
        aggChunk.content += "  \n" + line.content;
      } else if (aggregatedChunks.length > 0 && JSON.stringify(aggregatedChunks?.[aggregatedChunks.length - 1].metadata) !== JSON.stringify(line.metadata) && Object.keys(aggregatedChunks?.[aggregatedChunks.length - 1].metadata).length < Object.keys(line.metadata).length && aggregatedChunks?.[aggregatedChunks.length - 1]?.content?.split("\n")?.slice(-1)[0][0] === "#" && !this.stripHeaders) {
        if (aggregatedChunks && aggregatedChunks?.[aggregatedChunks.length - 1]) {
          const aggChunk = aggregatedChunks[aggregatedChunks.length - 1];
          if (aggChunk) {
            aggChunk.content += "  \n" + line.content;
            aggChunk.metadata = line.metadata;
          }
        }
      } else {
        aggregatedChunks.push(line);
      }
    }
    return aggregatedChunks.map(
      (chunk) => new llamaindex.Document({
        text: chunk.content,
        metadata: chunk.metadata
      })
    );
  }
  splitText({ text }) {
    const lines = text.split("\n");
    const linesWithMetadata = [];
    let currentContent = [];
    let currentMetadata = {};
    const headerStack = [];
    const initialMetadata = {};
    let inCodeBlock = false;
    let openingFence = "";
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const strippedLine = line.trim();
      if (!inCodeBlock) {
        if (strippedLine.startsWith("```") && strippedLine.split("```").length === 2 || strippedLine.startsWith("~~~")) {
          inCodeBlock = true;
          openingFence = strippedLine.startsWith("```") ? "```" : "~~~";
        }
      } else {
        if (strippedLine.startsWith(openingFence)) {
          inCodeBlock = false;
          openingFence = "";
        }
      }
      if (inCodeBlock) {
        currentContent.push(line);
        continue;
      }
      let headerMatched = false;
      for (const [sep, name] of this.headersToSplitOn) {
        if (strippedLine.startsWith(sep) && (strippedLine.length === sep.length || strippedLine[sep.length] === " ")) {
          headerMatched = true;
          if (currentContent.length > 0) {
            linesWithMetadata.push({
              content: currentContent.join("\n"),
              metadata: { ...currentMetadata }
            });
            currentContent = [];
          }
          if (name !== null) {
            const currentHeaderLevel = (sep.match(/#/g) || []).length;
            while (headerStack.length > 0 && headerStack?.[headerStack.length - 1].level >= currentHeaderLevel) {
              const poppedHeader = headerStack.pop();
              if (poppedHeader.name in initialMetadata) {
                delete initialMetadata[poppedHeader.name];
              }
            }
            const header = {
              level: currentHeaderLevel,
              name,
              data: strippedLine.slice(sep.length).trim()
            };
            headerStack.push(header);
            initialMetadata[name] = header.data;
          }
          linesWithMetadata.push({
            content: line,
            metadata: { ...currentMetadata, ...initialMetadata }
          });
          break;
        }
      }
      if (!headerMatched) {
        if (strippedLine || this.returnEachLine) {
          currentContent.push(line);
          if (this.returnEachLine) {
            linesWithMetadata.push({
              content: line,
              metadata: { ...currentMetadata }
            });
            currentContent = [];
          }
        } else if (currentContent.length > 0) {
          linesWithMetadata.push({
            content: currentContent.join("\n"),
            metadata: { ...currentMetadata }
          });
          currentContent = [];
        }
      }
      currentMetadata = { ...initialMetadata };
    }
    if (currentContent.length > 0) {
      linesWithMetadata.push({
        content: currentContent.join("\n"),
        metadata: currentMetadata
      });
    }
    return this.aggregateLinesToChunks(linesWithMetadata);
  }
  createDocuments(texts, metadatas) {
    const _metadatas = metadatas || Array(texts.length).fill({});
    const documents = [];
    texts.forEach((text, i) => {
      this.splitText({ text }).forEach((chunk) => {
        const metadata = { ..._metadatas[i], ...chunk.metadata };
        documents.push(
          new llamaindex.Document({
            text: chunk.text,
            metadata
          })
        );
      });
    });
    return documents;
  }
  transformDocuments(documents) {
    const texts = [];
    const metadatas = [];
    for (const doc of documents) {
      texts.push(doc.text);
      metadatas.push(doc.metadata);
    }
    return this.createDocuments(texts, metadatas);
  }
};
function splitTextOnTokens({ text, tokenizer }) {
  const splits = [];
  const inputIds = tokenizer.encode(text);
  let startIdx = 0;
  let curIdx = Math.min(startIdx + tokenizer.tokensPerChunk, inputIds.length);
  let chunkIds = inputIds.slice(startIdx, curIdx);
  while (startIdx < inputIds.length) {
    splits.push(tokenizer.decode(chunkIds));
    if (curIdx === inputIds.length) {
      break;
    }
    startIdx += tokenizer.tokensPerChunk - tokenizer.overlap;
    curIdx = Math.min(startIdx + tokenizer.tokensPerChunk, inputIds.length);
    chunkIds = inputIds.slice(startIdx, curIdx);
  }
  return splits;
}
var TokenTransformer = class _TokenTransformer extends TextTransformer {
  tokenizer;
  allowedSpecial;
  disallowedSpecial;
  constructor({
    encodingName = "cl100k_base",
    modelName,
    allowedSpecial = /* @__PURE__ */ new Set(),
    disallowedSpecial = "all",
    options = {}
  }) {
    super(options);
    try {
      this.tokenizer = modelName ? jsTiktoken.encodingForModel(modelName) : jsTiktoken.getEncoding(encodingName);
    } catch {
      throw new Error("Could not load tiktoken encoding. Please install it with `npm install js-tiktoken`.");
    }
    this.allowedSpecial = allowedSpecial;
    this.disallowedSpecial = disallowedSpecial;
  }
  splitText({ text }) {
    const encode = (text2) => {
      const allowed = this.allowedSpecial === "all" ? "all" : Array.from(this.allowedSpecial);
      const disallowed = this.disallowedSpecial === "all" ? "all" : Array.from(this.disallowedSpecial);
      const processedText = this.stripWhitespace ? text2.trim() : text2;
      return Array.from(this.tokenizer.encode(processedText, allowed, disallowed));
    };
    const decode = (tokens) => {
      const text2 = this.tokenizer.decode(tokens);
      return this.stripWhitespace ? text2.trim() : text2;
    };
    const tokenizer = {
      overlap: this.overlap,
      tokensPerChunk: this.size,
      decode,
      encode
    };
    return splitTextOnTokens({ text, tokenizer });
  }
  static fromTikToken({
    encodingName = "cl100k_base",
    modelName,
    options = {}
  }) {
    let tokenizer;
    try {
      if (modelName) {
        tokenizer = jsTiktoken.encodingForModel(modelName);
      } else {
        tokenizer = jsTiktoken.getEncoding(encodingName);
      }
    } catch {
      throw new Error("Could not load tiktoken encoding. Please install it with `npm install js-tiktoken`.");
    }
    const tikTokenEncoder = (text) => {
      const allowed = options.allowedSpecial === "all" ? "all" : options.allowedSpecial ? Array.from(options.allowedSpecial) : [];
      const disallowed = options.disallowedSpecial === "all" ? "all" : options.disallowedSpecial ? Array.from(options.disallowedSpecial) : [];
      return tokenizer.encode(text, allowed, disallowed).length;
    };
    return new _TokenTransformer({
      encodingName,
      modelName,
      allowedSpecial: options.allowedSpecial,
      disallowedSpecial: options.disallowedSpecial,
      options: {
        size: options.size,
        overlap: options.overlap,
        lengthFunction: tikTokenEncoder
      }
    });
  }
};

// src/document/document.ts
var MDocument = class _MDocument {
  chunks;
  type;
  // e.g., 'text', 'html', 'markdown', 'json'
  constructor({ docs, type }) {
    this.chunks = docs.map((d) => {
      return new llamaindex.Document({ text: d.text, metadata: d.metadata });
    });
    this.type = type;
  }
  async extractMetadata({ title, summary, questions, keywords }) {
    const transformations = [];
    if (typeof summary !== "undefined") {
      transformations.push(new llamaindex.SummaryExtractor(typeof summary === "boolean" ? {} : summary));
    }
    if (typeof questions !== "undefined") {
      transformations.push(new llamaindex.QuestionsAnsweredExtractor(typeof questions === "boolean" ? {} : questions));
    }
    if (typeof keywords !== "undefined") {
      transformations.push(new llamaindex.KeywordExtractor(typeof keywords === "boolean" ? {} : keywords));
    }
    if (typeof title !== "undefined") {
      transformations.push(new llamaindex.TitleExtractor(typeof title === "boolean" ? {} : title));
    }
    const pipeline = new llamaindex.IngestionPipeline({
      transformations
    });
    const nodes = await pipeline.run({
      documents: this.chunks
    });
    this.chunks = this.chunks.map((doc, i) => {
      return new llamaindex.Document({
        text: doc.text,
        metadata: {
          ...doc.metadata,
          ...nodes?.[i]?.metadata || {}
        }
      });
    });
    return this;
  }
  static fromText(text, metadata) {
    return new _MDocument({
      docs: [
        {
          text,
          metadata
        }
      ],
      type: "text"
    });
  }
  static fromHTML(html, metadata) {
    return new _MDocument({
      docs: [
        {
          text: html,
          metadata
        }
      ],
      type: "html"
    });
  }
  static fromMarkdown(markdown, metadata) {
    return new _MDocument({
      docs: [
        {
          text: markdown,
          metadata
        }
      ],
      type: "markdown"
    });
  }
  static fromJSON(jsonString, metadata) {
    return new _MDocument({
      docs: [
        {
          text: jsonString,
          metadata
        }
      ],
      type: "json"
    });
  }
  defaultStrategy() {
    switch (this.type) {
      case "html":
        return "html";
      case "markdown":
        return "markdown";
      case "json":
        return "json";
      case "latex":
        return "latex";
      default:
        return "recursive";
    }
  }
  async chunkBy(strategy, options) {
    switch (strategy) {
      case "recursive":
        await this.chunkRecursive(options);
        break;
      case "character":
        await this.chunkCharacter(options);
        break;
      case "token":
        await this.chunkToken(options);
        break;
      case "markdown":
        await this.chunkMarkdown(options);
        break;
      case "html":
        await this.chunkHTML(options);
        break;
      case "json":
        await this.chunkJSON(options);
        break;
      case "latex":
        await this.chunkLatex(options);
        break;
      default:
        throw new Error(`Unknown strategy: ${strategy}`);
    }
  }
  async chunkRecursive(options) {
    if (options?.language) {
      const rt2 = RecursiveCharacterTransformer.fromLanguage(options.language, options);
      const textSplit2 = rt2.transformDocuments(this.chunks);
      this.chunks = textSplit2;
      return;
    }
    const rt = new RecursiveCharacterTransformer({
      separators: options?.separators,
      isSeparatorRegex: options?.isSeparatorRegex,
      options
    });
    const textSplit = rt.transformDocuments(this.chunks);
    this.chunks = textSplit;
  }
  async chunkCharacter(options) {
    const rt = new CharacterTransformer({
      separator: options?.separator,
      isSeparatorRegex: options?.isSeparatorRegex,
      options
    });
    const textSplit = rt.transformDocuments(this.chunks);
    this.chunks = textSplit;
  }
  async chunkHTML(options) {
    if (options?.headers?.length) {
      const rt = new HTMLHeaderTransformer(options.headers, options?.returnEachLine);
      const textSplit = rt.transformDocuments(this.chunks);
      this.chunks = textSplit;
      return;
    }
    if (options?.sections?.length) {
      const rt = new HTMLSectionTransformer(options.sections);
      const textSplit = rt.transformDocuments(this.chunks);
      this.chunks = textSplit;
      return;
    }
    throw new Error("HTML chunking requires either headers or sections to be specified");
  }
  async chunkJSON(options) {
    if (!options?.maxSize) {
      throw new Error("JSON chunking requires maxSize to be specified");
    }
    const rt = new RecursiveJsonTransformer({
      maxSize: options?.maxSize,
      minSize: options?.minSize
    });
    const textSplit = rt.transformDocuments({
      documents: this.chunks,
      ensureAscii: options?.ensureAscii,
      convertLists: options?.convertLists
    });
    this.chunks = textSplit;
  }
  async chunkLatex(options) {
    const rt = new LatexTransformer(options);
    const textSplit = rt.transformDocuments(this.chunks);
    this.chunks = textSplit;
  }
  async chunkToken(options) {
    const rt = TokenTransformer.fromTikToken({
      options,
      encodingName: options?.encodingName,
      modelName: options?.modelName
    });
    const textSplit = rt.transformDocuments(this.chunks);
    this.chunks = textSplit;
  }
  async chunkMarkdown(options) {
    if (options?.headers) {
      const rt2 = new MarkdownHeaderTransformer(options.headers, options?.returnEachLine, options?.stripHeaders);
      const textSplit2 = rt2.transformDocuments(this.chunks);
      this.chunks = textSplit2;
      return;
    }
    const rt = new MarkdownTransformer(options);
    const textSplit = rt.transformDocuments(this.chunks);
    this.chunks = textSplit;
  }
  async chunk(params) {
    const { strategy: passedStrategy, extract, ...chunkOptions } = params || {};
    const strategy = passedStrategy || this.defaultStrategy();
    await this.chunkBy(strategy, chunkOptions);
    if (extract) {
      await this.extractMetadata(extract);
    }
    return this.chunks;
  }
  getDocs() {
    return this.chunks;
  }
  getText() {
    return this.chunks.map((doc) => doc.text);
  }
  getMetadata() {
    return this.chunks.map((doc) => doc.metadata);
  }
};
var DEFAULT_WEIGHTS = {
  semantic: 0.4,
  vector: 0.4,
  position: 0.2
};
function calculatePositionScore(position, totalChunks) {
  return 1 - position / totalChunks;
}
function analyzeQueryEmbedding(embedding) {
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  const dominantFeatures = embedding.map((value, index) => ({ value: Math.abs(value), index })).sort((a, b) => b.value - a.value).slice(0, 5).map((item) => item.index);
  return { magnitude, dominantFeatures };
}
function adjustScores(score, queryAnalysis) {
  const magnitudeAdjustment = queryAnalysis.magnitude > 10 ? 1.1 : 1;
  const featureStrengthAdjustment = queryAnalysis.magnitude > 5 ? 1.05 : 1;
  return score * magnitudeAdjustment * featureStrengthAdjustment;
}
async function rerank(results, query, model, options) {
  let semanticProvider;
  if (model.modelId === "rerank-v3.5") {
    semanticProvider = new relevance.CohereRelevanceScorer(model.modelId);
  } else {
    semanticProvider = new relevance.MastraAgentRelevanceScorer(model.provider, model);
  }
  const { queryEmbedding, topK = 3 } = options;
  const weights = {
    ...DEFAULT_WEIGHTS,
    ...options.weights
  };
  const totalWeights = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  if (totalWeights !== 1) {
    throw new Error("Weights must add up to 1");
  }
  const resultLength = results.length;
  const queryAnalysis = queryEmbedding ? analyzeQueryEmbedding(queryEmbedding) : null;
  const scoredResults = await Promise.all(
    results.map(async (result, index) => {
      let semanticScore = 0;
      if (result?.metadata?.text) {
        semanticScore = await semanticProvider.getRelevanceScore(query, result?.metadata?.text);
      }
      const vectorScore = result.score;
      const positionScore = calculatePositionScore(index, resultLength);
      let finalScore = weights.semantic * semanticScore + weights.vector * vectorScore + weights.position * positionScore;
      if (queryAnalysis) {
        finalScore = adjustScores(finalScore, queryAnalysis);
      }
      return {
        result,
        score: finalScore,
        details: {
          semantic: semanticScore,
          vector: vectorScore,
          position: positionScore,
          ...queryAnalysis && {
            queryAnalysis: {
              magnitude: queryAnalysis.magnitude,
              dominantFeatures: queryAnalysis.dominantFeatures
            }
          }
        }
      };
    })
  );
  return scoredResults.sort((a, b) => b.score - a.score).slice(0, topK);
}

// src/graph-rag/index.ts
var GraphRAG = class {
  nodes;
  edges;
  dimension;
  threshold;
  constructor(dimension = 1536, threshold = 0.7) {
    this.nodes = /* @__PURE__ */ new Map();
    this.edges = [];
    this.dimension = dimension;
    this.threshold = threshold;
  }
  // Add a node to the graph
  addNode(node) {
    if (!node.embedding) {
      throw new Error("Node must have an embedding");
    }
    if (node.embedding.length !== this.dimension) {
      throw new Error(`Embedding dimension must be ${this.dimension}`);
    }
    this.nodes.set(node.id, node);
  }
  // Add an edge between two nodes
  addEdge(edge) {
    if (!this.nodes.has(edge.source) || !this.nodes.has(edge.target)) {
      throw new Error("Both source and target nodes must exist");
    }
    this.edges.push(edge);
    this.edges.push({
      source: edge.target,
      target: edge.source,
      weight: edge.weight,
      type: edge.type
    });
  }
  // Helper method to get all nodes
  getNodes() {
    return Array.from(this.nodes.values());
  }
  // Helper method to get all edges
  getEdges() {
    return this.edges;
  }
  getEdgesByType(type) {
    return this.edges.filter((edge) => edge.type === type);
  }
  clear() {
    this.nodes.clear();
    this.edges = [];
  }
  updateNodeContent(id, newContent) {
    const node = this.nodes.get(id);
    if (!node) {
      throw new Error(`Node ${id} not found`);
    }
    node.content = newContent;
  }
  // Get neighbors of a node
  getNeighbors(nodeId, edgeType) {
    return this.edges.filter((edge) => edge.source === nodeId && (!edgeType || edge.type === edgeType)).map((edge) => ({
      id: edge.target,
      weight: edge.weight
    })).filter((node) => node !== void 0);
  }
  // Calculate cosine similarity between two vectors
  cosineSimilarity(vec1, vec2) {
    if (!vec1 || !vec2) {
      throw new Error("Vectors must not be null or undefined");
    }
    const vectorLength = vec1.length;
    if (vectorLength !== vec2.length) {
      throw new Error(`Vector dimensions must match: vec1(${vec1.length}) !== vec2(${vec2.length})`);
    }
    let dotProduct = 0;
    let normVec1 = 0;
    let normVec2 = 0;
    for (let i = 0; i < vectorLength; i++) {
      const a = vec1[i];
      const b = vec2[i];
      dotProduct += a * b;
      normVec1 += a * a;
      normVec2 += b * b;
    }
    const magnitudeProduct = Math.sqrt(normVec1 * normVec2);
    if (magnitudeProduct === 0) {
      return 0;
    }
    const similarity = dotProduct / magnitudeProduct;
    return Math.max(-1, Math.min(1, similarity));
  }
  createGraph(chunks, embeddings) {
    if (!chunks?.length || !embeddings?.length) {
      throw new Error("Chunks and embeddings arrays must not be empty");
    }
    if (chunks.length !== embeddings.length) {
      throw new Error("Chunks and embeddings must have the same length");
    }
    chunks.forEach((chunk, index) => {
      const node = {
        id: index.toString(),
        content: chunk.text,
        embedding: embeddings[index]?.vector,
        metadata: { ...chunk.metadata }
      };
      this.addNode(node);
      this.nodes.set(node.id, node);
    });
    for (let i = 0; i < chunks.length; i++) {
      const firstEmbedding = embeddings[i]?.vector;
      for (let j = i + 1; j < chunks.length; j++) {
        const secondEmbedding = embeddings[j]?.vector;
        const similarity = this.cosineSimilarity(firstEmbedding, secondEmbedding);
        if (similarity > this.threshold) {
          this.addEdge({
            source: i.toString(),
            target: j.toString(),
            weight: similarity,
            type: "semantic"
          });
        }
      }
    }
  }
  selectWeightedNeighbor(neighbors) {
    const totalWeight = neighbors.reduce((sum, n) => sum + n.weight, 0);
    let remainingWeight = Math.random() * totalWeight;
    for (const neighbor of neighbors) {
      remainingWeight -= neighbor.weight;
      if (remainingWeight <= 0) {
        return neighbor.id;
      }
    }
    return neighbors[neighbors.length - 1]?.id;
  }
  // Perform random walk with restart
  randomWalkWithRestart(startNodeId, steps, restartProb) {
    const visits = /* @__PURE__ */ new Map();
    let currentNodeId = startNodeId;
    for (let step = 0; step < steps; step++) {
      visits.set(currentNodeId, (visits.get(currentNodeId) || 0) + 1);
      if (Math.random() < restartProb) {
        currentNodeId = startNodeId;
        continue;
      }
      const neighbors = this.getNeighbors(currentNodeId);
      if (neighbors.length === 0) {
        currentNodeId = startNodeId;
        continue;
      }
      currentNodeId = this.selectWeightedNeighbor(neighbors);
    }
    const totalVisits = Array.from(visits.values()).reduce((a, b) => a + b, 0);
    const normalizedVisits = /* @__PURE__ */ new Map();
    for (const [nodeId, count] of visits) {
      normalizedVisits.set(nodeId, count / totalVisits);
    }
    return normalizedVisits;
  }
  // Retrieve relevant nodes using hybrid approach
  query({
    query,
    topK = 10,
    randomWalkSteps = 100,
    restartProb = 0.15
  }) {
    if (!query || query.length !== this.dimension) {
      throw new Error(`Query embedding must have dimension ${this.dimension}`);
    }
    if (topK < 1) {
      throw new Error("TopK must be greater than 0");
    }
    if (randomWalkSteps < 1) {
      throw new Error("Random walk steps must be greater than 0");
    }
    if (restartProb <= 0 || restartProb >= 1) {
      throw new Error("Restart probability must be between 0 and 1");
    }
    const similarities = Array.from(this.nodes.values()).map((node) => ({
      node,
      similarity: this.cosineSimilarity(query, node.embedding)
    }));
    similarities.sort((a, b) => b.similarity - a.similarity);
    const topNodes = similarities.slice(0, topK);
    const rerankedNodes = /* @__PURE__ */ new Map();
    for (const { node, similarity } of topNodes) {
      const walkScores = this.randomWalkWithRestart(node.id, randomWalkSteps, restartProb);
      for (const [nodeId, walkScore] of walkScores) {
        const node2 = this.nodes.get(nodeId);
        const existingScore = rerankedNodes.get(nodeId)?.score || 0;
        rerankedNodes.set(nodeId, {
          node: node2,
          score: existingScore + similarity * walkScore
        });
      }
    }
    return Array.from(rerankedNodes.values()).sort((a, b) => b.score - a.score).slice(0, topK).map((item) => ({
      id: item.node.id,
      content: item.node.content,
      metadata: item.node.metadata,
      score: item.score
    }));
  }
};
var createDocumentChunkerTool = ({
  doc,
  params = {
    strategy: "recursive",
    size: 512,
    overlap: 50,
    separator: "\n"
  }
}) => {
  return tools.createTool({
    id: `Document Chunker ${params.strategy} ${params.size}`,
    inputSchema: zod.z.object({}),
    description: `Chunks document using ${params.strategy} strategy with size ${params.size} and ${params.overlap} overlap`,
    execute: async () => {
      const chunks = await doc.chunk(params);
      return {
        chunks
      };
    }
  });
};
var vectorQuerySearch = async ({
  indexName,
  vectorStore,
  queryText,
  model,
  queryFilter,
  topK,
  includeVectors = false,
  maxRetries = 2
}) => {
  const { embedding } = await ai.embed({
    value: queryText,
    model,
    maxRetries
  });
  const results = await vectorStore.query({
    indexName,
    queryVector: embedding,
    topK,
    filter: queryFilter,
    includeVector: includeVectors
  });
  return { results, queryEmbedding: embedding };
};

// src/utils/default-settings.ts
var defaultVectorQueryDescription = () => `Access the knowledge base to find information needed to answer user questions.`;
var defaultGraphRagDescription = () => `Access and analyze relationships between information in the knowledge base to answer complex questions about connections and patterns.`;
var queryTextDescription = `The text query to search for in the vector database.
- ALWAYS provide a non-empty query string
- Must contain the user's question or search terms
- Example: "market data" or "financial reports"
- If the user's query is about a specific topic, use that topic as the queryText
- Cannot be an empty string
- Do not include quotes, just the text itself
- Required for all searches`;
var topKDescription = `Controls how many matching documents to return.
- ALWAYS provide a value
- If no value is provided, use the default (10)
- Must be a valid and positive number
- Cannot be NaN
- Uses provided value if specified
- Default: 10 results (use this if unsure)
- Higher values (like 20) provide more context
- Lower values (like 3) focus on best matches
- Based on query requirements`;
var filterDescription = `JSON-formatted criteria to refine search results.
- ALWAYS provide a filter value
- If no filter is provided, use the default ("{}")
- MUST be a valid, complete JSON object with proper quotes and brackets
- Uses provided filter if specified
- Default: "{}" (no filtering)
- Example for no filtering: "filter": "{}"
- Example: '{"category": "health"}'
- Based on query intent
- Do NOT use single quotes or unquoted properties
- IMPORTANT: Always ensure JSON is properly closed with matching brackets
- Multiple filters can be combined`;

// src/tools/graph-rag.ts
var createGraphRAGTool = ({
  vectorStoreName,
  indexName,
  model,
  enableFilter = false,
  graphOptions = {
    dimension: 1536,
    randomWalkSteps: 100,
    restartProb: 0.15,
    threshold: 0.7
  },
  id,
  description
}) => {
  const toolId = id || `GraphRAG ${vectorStoreName} ${indexName} Tool`;
  const toolDescription = description || defaultGraphRagDescription();
  const graphRag = new GraphRAG(graphOptions.dimension, graphOptions.threshold);
  let isInitialized = false;
  const baseSchema = {
    queryText: zod.z.string().describe(queryTextDescription),
    topK: zod.z.coerce.number().describe(topKDescription)
  };
  const inputSchema = enableFilter ? zod.z.object({
    ...baseSchema,
    filter: zod.z.coerce.string().describe(filterDescription)
  }).passthrough() : zod.z.object(baseSchema).passthrough();
  return tools.createTool({
    id: toolId,
    inputSchema,
    outputSchema: zod.z.object({
      relevantContext: zod.z.any()
    }),
    description: toolDescription,
    execute: async ({ context: { queryText, topK, filter }, mastra }) => {
      const topKValue = typeof topK === "number" && !isNaN(topK) ? topK : typeof topK === "string" && !isNaN(Number(topK)) ? Number(topK) : 10;
      const vectorStore = mastra?.getVector(vectorStoreName);
      const logger = mastra?.getLogger();
      if (vectorStore) {
        let queryFilter = {};
        if (enableFilter) {
          queryFilter = (() => {
            try {
              return typeof filter === "string" ? JSON.parse(filter) : filter;
            } catch (error) {
              if (logger) {
                logger.warn("Failed to parse filter as JSON, using empty filter", { filter, error });
              }
              return {};
            }
          })();
        }
        if (logger) {
          logger.debug("Using this filter and topK:", { queryFilter, topK: topKValue });
        }
        const { results, queryEmbedding } = await vectorQuerySearch({
          indexName,
          vectorStore,
          queryText,
          model,
          queryFilter: Object.keys(queryFilter || {}).length > 0 ? queryFilter : void 0,
          topK: topKValue,
          includeVectors: true
        });
        if (!isInitialized) {
          const chunks = results.map((result) => ({
            text: result?.metadata?.text,
            metadata: result.metadata ?? {}
          }));
          const embeddings = results.map((result) => ({
            vector: result.vector || []
          }));
          graphRag.createGraph(chunks, embeddings);
          isInitialized = true;
        }
        const rerankedResults = graphRag.query({
          query: queryEmbedding,
          topK: topKValue,
          randomWalkSteps: graphOptions.randomWalkSteps,
          restartProb: graphOptions.restartProb
        });
        const relevantChunks = rerankedResults.map((result) => result.content);
        return {
          relevantContext: relevantChunks
        };
      }
      return {
        relevantContext: []
      };
    }
  });
};
var createVectorQueryTool = ({
  vectorStoreName,
  indexName,
  model,
  enableFilter = false,
  reranker,
  id,
  description
}) => {
  const toolId = id || `VectorQuery ${vectorStoreName} ${indexName} Tool`;
  const toolDescription = description || defaultVectorQueryDescription();
  const baseSchema = {
    queryText: zod.z.string().describe(queryTextDescription),
    topK: zod.z.coerce.number().describe(topKDescription)
  };
  const inputSchema = enableFilter ? zod.z.object({
    ...baseSchema,
    filter: zod.z.coerce.string().describe(filterDescription)
  }).passthrough() : zod.z.object(baseSchema).passthrough();
  return tools.createTool({
    id: toolId,
    inputSchema,
    outputSchema: zod.z.object({
      relevantContext: zod.z.any()
    }),
    description: toolDescription,
    execute: async ({ context: { queryText, topK, filter }, mastra }) => {
      const topKValue = typeof topK === "number" && !isNaN(topK) ? topK : typeof topK === "string" && !isNaN(Number(topK)) ? Number(topK) : 10;
      const vectorStore = mastra?.getVector(vectorStoreName);
      const logger = mastra?.getLogger();
      if (vectorStore) {
        let queryFilter = {};
        if (enableFilter && filter) {
          queryFilter = (() => {
            try {
              return typeof filter === "string" ? JSON.parse(filter) : filter;
            } catch (error) {
              if (logger) {
                logger.warn("Failed to parse filter as JSON, using empty filter", { filter, error });
              }
              return {};
            }
          })();
        }
        if (logger) {
          logger.debug("Using this filter and topK:", { queryFilter, topK: topKValue });
        }
        const { results } = await vectorQuerySearch({
          indexName,
          vectorStore,
          queryText,
          model,
          queryFilter: Object.keys(queryFilter || {}).length > 0 ? queryFilter : void 0,
          topK: topKValue
        });
        if (reranker) {
          const rerankedResults = await rerank(results, queryText, reranker.model, {
            ...reranker.options,
            topK: reranker.options?.topK || topKValue
          });
          const relevantChunks2 = rerankedResults.map(({ result }) => result?.metadata);
          return { relevantContext: relevantChunks2 };
        }
        const relevantChunks = results.map((result) => result?.metadata);
        return {
          relevantContext: relevantChunks
        };
      }
      return {
        relevantContext: []
      };
    }
  });
};

// src/utils/vector-prompts.ts
var ASTRA_PROMPT = `When querying Astra, you can ONLY use the operators listed below. Any other operators will be rejected.
Important: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.
If a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.

Basic Comparison Operators:
- $eq: Exact match (default when using field: value)
  Example: { "category": "electronics" }
- $ne: Not equal
  Example: { "category": { "$ne": "electronics" } }
- $gt: Greater than
  Example: { "price": { "$gt": 100 } }
- $gte: Greater than or equal
  Example: { "price": { "$gte": 100 } }
- $lt: Less than
  Example: { "price": { "$lt": 100 } }
- $lte: Less than or equal
  Example: { "price": { "$lte": 100 } }

Array Operators:
- $in: Match any value in array
  Example: { "category": { "$in": ["electronics", "books"] } }
- $nin: Does not match any value in array
  Example: { "category": { "$nin": ["electronics", "books"] } }
- $all: Match all values in array
  Example: { "tags": { "$all": ["premium", "sale"] } }

Logical Operators:
- $and: Logical AND (can be implicit or explicit)
  Implicit Example: { "price": { "$gt": 100 }, "category": "electronics" }
  Explicit Example: { "$and": [{ "price": { "$gt": 100 } }, { "category": "electronics" }] }
- $or: Logical OR
  Example: { "$or": [{ "price": { "$lt": 50 } }, { "category": "books" }] }
- $not: Logical NOT
  Example: { "$not": { "category": "electronics" } }

Element Operators:
- $exists: Check if field exists
  Example: { "rating": { "$exists": true } }

Special Operators:
- $size: Array length check
  Example: { "tags": { "$size": 2 } }

Restrictions:
- Regex patterns are not supported
- Only $and, $or, and $not logical operators are supported
- Nested fields are supported using dot notation
- Multiple conditions on the same field are supported with both implicit and explicit $and
- Empty arrays in $in/$nin will return no results
- A non-empty array is required for $all operator
- Only logical operators ($and, $or, $not) can be used at the top level
- All other operators must be used within a field condition
  Valid: { "field": { "$gt": 100 } }
  Valid: { "$and": [...] }
  Invalid: { "$gt": 100 }
- Logical operators must contain field conditions, not direct operators
  Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  Invalid: { "$and": [{ "$gt": 100 }] }
- $not operator:
  - Must be an object
  - Cannot be empty
  - Can be used at field level or top level
  - Valid: { "$not": { "field": "value" } }
  - Valid: { "field": { "$not": { "$eq": "value" } } }
- Other logical operators ($and, $or):
  - Can only be used at top level or nested within other logical operators
  - Can not be used on a field level, or be nested inside a field
  - Can not be used inside an operator
  - Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  - Valid: { "$or": [{ "$and": [{ "field": { "$gt": 100 } }] }] }
  - Invalid: { "field": { "$and": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$or": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$gt": { "$and": [{...}] } } }

Example Complex Query:
{
  "$and": [
    { "category": { "$in": ["electronics", "computers"] } },
    { "price": { "$gte": 100, "$lte": 1000 } },
    { "tags": { "$all": ["premium"] } },
    { "rating": { "$exists": true, "$gt": 4 } },
    { "$or": [
      { "stock": { "$gt": 0 } },
      { "preorder": true }
    ]}
  ]
}`;
var CHROMA_PROMPT = `When querying Chroma, you can ONLY use the operators listed below. Any other operators will be rejected.
Important: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.
If a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.

Basic Comparison Operators:
- $eq: Exact match (default when using field: value)
  Example: { "category": "electronics" }
- $ne: Not equal
  Example: { "category": { "$ne": "electronics" } }
- $gt: Greater than
  Example: { "price": { "$gt": 100 } }
- $gte: Greater than or equal
  Example: { "price": { "$gte": 100 } }
- $lt: Less than
  Example: { "price": { "$lt": 100 } }
- $lte: Less than or equal
  Example: { "price": { "$lte": 100 } }

Array Operators:
- $in: Match any value in array
  Example: { "category": { "$in": ["electronics", "books"] } }
- $nin: Does not match any value in array
  Example: { "category": { "$nin": ["electronics", "books"] } }

Logical Operators:
- $and: Logical AND
  Example: { "$and": [{ "price": { "$gt": 100 } }, { "category": "electronics" }] }
- $or: Logical OR
  Example: { "$or": [{ "price": { "$lt": 50 } }, { "category": "books" }] }

Restrictions:
- Regex patterns are not supported
- Element operators are not supported
- Only $and and $or logical operators are supported
- Nested fields are supported using dot notation
- Multiple conditions on the same field are supported with both implicit and explicit $and
- Empty arrays in $in/$nin will return no results
- If multiple top-level fields exist, they're wrapped in $and
- Only logical operators ($and, $or) can be used at the top level
- All other operators must be used within a field condition
  Valid: { "field": { "$gt": 100 } }
  Valid: { "$and": [...] }
  Invalid: { "$gt": 100 }
  Invalid: { "$in": [...] }
- Logical operators must contain field conditions, not direct operators
  Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  Invalid: { "$and": [{ "$gt": 100 }] }
- Logical operators ($and, $or):
  - Can only be used at top level or nested within other logical operators
  - Can not be used on a field level, or be nested inside a field
  - Can not be used inside an operator
  - Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  - Valid: { "$or": [{ "$and": [{ "field": { "$gt": 100 } }] }] }
  - Invalid: { "field": { "$and": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$or": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$gt": { "$and": [{...}] } } }
Example Complex Query:
{
  "$and": [
    { "category": { "$in": ["electronics", "computers"] } },
    { "price": { "$gte": 100, "$lte": 1000 } },
    { "$or": [
      { "inStock": true },
      { "preorder": true }
    ]}
  ]
}`;
var LIBSQL_PROMPT = `When querying LibSQL Vector, you can ONLY use the operators listed below. Any other operators will be rejected.
Important: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.
If a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.

Basic Comparison Operators:
- $eq: Exact match (default when using field: value)
  Example: { "category": "electronics" }
- $ne: Not equal
  Example: { "category": { "$ne": "electronics" } }
- $gt: Greater than
  Example: { "price": { "$gt": 100 } }
- $gte: Greater than or equal
  Example: { "price": { "$gte": 100 } }
- $lt: Less than
  Example: { "price": { "$lt": 100 } }
- $lte: Less than or equal
  Example: { "price": { "$lte": 100 } }

Array Operators:
- $in: Match any value in array
  Example: { "category": { "$in": ["electronics", "books"] } }
- $nin: Does not match any value in array
  Example: { "category": { "$nin": ["electronics", "books"] } }
- $all: Match all values in array
  Example: { "tags": { "$all": ["premium", "sale"] } }
- $elemMatch: Match array elements that meet all specified conditions
  Example: { "items": { "$elemMatch": { "price": { "$gt": 100 } } } }
- $contains: Check if array contains value
  Example: { "tags": { "$contains": "premium" } }

Logical Operators:
- $and: Logical AND (implicit when using multiple conditions)
  Example: { "$and": [{ "price": { "$gt": 100 } }, { "category": "electronics" }] }
- $or: Logical OR
  Example: { "$or": [{ "price": { "$lt": 50 } }, { "category": "books" }] }
- $not: Logical NOT
  Example: { "$not": { "category": "electronics" } }
- $nor: Logical NOR
  Example: { "$nor": [{ "price": { "$lt": 50 } }, { "category": "books" }] }

Element Operators:
- $exists: Check if field exists
  Example: { "rating": { "$exists": true } }

Special Operators:
- $size: Array length check
  Example: { "tags": { "$size": 2 } }

Restrictions:
- Regex patterns are not supported
- Direct RegExp patterns will throw an error
- Nested fields are supported using dot notation
- Multiple conditions on the same field are supported with both implicit and explicit $and
- Array operations work on array fields only
- Basic operators handle array values as JSON strings
- Empty arrays in conditions are handled gracefully
- Only logical operators ($and, $or, $not, $nor) can be used at the top level
- All other operators must be used within a field condition
  Valid: { "field": { "$gt": 100 } }
  Valid: { "$and": [...] }
  Invalid: { "$gt": 100 }
  Invalid: { "$contains": "value" }
- Logical operators must contain field conditions, not direct operators
  Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  Invalid: { "$and": [{ "$gt": 100 }] }
- $not operator:
  - Must be an object
  - Cannot be empty
  - Can be used at field level or top level
  - Valid: { "$not": { "field": "value" } }
  - Valid: { "field": { "$not": { "$eq": "value" } } }
- Other logical operators ($and, $or, $nor):
  - Can only be used at top level or nested within other logical operators
  - Can not be used on a field level, or be nested inside a field
  - Can not be used inside an operator
  - Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  - Valid: { "$or": [{ "$and": [{ "field": { "$gt": 100 } }] }] }
  - Invalid: { "field": { "$and": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$or": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$gt": { "$and": [{...}] } } }
- $elemMatch requires an object with conditions
  Valid: { "array": { "$elemMatch": { "field": "value" } } }
  Invalid: { "array": { "$elemMatch": "value" } }

Example Complex Query:
{
  "$and": [
    { "category": { "$in": ["electronics", "computers"] } },
    { "price": { "$gte": 100, "$lte": 1000 } },
    { "tags": { "$all": ["premium", "sale"] } },
    { "items": { "$elemMatch": { "price": { "$gt": 50 }, "inStock": true } } },
    { "$or": [
      { "stock": { "$gt": 0 } },
      { "preorder": true }
    ]}
  ]
}`;
var PGVECTOR_PROMPT = `When querying PG Vector, you can ONLY use the operators listed below. Any other operators will be rejected.
Important: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.
If a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.

Basic Comparison Operators:
- $eq: Exact match (default when using field: value)
  Example: { "category": "electronics" }
- $ne: Not equal
  Example: { "category": { "$ne": "electronics" } }
- $gt: Greater than
  Example: { "price": { "$gt": 100 } }
- $gte: Greater than or equal
  Example: { "price": { "$gte": 100 } }
- $lt: Less than
  Example: { "price": { "$lt": 100 } }
- $lte: Less than or equal
  Example: { "price": { "$lte": 100 } }

Array Operators:
- $in: Match any value in array
  Example: { "category": { "$in": ["electronics", "books"] } }
- $nin: Does not match any value in array
  Example: { "category": { "$nin": ["electronics", "books"] } }
- $all: Match all values in array
  Example: { "tags": { "$all": ["premium", "sale"] } }
- $elemMatch: Match array elements that meet all specified conditions
  Example: { "items": { "$elemMatch": { "price": { "$gt": 100 } } } }
- $contains: Check if array contains value
  Example: { "tags": { "$contains": "premium" } }

Logical Operators:
- $and: Logical AND
  Example: { "$and": [{ "price": { "$gt": 100 } }, { "category": "electronics" }] }
- $or: Logical OR
  Example: { "$or": [{ "price": { "$lt": 50 } }, { "category": "books" }] }
- $not: Logical NOT
  Example: { "$not": { "category": "electronics" } }
- $nor: Logical NOR
  Example: { "$nor": [{ "price": { "$lt": 50 } }, { "category": "books" }] }

Element Operators:
- $exists: Check if field exists
  Example: { "rating": { "$exists": true } }

Special Operators:
- $size: Array length check
  Example: { "tags": { "$size": 2 } }
- $regex: Pattern matching (PostgreSQL regex syntax)
  Example: { "name": { "$regex": "^iphone" } }
- $options: Regex options (used with $regex)
  Example: { "name": { "$regex": "iphone", "$options": "i" } }

Restrictions:
- Direct RegExp patterns are supported
- Nested fields are supported using dot notation
- Multiple conditions on the same field are supported with both implicit and explicit $and
- Array operations work on array fields only
- Regex patterns must follow PostgreSQL syntax
- Empty arrays in conditions are handled gracefully
- Only logical operators ($and, $or, $not, $nor) can be used at the top level
- All other operators must be used within a field condition
  Valid: { "field": { "$gt": 100 } }
  Valid: { "$and": [...] }
  Invalid: { "$gt": 100 }
  Invalid: { "$regex": "pattern" }
- Logical operators must contain field conditions, not direct operators
  Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  Invalid: { "$and": [{ "$gt": 100 }] }
- $not operator:
  - Must be an object
  - Cannot be empty
  - Can be used at field level or top level
  - Valid: { "$not": { "field": "value" } }
  - Valid: { "field": { "$not": { "$eq": "value" } } }
- Other logical operators ($and, $or, $nor):
  - Can only be used at top level or nested within other logical operators
  - Can not be used on a field level, or be nested inside a field
  - Can not be used inside an operator
  - Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  - Valid: { "$or": [{ "$and": [{ "field": { "$gt": 100 } }] }] }
  - Invalid: { "field": { "$and": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$or": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$gt": { "$and": [{...}] } } }
- $elemMatch requires an object with conditions
  Valid: { "array": { "$elemMatch": { "field": "value" } } }
  Invalid: { "array": { "$elemMatch": "value" } }

Example Complex Query:
{
  "$and": [
    { "category": { "$in": ["electronics", "computers"] } },
    { "price": { "$gte": 100, "$lte": 1000 } },
    { "tags": { "$all": ["premium", "sale"] } },
    { "items": { "$elemMatch": { "price": { "$gt": 50 }, "inStock": true } } },
    { "$or": [
      { "name": { "$regex": "^iphone", "$options": "i" } },
      { "description": { "$regex": ".*apple.*" } }
    ]}
  ]
}`;
var PINECONE_PROMPT = `When querying Pinecone, you can ONLY use the operators listed below. Any other operators will be rejected.
Important: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.
If a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.

Basic Comparison Operators:
- $eq: Exact match (default when using field: value)
  Example: { "category": "electronics" }
- $ne: Not equal
  Example: { "category": { "$ne": "electronics" } }
- $gt: Greater than
  Example: { "price": { "$gt": 100 } }
- $gte: Greater than or equal
  Example: { "price": { "$gte": 100 } }
- $lt: Less than
  Example: { "price": { "$lt": 100 } }
- $lte: Less than or equal
  Example: { "price": { "$lte": 100 } }

Array Operators:
- $in: Match any value in array
  Example: { "category": { "$in": ["electronics", "books"] } }
- $nin: Does not match any value in array
  Example: { "category": { "$nin": ["electronics", "books"] } }
- $all: Match all values in array
  Example: { "tags": { "$all": ["premium", "sale"] } }

Logical Operators:
- $and: Logical AND (can be implicit or explicit)
  Implicit Example: { "price": { "$gt": 100 }, "category": "electronics" }
  Explicit Example: { "$and": [{ "price": { "$gt": 100 } }, { "category": "electronics" }] }
- $or: Logical OR
  Example: { "$or": [{ "price": { "$lt": 50 } }, { "category": "books" }] }

Element Operators:
- $exists: Check if field exists
  Example: { "rating": { "$exists": true } }

Restrictions:
- Regex patterns are not supported
- Only $and and $or logical operators are supported at the top level
- Empty arrays in $in/$nin will return no results
- A non-empty array is required for $all operator
- Nested fields are supported using dot notation
- Multiple conditions on the same field are supported with both implicit and explicit $and
- At least one key-value pair is required in filter object
- Empty objects and undefined values are treated as no filter
- Invalid types in comparison operators will throw errors
- All non-logical operators must be used within a field condition
  Valid: { "field": { "$gt": 100 } }
  Valid: { "$and": [...] }
  Invalid: { "$gt": 100 }
- Logical operators must contain field conditions, not direct operators
  Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  Invalid: { "$and": [{ "$gt": 100 }] }
- Logical operators ($and, $or):
  - Can only be used at top level or nested within other logical operators
  - Can not be used on a field level, or be nested inside a field
  - Can not be used inside an operator
  - Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  - Valid: { "$or": [{ "$and": [{ "field": { "$gt": 100 } }] }] }
  - Invalid: { "field": { "$and": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$or": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$gt": { "$and": [{...}] } } }
Example Complex Query:
{
  "$and": [
    { "category": { "$in": ["electronics", "computers"] } },
    { "price": { "$gte": 100, "$lte": 1000 } },
    { "tags": { "$all": ["premium", "sale"] } },
    { "rating": { "$exists": true, "$gt": 4 } },
    { "$or": [
      { "stock": { "$gt": 0 } },
      { "preorder": true }
    ]}
  ]
}`;
var QDRANT_PROMPT = `When querying Qdrant, you can ONLY use the operators listed below. Any other operators will be rejected.
Important: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.
If a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.

Basic Comparison Operators:
- $eq: Exact match (default when using field: value)
  Example: { "category": "electronics" }
- $ne: Not equal
  Example: { "category": { "$ne": "electronics" } }
- $gt: Greater than
  Example: { "price": { "$gt": 100 } }
- $gte: Greater than or equal
  Example: { "price": { "$gte": 100 } }
- $lt: Less than
  Example: { "price": { "$lt": 100 } }
- $lte: Less than or equal
  Example: { "price": { "$lte": 100 } }

Array Operators:
- $in: Match any value in array
  Example: { "category": { "$in": ["electronics", "books"] } }
- $nin: Does not match any value in array
  Example: { "category": { "$nin": ["electronics", "books"] } }

Logical Operators:
- $and: Logical AND (implicit when using multiple conditions)
  Example: { "$and": [{ "price": { "$gt": 100 } }, { "category": "electronics" }] }
- $or: Logical OR
  Example: { "$or": [{ "price": { "$lt": 50 } }, { "category": "books" }] }
- $not: Logical NOT
  Example: { "$not": { "category": "electronics" } }

Element Operators:
- $exists: Check if field exists
  Example: { "rating": { "$exists": true } }

Special Operators:
- $regex: Pattern matching
  Example: { "name": { "$regex": "iphone.*" } }
- $count: Array length/value count
  Example: { "tags": { "$count": { "$gt": 2 } } }
- $geo: Geographical filters (supports radius, box, polygon)
  Example: {
    "location": {
      "$geo": {
        "type": "radius",
        "center": { "lat": 52.5, "lon": 13.4 },
        "radius": 10000
      }
    }
  }
- $hasId: Match specific document IDs
  Example: { "$hasId": ["doc1", "doc2"] }
- $hasVector: Check vector existence
  Example: { "$hasVector": "" }
- $datetime: RFC 3339 datetime range
  Example: {
    "created_at": {
      "$datetime": {
        "range": {
          "gt": "2024-01-01T00:00:00Z",
          "lt": "2024-12-31T23:59:59Z"
        }
      }
    }
  }
- $null: Check for null values
  Example: { "field": { "$null": true } }
- $empty: Check for empty values
  Example: { "array": { "$empty": true } }
- $nested: Nested object filters
  Example: {
    "items[]": {
      "$nested": {
        "price": { "$gt": 100 },
        "stock": { "$gt": 0 }
      }
    }
  }

Restrictions:
- Only logical operators ($and, $or, $not) and collection operators ($hasId, $hasVector) can be used at the top level
- All other operators must be used within a field condition
  Valid: { "field": { "$gt": 100 } }
  Valid: { "$and": [...] }
  Valid: { "$hasId": [...] }
  Invalid: { "$gt": 100 }
- Nested fields are supported using dot notation
- Array fields with nested objects use [] suffix: "items[]"
- Geo filtering requires specific format for radius, box, or polygon
- Datetime values must be in RFC 3339 format
- Empty arrays in conditions are handled as empty values
- Null values are handled with $null operator
- Empty values are handled with $empty operator
- $regex uses standard regex syntax
- $count can only be used with numeric comparison operators
- $nested requires an object with conditions
- Logical operators must contain field conditions, not direct operators
  Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  Invalid: { "$and": [{ "$gt": 100 }] }
- $not operator:
  - Must be an object
  - Cannot be empty
  - Can be used at field level or top level
  - Valid: { "$not": { "field": "value" } }
  - Valid: { "field": { "$not": { "$eq": "value" } } }
- Other logical operators ($and, $or):
  - Can only be used at top level or nested within other logical operators
  - Can not be used on a field level, or be nested inside a field
  - Can not be used inside an operator
  - Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  - Valid: { "$or": [{ "$and": [{ "field": { "$gt": 100 } }] }] }
  - Invalid: { "field": { "$and": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$or": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$gt": { "$and": [{...}] } } }
Example Complex Query:
{
  "$and": [
    { "category": { "$in": ["electronics"] } },
    { "price": { "$gt": 100 } },
    { "location": {
      "$geo": {
        "type": "radius",
        "center": { "lat": 52.5, "lon": 13.4 },
        "radius": 5000
      }
    }},
    { "items[]": {
      "$nested": {
        "price": { "$gt": 50 },
        "stock": { "$gt": 0 }
      }
    }},
    { "created_at": {
      "$datetime": {
        "range": {
          "gt": "2024-01-01T00:00:00Z"
        }
      }
    }},
    { "$or": [
      { "status": { "$ne": "discontinued" } },
      { "clearance": true }
    ]}
  ]
}`;
var UPSTASH_PROMPT = `When querying Upstash Vector, you can ONLY use the operators listed below. Any other operators will be rejected.
Important: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.
If a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.

Basic Comparison Operators:
- $eq: Exact match (default when using field: value)
  Example: { "category": "electronics" } or { "category": { "$eq": "electronics" } }
- $ne: Not equal
  Example: { "category": { "$ne": "electronics" } }
- $gt: Greater than
  Example: { "price": { "$gt": 100 } }
- $gte: Greater than or equal
  Example: { "price": { "$gte": 100 } }
- $lt: Less than
  Example: { "price": { "$lt": 100 } }
- $lte: Less than or equal
  Example: { "price": { "$lte": 100 } }

Array Operators:
- $in: Match any value in array
  Example: { "category": { "$in": ["electronics", "books"] } }
- $nin: Does not match any value in array
  Example: { "category": { "$nin": ["electronics", "books"] } }
- $all: Matches all values in array
  Example: { "tags": { "$all": ["premium", "new"] } }

Logical Operators:
- $and: Logical AND (implicit when using multiple conditions)
  Example: { "$and": [{ "price": { "$gt": 100 } }, { "category": "electronics" }] }
- $or: Logical OR
  Example: { "$or": [{ "price": { "$lt": 50 } }, { "category": "books" }] }
- $not: Logical NOT
  Example: { "$not": { "category": "electronics" } }
- $nor: Logical NOR
  Example: { "$nor": [{ "price": { "$lt": 50 } }, { "category": "books" }] }

Element Operators:
- $exists: Check if field exists
  Example: { "rating": { "$exists": true } }

Special Operators:
- $regex: Pattern matching using glob syntax (only as operator, not direct RegExp)
  Example: { "name": { "$regex": "iphone*" } }
- $contains: Check if array/string contains value
  Example: { "tags": { "$contains": "premium" } }

Restrictions:
- Null/undefined values are not supported in any operator
- Empty arrays are only supported in $in/$nin operators
- Direct RegExp patterns are not supported, use $regex with glob syntax
- Nested fields are supported using dot notation
- Multiple conditions on same field are combined with AND
- String values with quotes are automatically escaped
- Only logical operators ($and, $or, $not, $nor) can be used at the top level
- All other operators must be used within a field condition
  Valid: { "field": { "$gt": 100 } }
  Valid: { "$and": [...] }
  Invalid: { "$gt": 100 }
- $regex uses glob syntax (*, ?) not standard regex patterns
- $contains works on both arrays and string fields
- Logical operators must contain field conditions, not direct operators
  Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  Invalid: { "$and": [{ "$gt": 100 }] }
- $not operator:
  - Must be an object
  - Cannot be empty
  - Can be used at field level or top level
  - Valid: { "$not": { "field": "value" } }
  - Valid: { "field": { "$not": { "$eq": "value" } } }
- Other logical operators ($and, $or, $nor):
  - Can only be used at top level or nested within other logical operators
  - Can not be used on a field level, or be nested inside a field
  - Can not be used inside an operator
  - Valid: { "$and": [{ "field": { "$gt": 100 } }] }
  - Valid: { "$or": [{ "$and": [{ "field": { "$gt": 100 } }] }] }
  - Invalid: { "field": { "$and": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$or": [{ "$gt": 100 }] } }
  - Invalid: { "field": { "$gt": { "$and": [{...}] } } }
Example Complex Query:
{
  "$and": [
    { "category": { "$in": ["electronics", "computers"] } },
    { "price": { "$gt": 100, "$lt": 1000 } },
    { "tags": { "$all": ["premium", "new"] } },
    { "name": { "$regex": "iphone*" } },
    { "description": { "$contains": "latest" } },
    { "$or": [
      { "brand": "Apple" },
      { "rating": { "$gte": 4.5 } }
    ]}
  ]
}`;
var VECTORIZE_PROMPT = `When querying Vectorize, you can ONLY use the operators listed below. Any other operators will be rejected.
Important: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.
If a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.

Basic Comparison Operators:
- $eq: Exact match (default when using field: value)
  Example: { "category": "electronics" }
- $ne: Not equal
  Example: { "category": { "$ne": "electronics" } }
- $gt: Greater than
  Example: { "price": { "$gt": 100 } }
- $gte: Greater than or equal
  Example: { "price": { "$gte": 100 } }
- $lt: Less than
  Example: { "price": { "$lt": 100 } }
- $lte: Less than or equal
  Example: { "price": { "$lte": 100 } }

Array Operators:
- $in: Match any value in array
  Example: { "category": { "$in": ["electronics", "books"] } }
- $nin: Does not match any value in array
  Example: { "category": { "$nin": ["electronics", "books"] } }

Restrictions:
- Regex patterns are not supported
- Logical operators are not supported
- Element operators are not supported
- Fields must have a flat structure, as nested fields are not supported
- Multiple conditions on the same field are supported
- Empty arrays in $in/$nin will return no results
- Filter keys cannot be longer than 512 characters
- Filter keys cannot contain invalid characters ($, ", empty)
- Filter size is limited to prevent oversized queries
- Invalid types in operators return no results instead of throwing errors
- Empty objects are accepted in filters
- Metadata must use flat structure with dot notation (no nested objects)
- Must explicitly create metadata indexes for filterable fields (limit 10 per index)
- Can only effectively filter on indexed metadata fields
- Metadata values can be strings, numbers, booleans, or homogeneous arrays
- No operators can be used at the top level (no logical operators supported)
- All operators must be used within a field condition
  Valid: { "field": { "$gt": 100 } }
  Invalid: { "$gt": 100 }
  Invalid: { "$in": [...] }

Example Complex Query:
{
  "category": { "$in": ["electronics", "computers"] },
  "price": { "$gte": 100, "$lte": 1000 },
  "inStock": true
}`;

exports.ASTRA_PROMPT = ASTRA_PROMPT;
exports.CHROMA_PROMPT = CHROMA_PROMPT;
exports.GraphRAG = GraphRAG;
exports.LIBSQL_PROMPT = LIBSQL_PROMPT;
exports.MDocument = MDocument;
exports.PGVECTOR_PROMPT = PGVECTOR_PROMPT;
exports.PINECONE_PROMPT = PINECONE_PROMPT;
exports.QDRANT_PROMPT = QDRANT_PROMPT;
exports.UPSTASH_PROMPT = UPSTASH_PROMPT;
exports.VECTORIZE_PROMPT = VECTORIZE_PROMPT;
exports.createDocumentChunkerTool = createDocumentChunkerTool;
exports.createGraphRAGTool = createGraphRAGTool;
exports.createVectorQueryTool = createVectorQueryTool;
exports.defaultGraphRagDescription = defaultGraphRagDescription;
exports.defaultVectorQueryDescription = defaultVectorQueryDescription;
exports.filterDescription = filterDescription;
exports.queryTextDescription = queryTextDescription;
exports.rerank = rerank;
exports.topKDescription = topKDescription;
