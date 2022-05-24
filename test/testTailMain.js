const assert = require('assert');
const { tailMain } = require('../src/tailLib.js');

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

describe('tailMain', () => {
  it('should return last line of a file', () => {
    const mockReadFileSync = shouldReturn('a.txt', 'hello');
    assert.deepStrictEqual(tailMain(mockReadFileSync, ['a.txt']), 'hello');
  });

  it('should return last 2 bytes of a file', () => {
    const mockReadFileSync = shouldReturn('a.txt', 'hello');
    assert.deepStrictEqual(tailMain(mockReadFileSync, ['-c', '2', 'a.txt']), 'lo');
  });

  it('should throw error, file does not exist', () => {
    const mockReadFileSync = shouldReturn('b.txt', 'hello');
    assert.throws(() => tailMain(mockReadFileSync, ['-c', '2', 'a.txt']), { message: 'tail: a.txt: No such file or directory' });
  });
});
