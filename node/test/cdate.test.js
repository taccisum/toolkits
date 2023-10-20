const assert = require('assert');
const cdate = require('../cdate')

describe('cdate.test.js', () => {
    it('parse timestamp', () => {
        d = cdate.parse_date(1691648714536)
        assert.strictEqual(d.toISOString(), '2023-08-10T06:25:14.536Z')

        d = cdate.parse_date('1691648714536')
        assert.strictEqual(d.toISOString(), '2023-08-10T06:25:14.536Z')
    });

    it('parse timestamp(s)', () => {
        d = cdate.parse_date(1691648714)
        assert.strictEqual(d.toISOString(), '2023-08-10T06:25:14.000Z')

        d = cdate.parse_date('1691648714')
        assert.strictEqual(d.toISOString(), '2023-08-10T06:25:14.000Z')
    });

    it('parse utc-like string', () => {
        assert.strictEqual(cdate.parse_date('2023-02-02').toLocaleString('zh-cn'), '2023/2/2 08:00:00')
        assert.strictEqual(cdate.parse_date('2023-02-02 12:34:56').toLocaleString('zh-cn'), '2023/2/2 12:34:56')
        assert.strictEqual(cdate.parse_date('u2023-02-02').toLocaleString('zh-cn'), '2023/2/2 08:00:00')
    });
});
