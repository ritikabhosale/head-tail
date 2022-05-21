const assert = require('assert');
const { parseArgs, parseOptions } = require('../src/parseArgs.js');

describe('parseArgs', () => {
  it('should parse filename and lineCount option', () => {
    assert.deepStrictEqual(parseArgs(['-n', '1', 'abc.txt']), {
      files: ['abc.txt'],
      option: 'lineCount',
      count: 1
    });
  });

  it('should parse the filename only', () => {
    assert.deepStrictEqual(parseArgs(['abc.txt']), {
      files: ['abc.txt'],
      option: 'lineCount',
      count: 10
    });
  });

  it('should parse filename and byteCount option', () => {
    assert.deepStrictEqual(parseArgs(['-c', '1', 'abc.txt']), {
      files: ['abc.txt'],
      option: 'byteCount',
      count: 1
    });
  });

  it('should parse filename and the last option when encountered repeatedly', () => {
    assert.deepStrictEqual(parseArgs(['-c', '1', '-c', '4', 'abc.txt']), {
      files: ['abc.txt'],
      option: 'byteCount',
      count: 4
    });
  });
});

describe('parseOptions', () => {
  it('should parse all options and one file name', () => {
    const expected = { options: [['n', 1], ['c', 2]], files: ['file.txt'] };
    assert.deepStrictEqual(parseOptions(['-n1', '-c2', 'file.txt']), expected);
  });

  it('should parse all options and multiple files', () => {
    const expected = { options: [['v', 1], ['c', 2]], files: ['a.txt', 'b.txt'] };
    assert.deepStrictEqual(parseOptions(['-v1', '-c2', 'a.txt', 'b.txt']), expected);
  });
});
