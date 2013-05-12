'use strict';

var fs = require('fs');
var cli = require('../src/cli.js');

exports.testCommands = function(test) {
    test.expect(4);

    var log = [];
    var oldConsoleLog = console.log;
    console.log = function() {
        log.push([].slice.call(arguments));
    };

    process.argv = []; //empty argv to prevent argument from grunt to get to clifier

    cli.run();
    test.equal(log[0], '\nsetitup v0.0.6\nLocal environment project setup made easy\n\nUsage : setitup [command] [options]\n\nCommand list : \n    init                Create a new setitup.config file on your project directory\n    install [options]      Install a setitup project\n        -g, --git\ta git url to install\n        -o, --output\toutput for git install\n        -n, --namespace\tinstall the asked namespace\n    help                Show help for setitup\n');

    log = [];
    cli.run('install');
    test.equal(log[0], 'The setitup.config file doesn\'t exist');

    log = [];
    cli.run('init');
    test.equal(log[0], void(0));

    log = [];
    cli.run('init');
    test.equal(log[0], 'The file setitup.config already exists');

    test.done();

    //remove setitup.config test file generated by init command
    fs.unlinkSync(process.cwd() + '/setitup.config');
    console.log = oldConsoleLog;
};