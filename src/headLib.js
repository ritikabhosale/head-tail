const { parseArgs } = require('./parseArgs.js');
const { splitLines, joinLines } = require('./stringUtils.js');

const extractLines = (lines, countOfLines) => lines.slice(0, countOfLines);

const extractBytes = (content, countOfbytes) => content.slice(0, countOfbytes);

const head = function (content, { byteCount, lineCount }) {
  if (byteCount) {
    return extractBytes(content, byteCount);
  }
  const lines = splitLines(content);
  return joinLines(extractLines(lines, lineCount));
};

const headMain = function (readFile, ...args) {
  const { fileName, options } = parseArgs(args);
  const content = readFile(fileName, 'utf8');
  return head(content, options);
};

exports.head = head;
exports.extractBytes = extractBytes;
exports.extractLines = extractLines;
exports.headMain = headMain;
