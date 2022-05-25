const { parseArgs } = require('./tailParser');
const { splitLines, joinLines } = require('./stringUtils');
const { validateFilesExist } = require('./tailParser.js');

const startFrom = (char, count) => char.length - count;

const extractLastBytes = (text, count) => text.slice(startFrom(text, count));
const extractLastLines = (lines, count) => lines.slice(startFrom(lines, count));

const formatFileName = fileName => `==> ${fileName} <==`;

const identity = (fileName, content, seperator) => content;

const fileNameAndContent = (fileName, content, seperator) => {
  const formattedFileName = formatFileName(fileName);
  return `${seperator}${formattedFileName} \n${content}`;
};

const getFormatter = files =>
  files.length === 1 ? identity : fileNameAndContent;

const getCustomError = (error, fileName) => {
  const customErrors = {
    ENOENT: `tail: ${fileName}: No such file or directory`,
    EACCES: `tail: ${fileName}: Permission denied`
  };
  return customErrors[error];
};

const tail = function (content, { option, count }) {
  if (option === '-c') {
    return extractLastBytes(content, count);
  }
  const lines = splitLines(content);
  return joinLines(extractLastBytes(lines, count));
};

const readTailContent = function (readFile, { file, option, count }) {
  let tailContent = '';
  const customErr = { value: false, message: '' };
  try {
    const content = readFile(file, 'utf8');
    tailContent = tail(content, { option, count });
  } catch (error) {
    customErr.value = true;
    customErr.message = getCustomError(error.code, file);
  }
  return { fileName: file, content: tailContent, error: customErr };
};

const tailMain = function (readFile, args) {
  const { options, restArgs: files } = parseArgs(args);
  const { option, count } = options[0];
  return files.map(file => readTailContent(readFile, { file, option, count }));
};

const printContent = function (readFile, consoleOutput, consoleError, args) {
  const files = tailMain(readFile, args);
  let seperator = '';
  validateFilesExist(files);
  const formatter = getFormatter(files);
  return files.forEach((file) => {
    const { fileName, content, error } = file;
    if (error.value) {
      consoleError(error.message);
    }
    else {
      consoleOutput(formatter(fileName, content, seperator));
      seperator = '\n';
    }
  });
};

exports.extractLastLines = extractLastLines;
exports.extractLastBytes = extractLastBytes;
exports.tailMain = tailMain;
exports.tail = tail;
exports.printContent = printContent;
