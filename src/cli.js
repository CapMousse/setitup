'use strict';

var Clifier = require('clifier');
var pack = require('../package.json');
var commands = require('./commands');

var cli = new Clifier('setitup', pack.version, pack.description);

cli.addCommand('init', 'Create a new setitup.config file on your project directory', commands.init);

cli.addCommand('install', 'Install a setitup project', commands.install)
    .addArgument('-g, --git', 'a git url to install')
    .addArgument('-o, --output', 'output for git install')
    .addArgument('-n, --namespace', 'install the asked namespace');

module.exports = cli;