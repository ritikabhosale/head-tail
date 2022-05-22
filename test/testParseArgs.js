const assert = require('assert');
const { parseArgs, parseOptions, validateOptions, areOptionsMerged } = require('../src/parseArgs.js');

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

  it('should parse options even when they are space seperated', () => {
    const expected = { options: [['n', 1], ['c', 2]], files: ['a.txt'] };
    assert.deepStrictEqual(parseOptions(['-n', '1', '-c2', 'a.txt']), expected);
  });

  it('should parse options without any file', () => {
    const expected = { options: [['n', 1], ['c', 2]], files: [] };
    assert.deepStrictEqual(parseOptions(['-n', '1', '-c2']), expected);
  });
});

describe('validateOptions', () => {
  it('should return option object of line count', () => {
    const expected = { option: 'lineCount', count: 2 };
    assert.deepStrictEqual(validateOptions([['n', 2]]), expected);
  });

  it('should return option object of byte count', () => {
    const expected = { option: 'byteCount', count: 3 };
    assert.deepStrictEqual(validateOptions([['c', 3]]), expected);
  });

  it('should return last option count when specified redundantly', () => {
    const expected = { option: 'lineCount', count: 2 };
    assert.deepStrictEqual(validateOptions([['n', 3], ['n', 2]]), expected);
  });

  it('should return defualt line count when no options specified', () => {
    const expected = { option: 'lineCount', count: 10 };
    assert.deepStrictEqual(validateOptions([]), expected);
  });

  it('should throw illegal option error', () => {
    assert.throws(() => validateOptions([['b', 4]]), { message: 'head: illegal option --  b\nusage: head [-n lines | -c bytes] [file ...]' });
  });

  it('should throw illegal byte count error', () => {
    assert.throws(() => validateOptions([['c', 'a']]), { message: 'head: illegal byteCount -- a' });
  });

  it('should throw illegal line count error', () => {
    assert.throws(() => validateOptions([['n', 'a']]), { message: 'head: illegal lineCount -- a' });
  });

  it('should throw option combined error', () => {
    assert.throws(() => validateOptions([['n', 4], ['c', 5]]), {
      message: 'head: can\'t combine line and byte counts'
    });
  });
});

describe('areOptionsMerged', () => {
  it('should return false, specified only one of the valid options', () => {
    assert.deepStrictEqual(areOptionsMerged([['n', 2]]), false);
  });

  it('should return true, specified both valid options', () => {
    assert.deepStrictEqual(areOptionsMerged([['n', 2], ['c', 4]]), true);
  });

  it('should return false, specified some invalid and a valid option', () => {
    assert.deepStrictEqual(areOptionsMerged([['n', 2], ['v', 4]]), false);
  });
});
