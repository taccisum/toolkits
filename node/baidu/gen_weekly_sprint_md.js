#!/usr/local/bin/node

// 根据 json 生成周报中的迭代 md 内容

const fs = require('fs');
const path = require('path');
const jwt = require('json-web-token');

const { Command, Argument } = require('commander');

let program = new Command();

let pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')));
program.version(pkg.version, '-v --version');
program.description(pkg.description);
program.usage('[command] [options]');

program
  .command('parse', { isDefault: true })
  .description('')
  .argument('[json]', 'target json file')
  .action(async (json, opts) => {
    const f = fs.readFileSync(json);
    const json_str = String(f);
    const requirements = JSON.parse(json_str);

    let md_text = '';
    requirements.forEach((it) => {
      // md_text += `- ${it['name']}`;
      // md_text += `- ${it['link']}\n`;
      // md_text += `  - 需求背景：\n`;
      // md_text += `  - 研发：${it['owner']}\n`;
      md_text += `${it['link']}\n`;
      md_text += `需求背景：\n`;
      md_text += `研发：${it['owner']}\n`;
    });

    console.log(md_text);
  });

program.parse();
