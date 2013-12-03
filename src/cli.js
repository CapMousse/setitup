/*
 * Setitup
 * https://github.com/CapMousse/setitup
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

var Clifier = require('clifier');
var pack = require('../package.json');
var commands = require('./commands');

var cli = new Clifier.Cli('setitup', pack.version, pack.description);

cli.addCommand('init', 'Create a new setitup.config file on your project directory', commands.init);

cli.addCommand('install', 'Install a setitup project', commands.install)
    .addArgument('-g', 'a git url to install')
    .addArgument('-o', 'output directory for git install')
    .addArgument('-n', 'install the asked namespace');

cli.addCommand('doctor', 'Check if project can run', commands.doctor)
    .addArgument('-n', 'install the asked namespace');

module.exports = cli;