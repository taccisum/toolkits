#!/usr/local/bin/node

const fs = require('fs')
const path = require('path')

const { Command, Argument }  = require('commander')

let program = new Command();

let pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));
program.version(pkg.version, '-v --version');
program.description(pkg.description);
program.usage('[command] [options]');

function print_date(d) {
    console.log('Date Time(utc): ', d.toISOString())
    console.log('Date Time(zh-cn): ', d.toLocaleString('zh-cn'))
    console.log('Timestamp(s): ', Math.floor(d.getTime() / 1000))
    console.log('Timestamp(ms): ', d.getTime())
}

function parse_date(date) {
    // TODO:: 已迁移 ./utils/date.js，后续重构
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

program.command('convert', {isDefault: true})
.description('')
.argument('[date]', 'date string or timestamp')
.action(async (date, opts) => {
    print_date(parse_date(date))
});

program.parse()

module.exports = {
    parse_date
}
