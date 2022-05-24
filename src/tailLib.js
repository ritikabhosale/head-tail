const { splitLines, joinLines } = require('./stringUtils');

const startFrom = (char, count) => char.length - count;

const extractLastBytes = (text, count) => text.slice(startFrom(text, count));
const extractLastLines = (lines, count) => lines.slice(startFrom(lines, count));

const tail = function (content, { option, count }) {
  if (option === 'byte') {
    return extractLastBytes(content, count);
  }
  const lines = splitLines(content);
  return joinLines(extractLastBytes(lines, count));
};

exports.extractLastLines = extractLastLines;
exports.extractLastBytes = extractLastBytes;
exports.tail = tail;
