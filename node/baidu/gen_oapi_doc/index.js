#!/usr/local/bin/node

// 用于生成 bgs-doc 中的新增 api 文档内容

// TODO:: 
// 1. 将 node/1.js 这个配置文件模板化，并支持通过命令快速在当前执行路径生成一个配置文件供修改
// 2. 对非 base 场景（如 callback） 进行支持

const fs = require('fs');
const path = require('path');
const os = require('os');
const _ = require('lodash');

const { Command, Argument } = require('commander');

let program = new Command();

let pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../package.json'))
);
program.version(pkg.version, '-v --version');
program.description(pkg.description);
program.usage('[command] [options]');

program
  .command('parse', { isDefault: true })
  .description('')
  .argument('[cfg_file]', 'config file')
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
      console.log(`即将为 ${scene} 场景生成 API 文档...`)
      const page_name_prefix_map = {
        game: 'API_use',
      };

      // 构建场景专属上下文
      let scene_data = _.assignIn(
        {
          scene: scene,
          call_example_page: `/?d=bgs-${scene}&p=${ page_name_prefix_map[scene] || scene.toUpperCase() + '_API_use' }`
        },
        data
      );

      // 生成最终内容并写入
      let doc_content = compiled(scene_data);
      let folder = `bgs-${scene}/md/api/base`;
      let file_path = path.join(proj_root, doc_path, folder, file_name);
      console.log(`Write file for scene ${scene}`, file_path);
      fs.writeFileSync(file_path, doc_content);

      // 打印 index.json 修改指南
      const code_prefix_map = {
        game: 'API_base',
      }
      const file_name0 = file_name.replace('.md', '')
      const code = (code_prefix_map[scene] || `${scene.toUpperCase()}_API_base`) + file_name0
      console.log(`请在 public/doc/bgs-${scene}/index.json 的 '基础能力相关接口' children 下加入以下内容
{
    "name": "${scene_data.info.api_name}",
    "desc": "${scene_data.info.usage_background}",
    "code": "${code}",
    "path": "/API/base",
    "file": "${file_name0}",
    "headings": [
        "基本信息",
        "请求参数",
        "返回参数",
        "请求示例",
        "响应示例",
        "异常示例"
    ]
},
        `);

      // 打印运行时检查指南
      // TODO:: game 的前缀
      const check_url = `http://localhost:8080/?d=bgs-${scene}&p=${scene.toUpperCase()}_API_baseduapk_image_create`;
      console.log(`请在原项目执行 npm run dev 后，打开 ${check_url} 对生成的文档内容进行检查`)

      console.log(`✓ 场景 ${scene} 处理完毕`)
      console.log()
    });
  });

program.parse();
