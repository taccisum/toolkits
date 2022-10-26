const execa = require('execa')

module.exports = {
    async handlePatch(patch, opts, tmpDir) {
        // 通用处理，打开 vim 自由编辑
        await execa('vim', [ '.' ], {
            stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
        })

        await execa('git', [ 'diff' ], {
            stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
        })
    }
}
