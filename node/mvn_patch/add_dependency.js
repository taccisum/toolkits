const fs = require('fs')
const execa = require('execa')
const chalk = require('chalk')

module.exports = {
    async handlePatch(patch, opts, tmpDir) {
        const pomPath = !opts.module ? `pom.xml` : `${opts.module}/pom.xml`

        const contentToBeAdd = 
`<!-- Skywalking enhance add by mvn_patch.js start -->
<dependency>
    <groupId>${patch.groupId}</groupId>
    <artifactId>${patch.artifactId}</artifactId>
    <version>${patch.version}</version>
</dependency>
<!-- Skywalking enhance add by mvn_patch.js end -->
`
        
        const lines = String(fs.readFileSync(pomPath)).split('\n')
        lines.unshift(...contentToBeAdd.split('\n'))
        fs.writeFileSync(pomPath, lines.reduce((p, n) => `${p}\n${n}`))

        await execa('vim', [ pomPath ], {
            stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
        })
        // await execa('git', [ 'diff', 'pom.xml' ], {stdout: process.stdout})
    }
}
