const assert = require('assert');
const { extractLastLines } = require('../src/tailLib.js');

describe('extractLastLines', () => {
  it('should return the last line', () => {
    assert.deepStrictEqual(extractLastLines(['hello'], 1), ['hello']);
    assert.deepStrictEqual(extractLastLines(['hello', 'hii'], 1), ['hii']);
  });

  it('should return two last line', () => {
    assert.deepStrictEqual(extractLastLines(['hello'], 2), ['hello']);
    assert.deepStrictEqual(extractLastLines(['hello', 'hii'], 2), ['hello', 'hii']);
  });

  it('shouldn\'t return any line', () => {
    assert.deepStrictEqual(extractLastLines(['hello'], 0), []);
  });

  it('should return specified number of lines', () => {
    assert.deepStrictEqual(extractLastLines(['hello', 'hii', 'bye', 'see you', 'tata'], 4), ['hii', 'bye', 'see you', 'tata']);
  });
});

