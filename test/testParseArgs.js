const assert = require('assert');
const { parseArgs } = require('../src/parseArgs.js');

describe('parseArgs', () => {
  it('should parse filename and lineCount option', () => {
    assert.deepStrictEqual(parseArgs(['-n', '1', 'abc.txt']), {
      files: ['abc.txt'],
      option: 'lineCount',
      value: 1
    });
  });

  it('should parse the filename only', () => {
    assert.deepStrictEqual(parseArgs(['abc.txt']), {
      files: ['abc.txt'],
      option: 'lineCount',
      value: 10
    });
  });

  it('should parse filename and byteCount option', () => {
    assert.deepStrictEqual(parseArgs(['-c', '1', 'abc.txt']), {
      files: ['abc.txt'],
      option: 'byteCount',
      value: 1
    });
  });

  it('should parse filename and the last option when encountered repeatedly', () => {
    assert.deepStrictEqual(parseArgs(['-c', '1', '-c', '4', 'abc.txt']), {
      files: ['abc.txt'],
      option: 'byteCount',
      value: 4
    });
  });
});
