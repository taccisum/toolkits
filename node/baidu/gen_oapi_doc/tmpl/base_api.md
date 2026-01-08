### {{ info.api_name }}

#### 基本信息

**URL**

> ${openApiHost}/{{ info.api_path || '__api_path__' }}

**请求格式**

> POST

**版本号**

> 3

**使用场景**

> {{ info.usage_background || '__usage_background__' }}

#### 请求参数

**body**

{{ info.request_body_desc || `
| 名称             | 类型   | 是否必须 | 默认值 | 备注                       | 示例值                                 |
|----------------|------|----|-----|--------------------------|-------------------------------------|
| - | - | - |        | - | -                        |
` }}

#### 返回参数

{{ info.response_body_desc || `
| 名称            | 类型       | 是否必须 | 默认值 | 备注                       | 示例值                      |
|---------------|----------|------| ------ |--------------------------|--------------------------|
| code          | Integer  | 必须   |        | 响应码                      | 0                        |
| data          | Integer  | 必须   |        | 实例池实例数量                | 1                        |
| msg           | String   | 必须   |        | 响应信息                     |                          |
| ts            | Long     | 必须   |        | 时间戳                      | 1601188620078            |
` }}

#### 请求示例

> 参考：<a class="pageForward" href="{{ call_example_page }}">调用方式</a>

#### 响应示例

```json
{{ info.response_example || `
\{
  "code": 0,
  "msg": "OK",
  "ts": "1601188620078",
  "data": 1
\}
`}}
```

#### 异常示例

```json
{{ info.err_response_example || 'asd'}}
```
