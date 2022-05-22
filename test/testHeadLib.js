const assert = require('assert');
const { head, extractLines, extractBytes, headMain } = require('../src/headLib.js');

describe('head', () => {
  it('should return one line of content', () => {
    assert.deepStrictEqual(head('hello', { option: 'lineCount', count: 1 }), 'hello');
    assert.deepStrictEqual(head('hii', { option: 'lineCount', count: 1 }), 'hii');
    assert.deepStrictEqual(head('hii\nhello', { option: 'lineCount', count: 1 }), 'hii');
  });

  it('should return two lines', () => {
    assert.deepStrictEqual(head('hii\nhello\nbye', { option: 'lineCount', count: 2 }), 'hii\nhello');
  });

  it('should return given number of lines', () => {
    assert.deepStrictEqual(head('hii\nhello\nbye\nmat', { option: 'lineCount', count: 3 }), 'hii\nhello\nbye');
  });

  it('should return a byte', () => {
    assert.deepStrictEqual(head('h', { option: 'byteCount', count: 1 }), 'h');
    assert.deepStrictEqual(head('hii', { option: 'byteCount', count: 1 }), 'h');
  });

  it('should return given number of bytes', () => {
    assert.deepStrictEqual(head('hello', { option: 'byteCount', count: 4 }), 'hell');
  });

  it('should return given number of bytes with \n', () => {
    assert.deepStrictEqual(head('hii\nhello', { option: 'byteCount', count: 6 }), 'hii\nhe');
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
    assert.equal(fileName, mockFile);
    assert.equal(encoding, 'utf8');
    return content;
  };
};

describe('headMain', () => {
  it('should return a line', () => {
    const mockReadFileSync = shouldReturn('a.txt', 'hello');
    assert.deepStrictEqual(headMain(mockReadFileSync, 'a.txt'), 'hello');
  });

  it('should return error, file doesn\'t exist', () => {
    const mockReadFileSync = shouldReturn('a.txt', 'hello');
    assert.throws(() => headMain(mockReadFileSync, 'b.txt'), { message: 'head: b.txt: No such file or directory' });

    assert.throws(() => headMain(mockReadFileSync, '-n3', 'b.txt'), { message: 'head: b.txt: No such file or directory' });
  });

  it('should throw error for mixing valid options', () => {
    const mockReadFileSync = shouldReturn('a.txt', 'hello');
    assert.throws(() => headMain(mockReadFileSync, '-n3', '-c6', 'a.txt'), {
      message: 'head: can\'t combine line and byte counts'
    });
  });

  it('should throw error for invalid option', () => {
    const mockReadFileSync = shouldReturn('a.txt', 'hello');
    assert.throws(() => headMain(mockReadFileSync, '-v3', '-c6', 'a.txt'), {
      message: 'head: illegal option --  v\nusage: head [-n lines | -c bytes] [file ...]'
    });
  });
});
