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
    var next = function(){
            utils.stack.tick('install');
        },
        callNamespace = function(namespace, config, custom) {
            log.write(log.style("-->", 'green') + log.style(" Processing " + (custom ? "custom " : "") + namespace + "\n", 'white'));
            
            if (custom) {
                (new customNamespaces[namespace](config, currentDir, next)).run();
            } else {
                (new namespaces[namespace](config, currentDir, next)).run();
            }
        },
        config, namespace, customNamespaces = [];

    if (utils.config.checkConfig() === false) {
        return;
    }

    config = utils.config.getConfig();

    if (fs.existsSync(currentDir + "/setitup.js") !== false) {
        customNamespaces = require(currentDir + "/setitup.js");
    }

    if (typeof askedNamespace === 'string' && Object.keys(config).indexOf(askedNamespace) === -1) {
        log.error("Namespace "+ askedNamespace +" not found in config file");
        process.exit();
    }

    for (namespace in config) {

        if (typeof askedNamespace === 'string' && namespace !== askedNamespace) {
            continue;
        }

        if (void(0) === namespaces[namespace] && void(0) === customNamespaces[namespace]) {
            log.error("Namespace " + namespace + " doesn't exists\n");
            continue;
        }

        if (void(0) !== namespaces[namespace]) {
            utils.stack.addToStack('install', callNamespace, [namespace, config[namespace], false]);
        }

        if (void(0) !== customNamespaces[namespace]) {
            utils.stack.addToStack('install', callNamespace, [namespace, config[namespace], true]);
        }
    }

    if (void(0) !== callback && typeof callback === "function") {
        utils.stack.addToStack('install', callback);
    } else {
        utils.stack.addToStack('install', process.exit);
    }

    utils.stack.tick('install');
};

module.exports = function(git, output, namespace, callback){
    new Install(git, output, namespace, callback);
};
