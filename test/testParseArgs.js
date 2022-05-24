const assert = require('assert');
const { parseArgs, parseOptions, validateOptionValuePair } = require('../src/parseArgs.js');
const { areOptionsMerged, validateCombinedOptions } = require('../src/validationLib.js');

describe('parseArgs', () => {
  it('should parse filename and lineCount option', () => {
    assert.deepStrictEqual(parseArgs(['-n', '1', 'abc.txt']), {
      files: ['abc.txt'],
      option: 'line',
      count: 1
    });
  });

  it('should parse the filename and return defualt option', () => {
    assert.deepStrictEqual(parseArgs(['abc.txt']), {
      files: ['abc.txt'],
      option: 'line',
      count: 10
    });
  });

  it('should parse filename and byteCount option', () => {
    assert.deepStrictEqual(parseArgs(['-c', '1', 'abc.txt']), {
      files: ['abc.txt'],
      option: 'byte',
      count: 1
    });
  });

  it('should parse filename and the last option when encountered repeatedly', () => {
    assert.deepStrictEqual(parseArgs(['-c', '1', '-c', '4', 'abc.txt']), {
      files: ['abc.txt'],
      option: 'byte',
      count: 4
    });
  });
});

describe('parseOptions', () => {
  it('should parse all options and multiple files', () => {
    const legalOptions = { 'n': 'lin', 'c': 'byte' };
    const expected = { options: [['c', 1], ['c', 2]], files: ['a.txt', 'b.txt'] };
    assert.deepStrictEqual(parseOptions(['-c1', '-c2', 'a.txt', 'b.txt'], legalOptions), expected);
  });

  it('should parse options even when they are space seperated', () => {
    const legalOptions = { 'n': 'lin', 'c': 'byte' };
    const expected = { options: [['n', 1], ['n', 2]], files: ['a.txt'] };
    assert.deepStrictEqual(parseOptions(['-n', '1', '-n2', 'a.txt'], legalOptions), expected);
  });
});

describe('validateOptionValuePair', () => {
  const legalOptions = { 'n': 'line', 'c': 'byte' };
  it('should throw illegal option error', () => {
    assert.throws(() => validateOptionValuePair(['b', 4], legalOptions), { message: 'head: illegal option --  b\nusage: head [-n lines | -c bytes] [file ...]' });
  });

  it('should throw illegal byte count error', () => {
    assert.throws(() => validateOptionValuePair(['c', 'a'], legalOptions), { message: 'head: illegal byte count -- a' });
  });

  it('should throw illegal line count error', () => {
    assert.throws(() => validateOptionValuePair(['n', 'a'], legalOptions), { message: 'head: illegal line count -- a' });
  });
});

describe('validateCombinedOptions', () => {
  it('should throw option combined error', () => {
    assert.throws(() => validateCombinedOptions([['n', '4'], ['c', '4']]), {
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
