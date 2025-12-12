

function parse_date(date) {
    process.env.TZ = 'Asia/Shanghai'
    let d
    if (!date) {
        d = new Date()
    } else {
        if (String(date).startsWith('u')) {
            d = new Date(date.slice(1,))        // utc string
        } else if (/-| |\./.test(date)) {
            d = new Date(date)      // maybe a utc string
        } else {
            if (String(date).length == 10) date = date * 1000;

            const tstamp = Number.parseInt(date)
            if (tstamp) {
                d = new Date(tstamp)
            } else {
                d = new Date(date)
            }
        }
    }
    return d
}

module.exports = {
    parse_date: parse_date,
}