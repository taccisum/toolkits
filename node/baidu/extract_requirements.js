#!/usr/local/bin/node

// 提取需求，例如从 aPaaS 版本排期文档 .md 内容中（须先从 ku 导出）

const fs = require('fs');
const path = require('path');
const jwt = require('json-web-token');
const { parse_date } = require('../utils/date');

const { Command, Argument } = require('commander');
const { split } = require('lodash');

let program = new Command();

let pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')));
program.version(pkg.version, '-v --version');
program.description(pkg.description);
program.usage('[command] [options]');

program
  .command('parse', { isDefault: true })
  .description('')
  .argument('[file]', 'target file')
  .action(async (file, opts) => {
    const f = fs.readFileSync(file);
    const content = String(f);
    const lines = content.split('\n');
    // console.log(lines);
    const requirements = [];
    lines.forEach((line, idx) => {
      if (!line.trim()) return; // skip empty line

      if (!line.trim().startsWith('|')) {
        return; // skip non-table-row line
      }

      const fields = line.split('|');
      const project_col = fields[1];
      const priority_col = fields[2];
      const requirement_col = fields[3];
      const owner_col = fields[8];
      // parse requirement info
      let requirement_name = '';
      let requirement_link = '';
      const m = requirement_col.match(/\[(.+)\]\((.+)\)/);
      if (m) {
        requirement_name = m[1];
        requirement_link = m[2];
      } else {
        console.log(`解析需求内容失败：${requirement_col}`);
      }

      if (!requirement_name && !requirement_link) {
        return;
      }

      requirements.push({
        project: project_col,
        priority: priority_col,
        name: requirement_name,
        link: requirement_link,
        owner: owner_col,
      });
    });

    console.log('--- 以下是提取内容\n')
    console.log(JSON.stringify(requirements, null, 2));
  });

program.parse();
