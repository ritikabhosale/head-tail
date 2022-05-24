const { parseArgs } = require('./parseArgs.js');
const { splitLines, joinLines } = require('./stringUtils');
const { validateFilesExist } = require('./validationLib.js');

const extractLines = (lines, countOfLines) => lines.slice(0, countOfLines);

const extractBytes = (content, countOfbytes) => content.slice(0, countOfbytes);

const formatFileName = fileName => `==> ${fileName} <==`;

const identity = (fileName, content) => content;

const fileNameAndContent = (fileName, content) => {
  const formattedFileName = formatFileName(fileName);
  return `\n${formattedFileName} \n${content}`;
};

const getFormatter = files =>
  files.length === 1 ? identity : fileNameAndContent;

const getCustomError = (error, fileName) => {
  const customErrors = {
    ENOENT: `head: ${fileName}: No such file or directory`,
    EACCES: `head: ${fileName}: Permission denied`
  };
  return customErrors[error];
};

const head = function (content, { option, count }) {
  if (option === 'byte') {
    return extractBytes(content, count);
  }
  const lines = splitLines(content);
  return joinLines(extractLines(lines, count));
};

const headMain = function (readFile, args) {
  const { option, count, files } = parseArgs(args);
  return files.map((file) => {
    let headContent = '';
    const customErr = { value: false, message: '' };
    try {
      const content = readFile(file, 'utf8');
      headContent = head(content, { option, count });
    } catch (error) {
      customErr.value = true;
      customErr.message = getCustomError(error.code, file);
    }
    return { fileName: file, content: headContent, error: customErr };
  });
};

const printContent = function (readFile, consoleOutput, consoleError, args) {
  const files = headMain(readFile, args);
  validateFilesExist(files);
  const formatter = getFormatter(files);
  return files.forEach((file) => {
    const { fileName, content, error } = file;
    if (error.value) {
      consoleError(error.message);
    }
    else {
      consoleOutput(formatter(fileName, content));
    }
  });
};

exports.head = head;
exports.extractBytes = extractBytes;
exports.extractLines = extractLines;
exports.headMain = headMain;
exports.printContent = printContent;
