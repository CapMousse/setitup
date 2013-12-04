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
var utils = require('../utils');
var namespaces = require('../namespaces');
var currentDir = process.cwd();

function Install(git, output, namespace, callback) {
    var _this = this;

    this.git = git;
    this.output = output;
    this.namespace = namespace;
    this.callback = callback;

    utils.queue.done('checkoutGit', function(){
        _this.runInstall(_this.namespace, _this.callback);
    });

    utils.queue.done('checkConfig', function(){
        if (typeof git === 'string') {
            return utils.queue.add('checkoutGit', _this.checkoutGit)(git);
        }
        
        return utils.queue.run('checkoutGit');
    });

    utils.queue.add('checkConfig', utils.config.checkConfig)();
    utils.queue.add('checkConfig', _this.checkOutput)(output);
    utils.queue.add('checkConfig', _this.checkGit)(git); 
}

Install.prototype.checkGit = function(git){
    if (typeof git !== 'string') {
        return;
    }

    log.write(log.style("-->", 'green') + log.style(" Checking if git repository exists\n", 'green'));
    exec('git ls-remote '+git, utils.queue.add('checkConfig', function(error){
        if (error) {
            log.error("The repository " + git +" doesn't exists\n");
            process.exit();
        }
    }));
};

Install.prototype.checkoutGit = function(git){
    log.write(log.style("-->", 'green') + log.style(" Checking out git repository\n", 'green'));

    exec('git clone ' + git + ' ' + currentDir, utils.queue.add('checkoutGit', function(error){
        if (error) {
            log.error("Error while cloning repository\n");
            process.exit();
        }
    }));
};

Install.prototype.checkOutput = function(output){
    if (typeof output !== "string") {
        return;
    }

    if (fs.existsSync(currentDir + "/" + output) === false) {
        log.write(log.style("-->", 'green') + log.style(" Creating dir for git repository\n", 'green'));
        fs.mkdirSync(currentDir + "/" + output);
        currentDir  = currentDir + "/" + output;
    }
};

Install.prototype.runInstall = function(askedNamespace, callback){
    utils.launchCommand(askedNamespace, 'run', callback);
};

module.exports = function(git, output, namespace, callback){
    new Install(git, output, namespace, callback);
};
