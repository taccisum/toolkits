#!/usr/local/bin/node

const fs = require('fs');
const path = require('path');
const jwt = require('json-web-token');
const { parse_date } = require('./utils/date');

const { Command, Argument } = require('commander');
const { split } = require('lodash');

let program = new Command();

let pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));
program.version(pkg.version, '-v --version');
program.description(pkg.description);
program.usage('[command] [options]');

function base64_decode(s) {
  return Buffer.from(s, 'base64').toString();
}

/**
 * Print these sections which are plaintext
 * @param {*} token JWT Token
 */
function print_plaintext(token) {
  const sections = split(token, '.').slice(0, 2); // the section 3nd is not a plaintext
  const headers_str = sections[0];
  const payload_str = sections[1];

  // base64 decode for the plaintext string
  console.log(`Headers: ${base64_decode(headers_str)}`);

  console.log(`Payload: ${base64_decode(payload_str)}`);

  const payload = JSON.parse(base64_decode(payload_str));
  if (payload.exp) {
    const exp_time = parse_date(payload.exp);
    console.log(`  exp: ${exp_time.toLocaleString('zh-cn')}`);
  }
}

function valid_jwt(token, secret) {
  if (secret) {
    // TODO:: 加密模式待完善
    // decode
    jwt.decode(secret, token, function (err_, decodedPayload, decodedHeader) {
      if (err_) {
        console.error(err_.name, err_.message);
      } else {
        console.log(decodedPayload, decodedHeader);
      }
    });
  } else {
    console.log('--- Validation results:');
    console.log(
      `'secret' is not specified so that validation action has been skipped.`
    );
  }
  return undefined;
}

program
  .command('parse', { isDefault: true })
  .description('')
  .option('-s|--secret [secret]', 'secret')
  .argument('[token]', 'jwt string')
  .action(async (token, opts) => {
    // const test =
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcm12bV9hcHAiLCJleHAiOjE3NjU1MTY4NDIsInV1aWQiOiI5ZGM4YzMzYWQwZDY0MzQ3YmNjMzk3NzlmNzg4YjYyMiIsIm1lcmNoYW50SWQiOjEyNDY4LCJhY2NvdW50SWQiOjg2NDEyMDAxNzcwNDc0MjA1MTksImluc3RhbmNlQ29kZSI6IlZNMDEwMTUwMjUyMjUwIn0.bq8DGo67tuoB2nbe1OxyFedM23WrRSlw-i_QuzLxmlE idcId';
    // token = test;
    secret = opts.secret;

    console.log('--- All plaintext sections:');
    print_plaintext(token);

    valid_jwt(token, secret);
  });

program.parse();

module.exports = {
  parse_date: valid_jwt,
};
