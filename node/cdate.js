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
    console.log('Date Time: ', d.toLocaleString('zh-cn'))
    console.log('Timestamp(s): ', Math.floor(d.getTime() / 1000))
    console.log('Timestamp(ms): ', d.getTime())
}

program.command('convert', {isDefault: true})
.description('')
.argument('[date]', 'date string or timestamp')
.action(async (date, opts) => {
    process.env.TZ = 'Asia/Shanghai'
    let d
    if (!date) {
        d = new Date()
    } else {
        const tstamp = Number.parseInt(date)
        if (tstamp) {
            d = new Date(tstamp)
        } else {
            d = new Date(date)
        }
    }
    print_date(d)
});

program.parse()
