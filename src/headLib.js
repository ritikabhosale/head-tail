const { splitLines, joinLines } = require('./stringUtils.js');

const head = function (content, countOfLines) {
  const lines = splitLines(content);
  return joinLines(lines.slice(0, countOfLines));
};

exports.head = head;
