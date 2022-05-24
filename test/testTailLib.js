const assert = require('assert');
const { extractLastLines } = require('../src/tailLib.js');
const { extractLastBytes } = require('../src/tailLib.js');

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

  it('should return specified number of last lines', () => {
    assert.deepStrictEqual(extractLastLines(['hello', 'hii', 'bye', 'see you', 'tata'], 4), ['hii', 'bye', 'see you', 'tata']);
  });
});

describe('extractLastBytes', () => {
  it('should return last one byte', () => {
    assert.deepStrictEqual(extractLastBytes('hello', 1), 'o');
    assert.deepStrictEqual(extractLastBytes('h', 1), 'h');
  });

  it('should return last two byte', () => {
    assert.deepStrictEqual(extractLastBytes('hello', 2), 'lo');
    assert.deepStrictEqual(extractLastBytes('hii\nhello', 2), 'lo');
  });

  it('should return any number of specified last bytes', () => {
    assert.deepStrictEqual(extractLastBytes('hii\nhello', 4), 'ello');
    assert.deepStrictEqual(extractLastBytes('hii\nhello', 8), 'ii\nhello');
  });
});
