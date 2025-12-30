




## 周报迭代内容快速生成

1. 从排期文档，如 https://ku.baidu-int.com/knowledge/HFVrC7hq1Q/pKzJfZczuc/FJ5fMfwQV5/9WytHwPw2KK790 导出内容为 md5

2. 执行需求提取脚本，并将内容输出至 json（适当将不必要的标准输出删除），再检查其内容正确性

    bd-extract-requirements 1.md > 1.json

3. 执行周报迭代内容生成脚本，并 copy

    bd-gen-weekly-sprint-md 1.json | pbcopy

4. 将上述复制的内容贴至周报 ku 文档中，适当调整格式，并填入需求背景（目前暂不支持自动生成）

