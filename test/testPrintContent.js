const assert = require('assert');
const { printContent } = require('../src/head/headLib.js');

const shouldReturn = function (expectedInputs) {
  let index = 0;
  const { fileName: mockedFileName, content } = expectedInputs[index];
  return function (fileName, encoding) {
    try {
      assert.equal(fileName, mockedFileName);
    } catch (error) {
      throw { code: 'ENOENT' };
    }
    assert.equal(encoding, 'utf8');
    index++;
    return content;
  };
};

const mockConsoleLog = function (contents, actualContents) {
  let index = 0;
  return function (content) {
    assert.equal(content, contents[index]);
    actualContents.push(content);
    index++;
  };
};

const mockConsoleError = function (errors, actualErrors) {
  let index = 0;
  return function (error) {
    assert.equal(error, errors[index]);
    actualErrors.push(error);
    index++;
  };
};

describe('printContent', () => {
  it('should print 1 lines for a existing file', () => {
    const actualLogs = [];
    const actualErrors = [];
    const mockedReadFileSync = shouldReturn([{ fileName: 'a.txt', content: 'hello' }]);
    const mockedConsoleLog = mockConsoleLog(['hello'], actualLogs);
    const mockedConsoleError = mockConsoleError([], actualErrors);
    printContent(mockedReadFileSync, mockedConsoleLog, mockedConsoleError, ['-n1', 'a.txt']);
    assert.deepStrictEqual(actualLogs, ['hello']);
    assert.deepStrictEqual(actualErrors, []);
  });

  it('should print two chars for a existing file', () => {
    const actualLogs = [];
    const actualErrors = [];
    const mockedReadFileSync = shouldReturn([{ fileName: 'a.txt', content: 'hello' }]);
    const mockedConsoleLog = mockConsoleLog(['he'], actualLogs);
    const mockedConsoleError = mockConsoleError([], actualErrors);
    printContent(mockedReadFileSync, mockedConsoleLog, mockedConsoleError, ['-c2', 'a.txt']);
    assert.deepStrictEqual(actualLogs, ['he']);
    assert.deepStrictEqual(actualErrors, []);
  });

  it('should print error for a non-existing file', () => {
    const actualLogs = [];
    const actualErrors = [];
    const mockedReadFileSync = shouldReturn([{ fileName: 'a.txt', content: 'hello' }]);
    const mockedConsoleLog = mockConsoleLog([], actualLogs);
    const mockedConsoleError = mockConsoleError(['head: b.txt: No such file or directory'], actualErrors);
    printContent(mockedReadFileSync, mockedConsoleLog, mockedConsoleError, ['-n1', 'b.txt']);
    assert.deepStrictEqual(actualLogs, []);
    assert.deepStrictEqual(actualErrors, ['head: b.txt: No such file or directory']);
  });

  it('should log error and output for a existing and a non-existing file', () => {
    const actualLogs = [];
    const actualErrors = [];
    const mockedReadFileSync = shouldReturn([{ fileName: 'a.txt', content: 'hello' }, { fileName: 'b.txt', content: 'heyy' }]);
    const mockedConsoleLog = mockConsoleLog(['\n==> a.txt <== \nhello'], actualLogs);
    const mockedConsoleError = mockConsoleError(['head: c.txt: No such file or directory'], actualErrors);
    printContent(mockedReadFileSync, mockedConsoleLog, mockedConsoleError, ['-n1', 'a.txt', 'c.txt']);
    assert.deepStrictEqual(actualLogs, ['\n==> a.txt <== \nhello']);
    assert.deepStrictEqual(actualErrors, ['head: c.txt: No such file or directory']);
  });
});
