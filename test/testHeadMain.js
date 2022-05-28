const assert = require('assert');
const { headMain } = require('../src/headLib.js');

const shouldReturn = function (fileNameAndContent) {
  let index = 0;
  return function (fileName, encoding) {
    try {
      assert.equal(fileName, fileNameAndContent[index].fileName);
    } catch (error) {
      throw { code: 'ENOENT' };
    }
    assert.equal(encoding, 'utf8');
    return fileNameAndContent[index++].content;
  };
};

const logger = function (expectedContent) {
  const stream = { index: 0, actualContent: [] };

  const mockConsoleLog = function (content) {
    assert.equal(content, expectedContent[this.index++]);
    this.actualContent.push(content);
  };

  const mockConsoleError = function (error) {
    assert.equal(error, expectedContent[this.index++]);
    this.actualContent.push(error);
  };

  stream.mockConsoleError = mockConsoleError.bind(stream);
  stream.mockConsoleLog = mockConsoleLog.bind(stream);
  return stream;
};

describe('headMain', () => {
  it('it should execute successfully and return 0', () => {
    const mockedReadFileSync = shouldReturn([
      { fileName: 'a.txt', content: 'hello' }
    ]);
    const expectedContent = ['hello'];
    const stream = logger(expectedContent);

    assert.deepStrictEqual(headMain(mockedReadFileSync, { stdout: stream.mockConsoleLog, stderr: stream.mockConsoleLog }, ['-n1', 'a.txt']), 0);

    assert.deepStrictEqual(stream.actualContent, expectedContent);
  });

  it('it should print default options and return 0', () => {
    const mockedReadFileSync = shouldReturn([
      { fileName: 'a.txt', content: '1\n2\n3\n4\n5\n6\n7\n8\n9\n910\n11' }
    ]);
    const expectedContent = ['1\n2\n3\n4\n5\n6\n7\n8\n9\n910'];
    const stream = logger(expectedContent);

    assert.deepStrictEqual(headMain(mockedReadFileSync, { stdout: stream.mockConsoleLog, stderr: stream.mockConsoleLog }, ['a.txt']), 0);

    assert.deepStrictEqual(stream.actualContent, expectedContent);
  });

  it('it should execute successfully for two files and return 0', () => {
    const mockedReadFileSync = shouldReturn([
      { fileName: 'a.txt', content: 'hii\nhello' },
      { fileName: 'b.txt', content: 'hello\nhii\nbye' }
    ]);
    const expectedContent = ['==> a.txt <==\nhii\nhello',
      '\n==> b.txt <==\nhello\nhii'];
    const stream = logger(expectedContent);

    assert.deepStrictEqual(headMain(mockedReadFileSync, { stdout: stream.mockConsoleLog, stderr: stream.mockConsoleLog }, ['-n2', 'a.txt', 'b.txt']), 0);

    assert.deepStrictEqual(stream.actualContent, expectedContent);
  });

  it('it should fail since the file doesn\'t exist', () => {
    const mockedReadFileSync = shouldReturn([
      { fileName: 'a.txt', content: 'hello' }
    ]);
    const expectedContent = ['head: b.txt: No such file or directory'];
    const stream = logger(expectedContent);

    assert.deepStrictEqual(headMain(mockedReadFileSync, { stdout: stream.mockConsoleLog, stderr: stream.mockConsoleLog }, ['-n1', 'b.txt']), 1);

    assert.deepStrictEqual(stream.actualContent, expectedContent);
  });

  it('it should fail for a present and a absent file', () => {
    const mockedReadFileSync = shouldReturn([
      { fileName: 'a.txt', content: 'hello' },
      { fileName: 'b.txt', content: 'hii' }
    ]);
    const expectedContent = ['==> a.txt <==\nhello',
      'head: c.txt: No such file or directory'];
    const stream = logger(expectedContent);

    assert.deepStrictEqual(headMain(mockedReadFileSync, { stdout: stream.mockConsoleLog, stderr: stream.mockConsoleLog }, ['-n1', 'a.txt', 'c.txt']), 1);

    assert.deepStrictEqual(stream.actualContent, expectedContent);
  });
});
