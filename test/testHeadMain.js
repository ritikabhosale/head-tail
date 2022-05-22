const assert = require('assert');
const { headMain } = require('../src/headLib.js');

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
