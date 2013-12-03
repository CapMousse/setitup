/*
 * Setitup
 * https://github.com/CapMousse/setitup
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

var exec = require('child_process').exec;
var log = require('clifier').helpers.log;
var stack = require('../utils/stack.js');

function Commands(commands, rootDir, next) {
    if (void(0) === commands) {
        throw new Error('commands required');
    }

    if (void(0) === rootDir) {
        throw new Error('rootDir required');
    }

    this.commands = commands;
    this.rootDir = rootDir;
    this.next = next || function(){};
}

Commands.prototype.doctor = function(){
    log.warning("    Commands can't be \"doctor\"");
    this.next();
    return true;
};

Commands.prototype.run = function(){
    var loop = 0;
    var len = this.commands.length;
    var execCallback = function(command){
        log.write(log.style("    Runing "+command, 'green'));

        exec(command, function(err, stdout, stderr){
            if (void(0) !== err && null !== err) {
                log.error("    Error while runing "+command);
                log.error("    " + stderr.replace("\n", "\n    "));
            }

            stack.tick('commands');
        });
    };


    for(; loop < len; loop++){
        stack.addToStack('commands', execCallback, [this.commands[loop]]);
    }

    stack.addToStack('commands', this.next);
    stack.tick('commands');
};

module.exports = Commands;