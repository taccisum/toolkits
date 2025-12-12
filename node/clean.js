#!/usr/local/bin/node

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const { Command, Argument } = require('commander');
const { exit } = require('process');

let program = new Command();

// let pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));
program.version('0.1', '-v --version');
program.description('clear data. support json only now.');
program.usage('[options] file');

program
  .argument('[file]', 'target file')
  .option('-t, --type', 'data type.', 'json')
  .option('-o, --out', 'output file.', 'out.txt')
  .action(async (file, opts) => {
    if (!file) {
      program.help();
      exit();
    }

    let { type, out } = opts;
    console.log(`Start reading file: ${file}`);
    const in_fst = fs.createReadStream(file);
    const out_fst = fs.createWriteStream(out);
    // 这里使用流式处理避免打爆内存
    const rl = readline.createInterface({
      input: in_fst,
      crlfDelay: Infinity, // 自动识别不同操作系统的换行符
    });
    let stat = { success: 0, fail: 0 };
    rl.on('line', (line) => {
      try {
        JSON.parse(line);
        out_fst.write(line);
        out_fst.write('\n');
        stat.success++;
      } catch (e) {
        stat.fail++;
        // console.error(e);
      }
    });
    rl.on('close', () => {
      console.log(`File clean completed. Outfile=${out}`);
      console.log(`Success=${stat.success}. Fail=${stat.fail}`);
    });
  });

program.parse();

module.exports = {
  //   parse_date,
};
