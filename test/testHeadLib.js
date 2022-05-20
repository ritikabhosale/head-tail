const assert = require('assert');
const { head, extractLines, extractBytes, headMain } = require('../src/headLib.js');

describe('head', () => {
  it('should return one line of content', () => {
    assert.deepStrictEqual(head('hello', { lineCount: 1 }), 'hello');
    assert.deepStrictEqual(head('hii', { lineCount: 1 }), 'hii');
    assert.deepStrictEqual(head('hii\nhello', { lineCount: 1 }), 'hii');
  });

  it('should return two lines', () => {
    assert.deepStrictEqual(head('hii\nhello\nbye', { lineCount: 2 }), 'hii\nhello');
  });

  it('should return given number of lines', () => {
    assert.deepStrictEqual(head('hii\nhello\nbye\nmat', { lineCount: 3 }), 'hii\nhello\nbye');
  });

  it('should return a byte', () => {
    assert.deepStrictEqual(head('h', { byteCount: 1 }), 'h');
    assert.deepStrictEqual(head('hii', { byteCount: 1 }), 'h');
  });

  it('should return given number of bytes', () => {
    assert.deepStrictEqual(head('hello', { byteCount: 4 }), 'hell');
  });

  it('should return given number of bytes with \n', () => {
    assert.deepStrictEqual(head('hii\nhello', { byteCount: 6 }), 'hii\nhe');
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
});
