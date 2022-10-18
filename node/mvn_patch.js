#!/usr/local/bin/node

const fs = require('fs')
const path = require('path')
const { uuid } = require('./utils/id')
const { abs_path } = require('./utils/file')
const chalk = require('chalk')
const execa = require('execa')

const { Command, Argument }  = require('commander')

let program = new Command();

program.version('0.1', '-v --version');
program.description('Add patch for you maven pom.');
program.usage('[command] [options]');

function err(msg) {
    console.error(msg)
    process.exit()
}

program.command('commit', { isDefault: true })
.description('此工具可以帮你快速向一个 Maven 项目添加 补充')
.option('-f --file <config>', 'config file')
.option('-p --patch-key <key>', 'patch key')
.option('-r --repo <uri>', 'repository uri')
.option('-m --module <module>', 'repository uri')
.action(async (opts) => {
    const id = uuid(10);
    const file = opts.file || '~/.mvn_patch.json'
    const { repo, patchKey, module } = opts
    if (!repo) err('Required option \"repo\"')
    if (!patchKey) err('Required option \"patch\"')

    const patchs = JSON.parse(fs.readFileSync(abs_path(file)))
    const patch = patchs[patchKey]

    let tmpDir = path.join('/tmp', 'toolkits', 'mvn_patch', id)
    fs.mkdirSync(tmpDir, { recursive: true })
    await execa('git', [ 'clone', repo, tmpDir ], {
        stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
    })
    process.chdir(tmpDir)
    console.log(process.cwd())
    await execa('git', [ 'checkout', '-b', 'chore/mvn_patch' ], {
        stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
    })

    const pomPath = !module ? `pom.xml` : `${module}/pom.xml`

    const contentToBeAdd = 
`<!-- Skywalking enhance add by mvn_patch.js start -->
<dependency>
    <groupId>${patch.groupId}</groupId>
    <artifactId>${patch.artifactId}</artifactId>
    <version>${patch.version}</version>
</dependency>
<!-- Skywalking enhance add by mvn_patch.js end -->`
    
    const lines = String(fs.readFileSync(pomPath)).split('\n')
    lines.unshift(...contentToBeAdd.split('\n'))
    fs.writeFileSync(pomPath, lines.reduce((p, n) => `${p}\n${n}`))

    await execa('vim', [ pomPath ], {
        stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
    })
    // await execa('git', [ 'diff', 'pom.xml' ], {stdout: process.stdout})

    await execa('git', [ 'add', '.'], {
        stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
    })
    await execa('git', [ 'commit', '-m', patch.commitMsg || 'chore: add patch' ], {
        stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
    })

    console.log(chalk.bold.green(`Now you can go to directory '${chalk.blue(tmpDir)}' for more further operations.`))
});

program.parse()
