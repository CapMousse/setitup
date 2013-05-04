'use strict';

var program = require('commander');
var commands = require('./commands');

program.version(require('../package.json').version);

program
    .command('init')
    .description('Create a new setitup.config file on your project directory')
    .action(commands.init);

program
    .command('install')
    .description('Install a setitup project')
    .option('-g', 'a git url to install')
    .option('-o', 'output for git install')
    .action(commands.install);

program
    .command('doctor')
    .description('Check if the current project can run on your environment')
    .action(commands.doctor);

program
    .command('update')
    .description('Update dependencies to their lastest versions')
    .action(commands.update);

exports.run = function(){
    var args = process.argv.slice();

    if (args[2] == void(0)) {
        program.help();
    } else {
        program.parse(args);
    }
};