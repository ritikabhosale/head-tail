const { parseArgs } = require('./parseArgs');
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

const tailMain = function (readFile, args) {
  const { option, count, files } = parseArgs(args);
  let content = '';
  try {
    content = readFile(files[0], 'utf8');
  } catch (error) {
    throw { message: `tail: ${files[0]}: No such file or directory` };
  }
  return tail(content, { option, count });
};

exports.extractLastLines = extractLastLines;
exports.extractLastBytes = extractLastBytes;
exports.tailMain = tailMain;
exports.tail = tail;
