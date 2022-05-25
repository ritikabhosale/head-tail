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
  it('should return 2 bytes of a file', () => {
    const mockReadFileSync = shouldReturn('a.txt', 'hello');
    const expected = [{
      fileName: 'a.txt', content: 'lo', error: {
        value: false,
        message: ''
      }
    }];
    assert.deepStrictEqual(tailMain(mockReadFileSync, ['-c', '2', 'a.txt']), expected);
  });

  it('should return object, file does not exist', () => {
    const mockReadFileSync = shouldReturn('b.txt', 'hello');
    const expected = [
      {
        fileName: 'a.txt', content: '',
        error: {
          value: true,
          message: 'tail: a.txt: No such file or directory'
        }
      }
    ];
    assert.deepStrictEqual(tailMain(mockReadFileSync, ['-c', '2', 'a.txt']), expected);
  });

  it('should throw error for mixing valid options', () => {
    const mockReadFileSync = shouldReturn('a.txt', 'hello');
    assert.throws(() => tailMain(mockReadFileSync, ['-n3', '-c6', 'a.txt']), {
      message: 'usage: tail [-r] [-q] [-c # | -n #] [file ...]'
    });
  });

  it('should throw error for invalid option', () => {
    const mockReadFileSync = shouldReturn('a.txt', 'hello');
    assert.throws(() => tailMain(mockReadFileSync, ['-v3', '-c6', 'a.txt']), {
      message: 'usage: tail [-r] [-q] [-c # | -n #] [file ...]'
    });
  });
});
