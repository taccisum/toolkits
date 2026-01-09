// bgs-doc base 类型 API 文档元描述文件

module.exports = {
  // 应用至哪些业务场景下 game/oem/phone
  apply_to: ['game', 'oem', 'phone'],
  // 目标文件名
  file_name: '{{ name }}.md',
  // bgs-doc 项目相关信息
  project: {
    root_path: '/Users/liaojinfeng/Documents/workspace/baidu/mci/apaas/src/baidu/armcm/bgs-doc',
    doc_path: 'public/doc',
  },
  // API 相关信息
  info: {
    api_name: '制作duapk镜像',
    api_path: 'resources/duapk-image/create',
    usage_background: '制作duapk镜像',
    request_body_desc: `
| 名称       | 类型      | 是否必须 | 默认值 | 备注             | 示例值              |
| ---------- |---------|------| ------ |----------------|------------------|
| appId      | Long    | 必须   |        | 应用ID           | 10001            |
| instanceCode | String  | 必须   |        | 实例编号           | "VM000000000001" |
| autoUninstall       | Integer | 非必须  |        | 制作完成后是否自动卸载应用；0-不卸载，1-卸载 | 1                |
    `.trim(),
    response_body_desc: `
| 名称                | 类型      | 是否必须 | 默认值 | 备注       | 示例值                  |
| ------------------- | --------- |------| ------ |----------| --------------------- |
| code                | Integer   | 必须   |        | 响应编码     | 0                     |
| data                | Object    | 非必须  |        |          |                       |
| ├─appImageId             | Long   | 必须   |        | 镜像id     | 12259080139067404                    |
| ├─createImageTaskId         | Long   | 必须   |        | 制作镜像任务id | 12259080139067402                      |
| ├─uninstallAppTaskId              | Long   | 非必须  |        | 卸载应用任务id | 12259080139067403                      |
| msg                 | String    | 必须   |        | 响应消息     | "OK" |
| ts                  | Long      | 必须   |        | 时间戳      | 1740572263582 |
`.trim(),
    response_example: `
{
  "data": {
    "appImageId": 12259080139067404,
    "createImageTaskId": 12259080139067402,
    "uninstallAppTaskId": 12259080139067403
  },
  "code": 0,
  "msg": "OK",
  "ts": 1740572263582
}
`.trim(),
    err_response_example: `
{
  "code": 11103072,
  "msg": "应用不存在",
  "ts": 1740572263582
}
`.trim(),
  },
};
