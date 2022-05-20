const assert = require('assert');
const { head, extractLines } = require('../src/headLib.js');

describe('head', () => {
  it('should return one line of content', () => {
    assert.deepStrictEqual(head('hello', 1), 'hello');
    assert.deepStrictEqual(head('hii', 1), 'hii');
    assert.deepStrictEqual(head('cat\nbat', 1), 'cat');
  });

  it('should return two lines', () => {
    assert.deepStrictEqual(head('cat\nbat\nrat', 2), 'cat\nbat');
  });

  it('should return given number of lines', () => {
    assert.deepStrictEqual(head('cat\nbat\nrat\nmat', 3), 'cat\nbat\nrat');
  });
});

describe('extractLines', () => {
  it('should return one line', () => {
    assert.deepStrictEqual(extractLines(['hello'], 1), ['hello']);
    assert.deepStrictEqual(extractLines(['hello', 'hii'], 1), ['hello']);
  });
  it('should return two lines', () => {
    assert.deepStrictEqual(extractLines(['hello', 'hii'], 2), ['hello', 'hii']);
    assert.deepStrictEqual(extractLines(['hello', 'hii', 'bye'], 2), ['hello', 'hii']);
  });
  it('should return given number of lines', () => {
    const input = ['hello', 'hii', 'bye', 'see you'];
    const expected = ['hello', 'hii', 'bye'];
    assert.deepStrictEqual(extractLines(input, 3), expected);
  });
});

