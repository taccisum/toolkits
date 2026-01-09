const assert = require('assert');
const mod = require('./cmd.js').test;

describe('index.test.js', () => {
  describe('#build_example_page_path', () => {
    it('smoking', () => {
      assert.strictEqual(
        mod.build_example_page_path('game'),
        '/?d=bgs-game&p=API_use'
      );
      assert.strictEqual(
        mod.build_example_page_path('phone'),
        '/?d=bgs-phone&p=PHONE_API_use'
      );
    });
  });
});
