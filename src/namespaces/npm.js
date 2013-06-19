/*
 * Clifier
 * https://github.com/CapMousse/setitup
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */
 
'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var log = require('clifier').helpers.log;
var queue = require('../utils/queue');

function Npm(commands, rootDir, next) {
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

Npm.prototype.doctor = function() {
    var dirs, len, i = 0;

    if (!fs.existsSync(this.rootDir + "/node_modules")) {
        log.error('    All NPM module missing, no node_modules dir found\n');
        return this.next();
    }

    dirs = fs.readdirSync(this.rootDir + "/node_modules");

    for (len = dirs.length; i < len; i++) {
        if (dirs[i] === 'bin') {
            continue;
        }
    }


    this.next();
};


Npm.prototype.run = function() {
    var version;
    var callback = function(npm){
        return function(err){
            if (null === err){
                log.write(log.style("    NPM package " + npm + " installed\n", 'green'));
            } else {
                log.error("    Error while installer package\n");
            }
        };
    };

    queue.done('npm', this.next);

    for (var npm in this.commands) {
        version = this.commands[npm] !== true ? this.commands[npm] : false;

        exec('npm install ' + npm + (version ? '@\"' + version + '\"': ''), queue.add('npm', callback(npm)));
    }
};

module.exports = Npm;