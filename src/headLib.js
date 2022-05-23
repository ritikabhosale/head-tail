const { parseArgs } = require('./parseArgs.js');
const { splitLines, joinLines } = require('./stringUtils.js');

const extractLines = (lines, countOfLines) => lines.slice(0, countOfLines);

const extractBytes = (content, countOfbytes) => content.slice(0, countOfbytes);

const formatFileName = fileName => `==> ${fileName} <==`;

const fileNameAndContent = (fileName, content) => {
  const formattedFileName = formatFileName(fileName);
  return `\n${formattedFileName} \n${content}`;
};

const head = function (content, { option, count }) {
  if (option === 'byteCount') {
    return extractBytes(content, count);
  }
  const lines = splitLines(content);
  return joinLines(extractLines(lines, count));
};

const headMain = function (readFile, args) {
  const { option, count, files } = parseArgs(args);
  return files.map((file) => {
    let headContent = '';
    const customErr = {
      value: false,
      message: ''
    };
    try {
      const content = readFile(file, 'utf8');
      headContent = head(content, { option, count });
    } catch (error) {
      customErr.value = true;
      customErr.message = error.message;
    }
    return { fileName: file, content: headContent, error: customErr };
  });
};

const printContent = function (readFile, ...args) {
  const files = headMain(readFile, args);
  return files.map((file) => {
    const { fileName, content, error } = file;
    if (error.value) {
      console.error(error.message);
    }
    else {
      console.log(fileNameAndContent(fileName, content));
    }
  });
};

exports.head = head;
exports.extractBytes = extractBytes;
exports.extractLines = extractLines;
exports.headMain = headMain;
exports.printContent = printContent;
