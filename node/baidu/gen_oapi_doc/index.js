#!/usr/local/bin/node

// CLI 入口文件

const { cmd } = require('./cmd');

if (require.main === module) {
  // 直接执行时才进行 parse
  cmd.parse();
}
