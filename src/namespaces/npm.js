/*
 * Setitup
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

function Npm(packages, rootDir, next) {
    if (void(0) === packages) {
        throw new Error('commands required');
    }

    if (void(0) === rootDir) {
        throw new Error('rootDir required');
    }

    this.packages = packages;
    this.rootDir = rootDir;
    this.next = next || function(){};
}

Npm.prototype.doctor = function() {
    var _this = this;
    var pack, version;

    if (!fs.existsSync(this.rootDir + "/node_modules")) {
        log.error('    All NPM module missing, no node_modules dir found\n');
        return this.next();
    }

    queue.done('npm', _this.next);

    for (pack in this.packages) {
        version = (this.packages[pack] !== true && this.packages[pack] !== 'pre') ? this.packages[pack] : false;

        this.checkPackage(pack, version);
    }

    this.next();
};

Npm.prototype.checkPackage = function(pack, version) {
    exec('npm list '+ pack, queue.add('npm', function(err, stdout){
        if (err) {
            console.log(err);
            log.error("    Error while listing npm ("+pack+")\n");
            return;
        }

        if (true === /\(empty\)/.test(stdout) || (version !== void 0 && -1 === stdout.test('@'+version))) {
            log.error("    Npm " + pack + " missing\n");
        } else {
            log.write("    Npm " + pack + " already installed");
        }
    }));
};

Npm.prototype.run = function() {
    var version;
    var callback = function(pack){
        return function(err){
            if (null === err){
                log.write(log.style("    NPM package " + pack + " installed\n", 'green'));
            } else {
                log.error("    Error while installing package ("+pack+")\n");
            }
        };
    };

    queue.done('npm', this.next);

    for (var pack in this.packages) {
        version = this.packages[pack] !== true ? this.packages[pack] : false;

        exec('npm install ' + pack + (version ? '@\"' + version + '\"': ''), queue.add('npm', callback(pack)));
    }
};

module.exports = Npm;