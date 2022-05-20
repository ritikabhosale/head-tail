const { splitLines, joinLines } = require('./stringUtils.js');

const extractLines = (lines, countOfLines) => lines.slice(0, countOfLines);

const head = function (content, options) {
  const lines = splitLines(content);
  return joinLines(extractLines(lines, options.lineCount));
};

exports.head = head;
exports.extractLines = extractLines;
