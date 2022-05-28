const assert = require('assert');
const { printContent, getFormatter } = require('../src/headLib.js');

const logger = function (expectedContent) {
  const stream = {};

  const mockConsoleLog = function (content) {
    assert.equal(content, expectedContent);
    this.actualContent = content;
  };

  const mockConsoleError = function (error) {
    assert.equal(error, expectedContent);
    this.actualContent = error;
  };

  stream.mockConsoleError = mockConsoleError.bind(stream);
  stream.mockConsoleLog = mockConsoleLog.bind(stream);
  return stream;
};

describe('printContent', () => {
  it('should print given content without header for a file', () => {
    const formatter = getFormatter(['fileName']);
    const stream = logger('hello');

    const headOfFile = { fileName: 'fileName', headContent: 'hello' };
    printContent(formatter, { stdout: stream.mockConsoleLog, stderr: stream.mockConsoleError }, headOfFile);

    assert.deepEqual(stream.actualContent, 'hello');
  });

  it('should print given files content with header for files', () => {
    const formatter = getFormatter(['fileName1', 'fileName2']);
    const stream = logger('==> fileName2 <==\nhii');

    const headOfFile = { fileName: 'fileName2', headContent: 'hii' };
    printContent(formatter, { stdout: stream.mockConsoleLog, stderr: stream.mockConsoleError }, headOfFile);

    assert.deepEqual(stream.actualContent, '==> fileName2 <==\nhii');
  });

  it('should print error for non-existing file', () => {
    const formatter = getFormatter(['fileName1']);
    const stream = logger('head: fileName: No such file or directory');

    const headOfFile = { fileName: 'fileName', error: { message: 'head: fileName: No such file or directory' } };
    printContent(formatter, { stdout: stream.mockConsoleLog, stderr: stream.mockConsoleError }, headOfFile);

    assert.deepEqual(stream.actualContent, 'head: fileName: No such file or directory');
  });
});
