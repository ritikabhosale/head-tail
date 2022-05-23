const fs = require('fs');
const { parseArgs } = require('./parseArgs.js');
const { splitLines, joinLines } = require('./stringUtils.js');

const extractLines = (lines, countOfLines) => lines.slice(0, countOfLines);

const extractBytes = (content, countOfbytes) => content.slice(0, countOfbytes);

const validateFilesExist = files => {
  if (files.length === 0) {
    throw { message: 'usage: head [-n lines | -c bytes] [file ...]' };
  }
};

const getCustomError = (error, fileName) => {
  const customErrors = {
    ENOENT: `head: ${fileName}: No such file or directory`,
    EACCES: `head: ${fileName}: Permission denied`
  };
  return customErrors[error];
};

const formatFileName = fileName => `==> ${fileName} <==`;

const identity = (fileName, content) => content;

const getFormatter = files => {
  if (files.length === 1) {
    return identity;
  }
  return fileNameAndContent;
};

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
      customErr.message = getCustomError(error.code, file);
    }
    return { fileName: file, content: headContent, error: customErr };
  });
};

const printContent = function (readFile, ...args) {
  const files = headMain(readFile, args);
  validateFilesExist(files);
  const formatter = getFormatter(files);
  return files.map((file) => {
    const { fileName, content, error } = file;
    if (error.value) {
      console.error(error.message);
    }
    else {
      console.log(formatter(fileName, content));
    }
  });
};

exports.head = head;
exports.extractBytes = extractBytes;
exports.extractLines = extractLines;
exports.headMain = headMain;
exports.printContent = printContent;
