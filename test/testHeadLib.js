const assert = require('assert');
const { head } = require('../src/headLib.js');

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

