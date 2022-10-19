#!/usr/local/bin/node

const fs = require('fs')
const path = require('path')
const { uuid } = require('./utils/id')
const { abs_path } = require('./utils/file')
const chalk = require('chalk')
const execa = require('execa')
const _ = require('lodash')

const { Command, Argument }  = require('commander')

let program = new Command();

program.version('0.1', '-v --version');
program.description('This tool can add a patch for your Maven project very quickly.');
program.usage('[command] [options]');

function err(msg) {
    console.error(msg)
    process.exit()
}

program.command('commit', { isDefault: true })
.description('This tool can add a patch for your Maven project very quickly.')
.option('-f --file <config>', 'config file')
.option('-p --patch-key <key>', 'patch key')
.option('-r --repo <uri>', 'repository uri')
.option('-m --module <module>', 'repository uri')
.option('--push', 'push automatically after patching')
.action(async (opts) => {
    const id = uuid(10);
    const file = opts.file || '~/.mvn_patch.json'
    const { repo, patchKey } = opts
    if (!repo) err('Required option \"repo\"')

    const patchs = JSON.parse(fs.readFileSync(abs_path(file)))
    let patch = patchs[patchKey] || {}
    patch = _.assign({
        type: 'common',
        branch: {
            new: 'chore/mvn_patch',
        },
        commitMsg: 'chore: add patch'
    }, patch)

    let tmpDir = path.join('/tmp', 'toolkits', 'mvn_patch', id)
    fs.mkdirSync(tmpDir, { recursive: true })
    console.log(chalk.bold.blue(`Clone remote repositofy ${repo}`))
    await execa('git', [ 'clone', repo, tmpDir ], {
        stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
    })
    process.chdir(tmpDir)       // Change current work directory to temporary dir
    if (patch.branch.from) {
        console.log(chalk.bold.blue(`Switch to branch ${patch.branch.from}`))
        await execa('git', [ 'checkout', patch.branch.from ], {
            stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
        })
    }

    if (patch.branch.new) {
        console.log(chalk.bold.blue(`Fork new branch ${patch.branch.new}`))
        await execa('git', [ 'checkout', '-b', patch.branch.new ], {
            stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
        })
    }

    const headRef = String(fs.readFileSync(path.join('.git', 'HEAD'))).trim('\n').trim()
    const cb = headRef.replace(/.+heads\//, '')   // extract current branch name

    const handler = require(`./mvn_patch/${patch.type}`)
    await handler.handlePatch(patch, opts, tmpDir)

    await execa('git', [ 'add', '.'], {
        stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
    })
    await execa('git', [ 'commit', '-m', patch.commitMsg ], {
        stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
    })

    if (opts.push) {
        await execa('git', [ 'push', 'origin', cb ], {
            stdin: process.stdin, stdout: process.stdout, stderr: process.stderr
        })
    } else {
        const cp = require('copy-paste')
        cp.copy(`cd ${tmpDir}`, () => {
            console.log(chalk.bold.green(`Now you can go to the work directory '${chalk.white.bgBlue(tmpDir)}'(Jump command has been copied. Try ctrl-v) for more further operations.`))
        })
    }
});

program.parse()
