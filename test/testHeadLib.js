const assert = require('assert');
const { head, extractLines, extractBytes, readFileContent } = require('../src/headLib.js');

describe('head', () => {
  it('should return one line of content', () => {
    assert.deepStrictEqual(head('hello', { option: 'line', count: 1 }), 'hello');
    assert.deepStrictEqual(head('hii', { option: 'line', count: 1 }), 'hii');
    assert.deepStrictEqual(head('hii\nhello', { option: 'line', count: 1 }), 'hii');
  });

  it('should return two lines', () => {
    assert.deepStrictEqual(head('hii\nhello\nbye', { option: 'line', count: 2 }), 'hii\nhello');
  });

  it('should return given number of lines', () => {
    assert.deepStrictEqual(head('hii\nhello\nbye\nmat', { option: 'line', count: 3 }), 'hii\nhello\nbye');
  });

  it('should return a byte', () => {
    assert.deepStrictEqual(head('h', { option: 'byte', count: 1 }), 'h');
    assert.deepStrictEqual(head('hii', { option: 'byte', count: 1 }), 'h');
  });

  it('should return given number of bytes', () => {
    assert.deepStrictEqual(head('hello', { option: 'byte', count: 4 }), 'hell');
  });

  it('should return given number of bytes with \n', () => {
    assert.deepStrictEqual(head('hii\nhello', { option: 'byte', count: 6 }), 'hii\nhe');
  });
});

describe('extractLines', () => {
  it('should return one line', () => {
    assert.deepStrictEqual(extractLines(['hello'], 1), ['hello']);
    assert.deepStrictEqual(extractLines(['hello', 'hii'], 1), ['hello']);
  });

  it('should return two lines', () => {
    assert.deepStrictEqual(extractLines(['hello', 'hii'], 2), ['hello', 'hii']);
    const expected = ['hello', 'hii'];
    assert.deepStrictEqual(extractLines(['hello', 'hii', 'bye'], 2), expected);
  });

  it('should return given number of lines', () => {
    const input = ['hello', 'hii', 'bye', 'see you'];
    const expected = ['hello', 'hii', 'bye'];
    assert.deepStrictEqual(extractLines(input, 3), expected);
  });
});

describe('extractBytes', () => {
  it('should return only 1 byte', () => {
    assert.deepStrictEqual(extractBytes('h', 1), 'h');
    assert.deepStrictEqual(extractBytes('hi', 1), 'h');
  });

  it('should return specified number of bytes', () => {
    assert.deepStrictEqual(extractBytes('hello', 3), 'hel');
  });

  it('should count \n as a byte', () => {
    assert.deepStrictEqual(extractBytes('hi\n', 3), 'hi\n');
    assert.deepStrictEqual(extractBytes('hi\nhello', 4), 'hi\nh');
  });
});

const shouldReturn = function (mockFile, content) {
  return function (fileName, encoding) {
    try {
      assert.equal(fileName, mockFile);
    } catch (error) {
      throw { code: 'ENOENT' };
    }
    assert.equal(encoding, 'utf8');
    return content;
  };
};

describe('readFileContent', () => {
  it('should return a line of a file', () => {
    const mockReadFileSync = shouldReturn('abc', 'hello');
    const expected = { fileName: 'abc', content: 'hello' };
    assert.deepStrictEqual(readFileContent(mockReadFileSync, 'abc'), expected);
  });

  it('should return 2 bytes of a file', () => {
    const mockReadFileSync = shouldReturn('file', 'hello');
    const expected = { fileName: 'file', content: 'hello' };
    assert.deepStrictEqual(readFileContent(mockReadFileSync, 'file'), expected);
  });

  it('should return object, file does not exist', () => {
    const mockReadFileSync = shouldReturn('b.txt', 'hello');
    const expected = {
      fileName: 'abc',
      error: { message: 'head: abc: No such file or directory' }
    };
    assert.deepStrictEqual(readFileContent(mockReadFileSync, 'abc'), expected);
  });
});
