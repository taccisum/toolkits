const fs = require('fs')
const execa = require('execa')
const chalk = require('chalk')


module.exports = {
    async handlePatch(patch, opts, tmpDir) {
        const { version: newVersion } = patch.upgrade
        const { groupId, artifactId, version } = patch

        const pomPath = 'open-platform-gateway-provider/pom.xml'

        const lines = String(fs.readFileSync(pomPath)).split('\n')

        let state = 0
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            switch (state) {
                case 0:
                    if (line.match(`.*<groupId>${groupId}</groupId>`)) {
                        state = 1
                    }
                    break
                case 1:
                    if (line.match(`.*<artifactId>${artifactId}</artifactId>`)) {
                        state = 2
                    } else {
                        state = 0
                    }
                    break
                case 2:
                    console.log(chalk.bold.green('Found dependency. Do upgrade now...'))
                    if (line.match(/.*<version>.*<\/version>/)) {
                        lines[i] = line.replace(/<version>.*<\/version>/, `<version>${newVersion}</version>`)
                        state = 3
                    }
                    break
                default:
                    break
            }

            if (state === 3) {
                break
            }
        }

        if (state !== 3) {
            console.log(chalk.bold.bgRed('Dependency not found.'))
            process.exit()
        }

        fs.writeFileSync(pomPath, lines.reduce((p, n) => `${p}\n${n}`))

        await execa('git', [ 'diff'], {
            stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
        })
    }
}
