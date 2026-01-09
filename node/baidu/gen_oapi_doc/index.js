#!/usr/local/bin/node

// 用于生成 aPaaS bgs-doc 中的新增 API 文档内容

// TODO:: 规划中的功能
// 1. 将 node/1.js 这个配置文件模板化，并支持通过命令快速在当前执行路径生成一个配置文件供修改 ✓
// 2. 对非 base 场景（如 callback） 进行支持

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chalk = require('chalk')

const { Command, Argument } = require('commander');

const style = require('../../utils/style.js')

let program = new Command();

let pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../package.json'))
);
program.version(pkg.version, '-v --version');
program.description(pkg.description);
program.usage('[command] [options]');

function build_example_page_path(scene) {
  const page_name_prefix_map = {
    game: 'API_use',
  };
  return `/?d=bgs-${scene}&p=${ page_name_prefix_map[scene] || scene.toUpperCase() + '_API_use' }`;
}

program
  .command('main', { isDefault: true })
  .description('Generate API doc for project bgs-doc.')
  .argument('<cfg_file>', 'config file')
  .option('--no-md', 'Do not create markdown file.')
  .action(async (cfg_file, opts) => {
    // 1. 读取基础信息（模板、外部配置等）
    const tmpl_path = path.join(__dirname, 'tmpl');
    const configs = require(path.join(process.cwd(), cfg_file));

    // 2. 设置全局配置
    // 2.1 设置模板占位符识别正则表达式，避免与原 md 中的 '${xxx}' 冲突
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    // 测试模板功能
    // const test_tmpl_content = String(fs.readFileSync(path.join(tmpl_path, '/test.md')));
    // let c1 = _.template(test_tmpl_content)
    // console.log(c1({
    //   context: {
    //     'response_body_desc': 'foo'
    //   }
    // }))

    // 3. 读取模板内容
    const f = fs.readFileSync(path.join(tmpl_path, '/base_api.md'));
    const base_api_tmpl_content = String(f);
    let compiled = _.template(base_api_tmpl_content);

    // 4. 组装通用上下文（不区分场景）
    let data = {
      info: {
        // 'api_name': '测试一下',
      },
    };
    _.assignIn(data.info, configs.info); // 合并默认参数与外部参数

    // 5. 按业务场景分别输出文件至对应的目标路径（bgs-doc 项目）
    const proj_root = configs.project.root_path;
    const doc_path = configs.project.doc_path;
    const apply_to = configs.apply_to;
    const file_name = configs.file_name;

    apply_to.forEach((scene) => {
      console.log(style.hightlight(`🚀 即将为 ${scene} 场景生成 API 文档...`))

      // 基于通用上下文，构建场景专用上下文
      let scene_data = _.assignIn(
        {
          scene: scene,
          call_example_page: build_example_page_path(scene),
        },
        data
      );

      // 生成最终内容，并写入目标项目
      let doc_content = compiled(scene_data);
      let target_folder = `bgs-${scene}/md/api/base`;
      let file_path = path.join(proj_root, doc_path, target_folder, file_name);
      if (opts.md) {
        console.log(`Write file for scene ${scene}:`, file_path);
        fs.writeFileSync(file_path, doc_content);
      } else {
        console.log(style.tip('Skip markdown generation.'))
      }

      // 打印后续操作步骤指南
      let cur_step = 1;   // 记录当前步骤

      // 打印 index.json 修改指南
      const code_prefix_map = {
        game: 'API_base',
      }
      const file_name_no_ext = file_name.replace('.md', '')
      const code = (code_prefix_map[scene] || `${scene.toUpperCase()}_API_base`) + `_${file_name_no_ext}`

      console.log(`${cur_step++}. 请在 public/doc/bgs-${scene}/index.json 的 '基础能力相关接口' children 数组内加入以下内容：`);
      console.log()
      console.log(style.low_key(`
{
    "name": "${scene_data.info.api_name}",
    "desc": "${scene_data.info.usage_background}",
    "code": "${code}",
    "path": "/API/base",
    "file": "${file_name_no_ext}",
    "headings": [
        "基本信息",
        "请求参数",
        "返回参数",
        "请求示例",
        "响应示例",
        "异常示例"
    ]
},
        `.trim()))
      console.log()   // 前后留空一行方便复制

      // 打印运行时检查指南
      // TODO:: game 的前缀不对
      const check_url = `http://localhost:8080/?d=bgs-${scene}&p=${scene.toUpperCase()}_API_base_${file_name_no_ext}`;
      console.log(`${cur_step++}. 请在原项目执行 npm run dev 后，打开 ${style.link(check_url)} 对生成的文档内容进行检查`)

      console.log(style.success(`✓ 场景 ${scene} 处理完毕 🎉`))
      console.log()
    });
  });

/**
 * Style WARNING
 * @deprecated use style.js
 */
function s_warn(str) {
  return chalk.bold(chalk.red(str))
}

// new 命令，用于创建 API 元数据文件
program
  .command('new')
  .description('Create a new API doc metadata file.')
  .argument('[type]', 'Specify the type of the API. Now supportted types: [base]', 'base')
  .option('-n, --name <name>', 'API name')
  .action(async (type, opts) => {
    if (type === 'base') {
      // 设置模板占位符识别正则表达式，避免与原 md 中的 '${xxx}' 冲突
      _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
      const tmpl_path = path.join(__dirname, 'tmpl');
      const metadata_tmpl_content = String(fs.readFileSync(path.join(tmpl_path, 'metadata.js')));
      const api_name = opts.name || 'untitled_api';

      const data = {
        name: api_name,
      }
      const compiled = _.template(metadata_tmpl_content);

      const metadata_content = compiled(data);

      const file_name = `${api_name }.js`;
      fs.writeFileSync(file_name, metadata_content);
      console.log(`New '${type}' metadata file ${file_name} has been created.`)
    } else {
      console.warn(s_warn(`× Not yet supported API type: ${type}`));
    }
  });

if (require.main === module) {
  // 直接执行时才进行 parse
  program.parse();
} else {
  module.exports = {
    // Export those private methods for usage of unit tests
    test: {
      build_example_page_path,
    }
  }
}


