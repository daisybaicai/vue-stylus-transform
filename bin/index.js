#!/usr/bin/env node

const commander = require('commander');
const program = new commander.Command();

program
  .version(require('../package.json').version)
  .usage("<command> [options] ")


  program
    .command('create')
    .description('')
    .action((...args) => require('../lib/commands/create')(...args));

program.parse(process.argv);


