
一些自用工具集


> 注意：请勿在 project 根目录开发，应先 `cd /node`


## jwt

parse jwt token and display related info.


Usage example:

```bash
$ jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcm12bV9hcHAiLCJleHAiOjE3NjU1MTY4NDIsInV1aWQiOiI5ZGM4YzMzYWQwZDY0MzQ3YmNjMzk3NzlmNzg4YjYyMiIsIm1lcmNoYW50SWQiOjEyNDY4LCJhY2NvdW50SWQiOjg2NDEyMDAxNzcwNDc0MjA1MTksImluc3RhbmNlQ29kZSI6IlZNMDEwMTUwMjUyMjUwIn0.bq8DGo67tuoB2nbe1OxyFedM23WrRSlw-i_QuzLxmlE
--- All plaintext sections:
Headers: {"typ":"JWT","alg":"HS256"}
Payload: {"iss":"armvm_app","exp":1765516842,"uuid":"9dc8c33ad0d64347bcc39779f788b622","merchantId":12468,"accountId":8641200177047420519,"instanceCode":"VM010150252250"}
  exp: 2025/12/12 13:20:42
--- Validation results:
'secret' is not specified so that validation action has been skipped.
```



## clean

clear invalid data

用法示例：

将 1.txt 中不符合 json 格式的行清理掉，并输出至 out.txt 中

```bash
$ clean -t json -o out.txt 1.txt
```






