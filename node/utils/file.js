const fs = require('fs')
const readline = require('readline')
const path = require('path')

let util = {
    abs_path(file) {
        if (path.isAbsolute(file)) {
            // absolute path
            return file
        } else if (file.startsWith('~/')) {
            // relative path of current user home
            return path.join(process.env.HOME, file.substring(2))
        } else if(file.startsWith('./')) {
            // relative path
            return file
        } else if (file.match(/^[A-Z]:\\.*/)) {
            // windows style absolute path
            return file
        } else {
            // relative path of current work dir
            return path.join(process.cwd(), file)
        }
    },
    /**
     * 读取文件内容
     * @param {string} file 文件路径，支持 '~/' './' '/'
     * @deprecated 目标文件过大时可能导致内存占用较多，建议使用 readlines()
     */
    async read(file) {
        if (file) return fs.readFileSync(util.abs_path(file))
    },

    /**
     * 读取文件内容（返回 line 数组）
     * @param {string} file 文件路径，支持 '~/' './' '/'
     * @returns line 数组
     */
    async readlines(file) {
        return new Promise((resolve, reject) => {
            try {
                const lines = []
                const rs = fs.createReadStream(util.abs_path(file))
                const rl = readline.createInterface(rs)
                rl.on('line', line => {
                    lines.push(line)
                })
                rl.on('close', () => {
                    resolve(lines)
                })
            } catch (err) {
                reject(err)
            }
        })
    }
}

module.exports = util