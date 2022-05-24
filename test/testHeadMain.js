const assert = require('assert');
const { headMain } = require('../src/headLib.js');

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

describe('headMain', () => {
  it('should return a line of a file', () => {
    const mockReadFileSync = shouldReturn('a.txt', 'hello');
    const expected = [{
      fileName: 'a.txt', content: 'hello', error: {
        value: false,
        message: ''
      }
    }];
    assert.deepStrictEqual(headMain(mockReadFileSync, ['a.txt']), expected);
  });

  it('should return 2 bytes of a file', () => {
    const mockReadFileSync = shouldReturn('a.txt', 'hello');
    const expected = [{
      fileName: 'a.txt', content: 'he', error: {
        value: false,
        message: ''
      }
    }];
    assert.deepStrictEqual(headMain(mockReadFileSync, ['-c', '2', 'a.txt']), expected);
  });

  it('should return object, file does not exist', () => {
    const mockReadFileSync = shouldReturn('b.txt', 'hello');
    const expected = [
      {
        fileName: 'a.txt', content: '',
        error: {
          value: true,
          message: 'head: a.txt: No such file or directory'
        }
      }
    ];
    assert.deepStrictEqual(headMain(mockReadFileSync, ['-c', '2', 'a.txt']), expected);
  });

  it('should throw error for mixing valid options', () => {
    const mockReadFileSync = shouldReturn('a.txt', 'hello');
    assert.throws(() => headMain(mockReadFileSync, ['-n3', '-c6', 'a.txt']), {
      message: 'head: can\'t combine line and byte counts'
    });
  });

  it('should throw error for invalid option', () => {
    const mockReadFileSync = shouldReturn('a.txt', 'hello');
    assert.throws(() => headMain(mockReadFileSync, ['-v3', '-c6', 'a.txt']), {
      message: 'head: illegal option --  v\nusage: head [-n lines | -c bytes] [file ...]'
    });
  });
});
