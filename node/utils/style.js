// text style utils.
// 利用 chalk 将文字样式化

const chalk = require('chalk');

module.exports = {
  success(str) {
    return chalk.bold(chalk.green(str));
  },
  hightlight(str) {
    return chalk.bold(chalk.bgBlue(str));
  },
  warn(str) {
    return chalk.bold(chalk.red(str));
  },
  /**
   * Low-key Style
   */
  low_key(str) {
    return chalk.gray(str);
  },
  tip(str) {
    return chalk.yellow(str);
  },
  /**
   * URL Link style
   */
  link(str) {
    return chalk.cyan(str);
  },
};
