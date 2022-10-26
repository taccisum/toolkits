const fs = require('fs')
const path = require('path')
const execa = require('execa')
const chalk = require('chalk')

function _upgrade(pom, groupId, artifactId, newVersion) {
    const lines = String(fs.readFileSync(pom)).split('\n')

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

    fs.writeFileSync(pom, lines.reduce((p, n) => `${p}\n${n}`))
}

module.exports = {
    async handlePatch(patch, opts, tmpDir) {
        const { groupId, artifactId } = patch
        const { version: newVersion } = patch.upgrade

        const poms = fs.readdirSync(tmpDir)
            .filter(f => !f.startsWith('.'))        // ignore hidden dir & parent dir
            .filter(f => fs.statSync(f).isDirectory())      // ignore non-directory file
            .map(d => path.join(d, 'pom.xml'))      // map to relative pom path
            .filter(pom => fs.existsSync(pom))      // ignore pom not existed 
        if (fs.statSync('pom.xml').isFile()) {
            poms.unshift('pom.xml')     // add root pom.xml
        }

        poms.forEach(pom => {
            // for-each all pom.xml n' find target dependency to upgrade
            _upgrade(pom, groupId, artifactId, newVersion)
        })

        // show changes
        await execa('git', [ 'diff'], {
            stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
        })
    }
}
