const { splitLines, joinLines } = require('./stringUtils.js');

const extractLines = (lines, countOfLines) => lines.slice(0, countOfLines);

const head = function (content, countOfLines) {
  const lines = splitLines(content);
  return joinLines(extractLines(lines, countOfLines));
};

exports.head = head;
exports.extractLines = extractLines;
