const { parseArgs } = require('./parseArgs.js');
const { splitLines, joinLines } = require('./stringUtils.js');

const extractLines = (lines, countOfLines) => lines.slice(0, countOfLines);

const extractBytes = (content, countOfbytes) => content.slice(0, countOfbytes);

const head = function (content, { option, count }) {
  if (option === 'byteCount') {
    return extractBytes(content, count);
  }
  const lines = splitLines(content);
  return joinLines(extractLines(lines, count));
};

const headMain = function (readFile, ...args) {
  let parsedArgs = {};
  try {
    parsedArgs = parseArgs(args);
  } catch (error) {
    throw error
  }
  const { option, count, files } = parsedArgs;
  let content = '';
  try {
    content = readFile(files[0], 'utf8');
  } catch (error) {
    throw { name: 'usage: head [-n lines | -c bytes] [file ...]' };
  }
  return head(content, { option, count });
};

exports.head = head;
exports.extractBytes = extractBytes;
exports.extractLines = extractLines;
exports.headMain = headMain;
