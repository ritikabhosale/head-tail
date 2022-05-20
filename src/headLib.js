const { splitLines, joinLines } = require('./stringUtils.js');

const extractLines = (lines, countOfLines) => lines.slice(0, countOfLines);
const extractBytes = (content, countOfbytes) => content.slice(0, countOfbytes);

const head = function (content, options) {
  if (options.byteCount) {
    return extractBytes(content, options.byteCount);
  }
  const lines = splitLines(content);
  return joinLines(extractLines(lines, options.lineCount));
};

const headMain = function (readFile, fileName) {
  const content = readFile(fileName, 'utf8');
  return head(content, { lineCount: 1 });
};

exports.head = head;
exports.extractBytes = extractBytes;
exports.extractLines = extractLines;
exports.headMain = headMain;