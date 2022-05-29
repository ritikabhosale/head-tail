const { parseArgs } = require('./headParseArgs.js');
const { splitLines, joinLines } = require('./stringUtils');

const extractLines = (lines, countOfLines) => lines.slice(0, countOfLines);
const extractBytes = (content, countOfbytes) => content.slice(0, countOfbytes);
const formatFileName = fileName => `==> ${fileName} <==`;
const identity = (fileName, content) => content;
const getFormatter = files => files.length === 1 ? identity : formatContent();

const capitalizeFirstLetter = (str) =>
  str[0].toUpperCase() + str.slice(1);

const extractErrorMessage = (message) => {
  const startFrom = message.indexOf(':') + 2;
  const endTo = message.indexOf(',');
  return capitalizeFirstLetter(message.slice(startFrom, endTo));
};

const createFsError = ({ message, code }, fileName) => {
  const userMsg = `head: ${fileName}: ${extractErrorMessage(message)}`;
  return { code, message: userMsg, fileName };
};

const formatContent = () => {
  let seperator = '';
  return function (fileName, content) {
    const formattedFileName = formatFileName(fileName);
    const formattedOutput = `${seperator}${formattedFileName}\n${content}`;
    seperator = '\n';
    return formattedOutput;
  };
};

const head = (content, { option, count }) => {
  if (option === 'byte') {
    return extractBytes(content, count);
  }
  const lines = splitLines(content);
  return joinLines(extractLines(lines, count));
};

const readFileContent = (readFile, fileName) => {
  try {
    const content = readFile(fileName, 'utf8');
    return { fileName, content };
  } catch (err) {
    const error = createFsError(err, fileName);
    return { fileName, error };
  }
};

const headFile = (readFile, { file, option, count }) => {
  const { fileName, content, error } = readFileContent(readFile, file);
  if (error) {
    return { fileName, error };
  }
  const headContent = head(content, { option, count });
  return { fileName, headContent };
};

const headFiles = (readFile, { option, count, files }) => {
  return files.map(file =>
    headFile(readFile, { file, option, count }));
};

const getExitCode = (files) => files.some(file => file.error) ? 1 : 0;

const headMain = (readFile, stream, args) => {
  const { option, count, files } = parseArgs(args);
  const formatter = getFormatter(files);
  const headOfFiles = headFiles(readFile, { option, count, files });

  headOfFiles.forEach(headOfFile =>
    printContent(formatter, stream, headOfFile));
  return getExitCode(headOfFiles);
};

const printContent = (formatter, { stdout, stderr }, headOfFile) => {
  const { fileName, headContent, error } = headOfFile;
  if (error) {
    stdout(error.message);
    return;
  }
  stderr(formatter(fileName, headContent));
};

exports.head = head;
exports.headMain = headMain;
exports.extractBytes = extractBytes;
exports.extractLines = extractLines;
exports.printContent = printContent;
exports.getFormatter = getFormatter;
exports.readFileContent = readFileContent;
