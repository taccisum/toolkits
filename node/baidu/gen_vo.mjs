#!/usr/local/bin/node

// 根据 Controller 生成相应的空的 VO POJO 类并写入包（目前仅支持 aPaaS）

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import style from '../utils/style.js';
const { hightlight } = style;

import { Command, Argument } from 'commander';

let program = new Command();

// let pkg = JSON.parse(fs.readFileSync(path.join(path.dirname(), '../package.json')));
// program.version(pkg.version, '-v --version');
// program.description(pkg.description);
program.usage('[command] [options]');

function parse_basic_info(content, base_path) {
  const info = {
    pkg: '',
    vo_pkg: '',
    vo_path: '',
    req_vo: [],
    resp_vo: [],
  };

  info.path = base_path;
  info.vo_path = path.join(base_path, '..', 'vo');

  content.split('\n').forEach((row) => {
    let m = row.match(/package (.*).controller;/);
    if (m) {
      info.pkg = m[1] + '.controller';
      info.vo_pkg = m[1] + '.vo';
      return;
    }

    m = row.match(/(\w+RequestVo).*/);
    if (m) {
      info.req_vo.push(m[1]);
    }

    m = row.match(/(\w+ResponseVo).*/);
    if (m) {
      info.resp_vo.push(m[1]);
    }
  });
  return info;
}

program
  .command('gen', { isDefault: true })
  .description('')
  .argument('[controller]', 'apaas controller file')
  .action(async (controller, opts) => {
    const f = fs.readFileSync(controller);

    const base_path = path.dirname(path.join(process.cwd(), controller));
    // const absUrl = path.dirname(fileURLToPath(import.meta.url));
    const controller_content = String(f);

    const info = parse_basic_info(controller_content, base_path);

    console.log(hightlight(`从 ${controller} 中提取的基本信息如下：`));
    console.log(info);
    const answers = await inquirer.prompt([
      {
        type: 'confirm', // 确认类型
        name: 'isReady', // 存储结果的键名
        message: '在继续下一步执行之前，请确认基本信息是否正确', // 提示语
        default: true, // 默认选项
      },
      // {
      //   type: 'input',        // 只有确认后才会触发的额外询问
      //   name: 'taskName',
      //   message: '请输入任务名称：',
      //   when: (answers) => answers.isReady, // 条件判断
      // }
    ]);

    if (answers.isReady) {
      console.log(`🚀 开始生成 POJO 并写入对应路径...`);
      // 写入 RequestVO
      info.req_vo.forEach((it) => {
        const vo_content = `
package ${info.vo_pkg}.request;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;

/**
 * @author taccisum - liaojinfeng@baidu.com
 * @since 2026-02-06
 */
@Data
@ToString
public class ${it} implements Serializable {
}`;
        const req_path = path.join(info.vo_path, 'request', `${it}.java`);
        fs.writeFileSync(req_path, vo_content);
        console.log(`POJO ${req_path} has been written.`);
      });

      // 写入 ResponseVO
      info.resp_vo.forEach((it) => {
        const vo_content = `
package ${info.vo_pkg}.response;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;

/**
 * @author taccisum - liaojinfeng@baidu.com
 * @since 2026-02-06
 */
@Data
@ToString
public class ${it} implements Serializable {
}`;
        const req_path = path.join(info.vo_path, 'response', `${it}.java`);
        fs.writeFileSync(req_path, vo_content);
        console.log(`POJO ${req_path} has been written.`);
      });
    } else {
      console.log('❌ 任务已取消。');
    }
  });

program.parse();
