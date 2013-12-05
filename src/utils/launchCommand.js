/*
 * Setitup
 * https://github.com/CapMousse/setitup
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */
'use strict';

var fs = require('fs');
var log = require('clifier').helpers.log;
var currentDir = process.cwd();
var namespaces = require('../namespaces');
var stack = require('./stack');
var configTool = require('./config');
var drivers = require('../database');

function LaunchCommand (askedNamespace, command, callback) {
    var config, customNamespaces = [];
    var callNamespace = function(namespace, config, custom) {
        var next = function(){
            stack.tick('callNamespace');
        };
        var loadDrivers = namespace === "database";

        log.write(log.style("-->", 'green') + log.style(" Processing " + (custom ? "custom " : "") + namespace + "\n", 'white'));

        if (custom) {
            (new customNamespaces[namespace](config, currentDir, loadDrivers ? drivers : next, loadDrivers ? next : void 0))[command]();
        } else {
            (new namespaces[namespace](config, currentDir, loadDrivers ? drivers : next, loadDrivers ? next : void 0))[command]();
        }
    };

    //check if a config file is defined
    if (configTool.checkConfig() === false) {
        process.exit();
    }

    config = configTool.getConfig();

    //check if a custom command file is defined
    if (fs.existsSync(currentDir + "/setitup.js") !== false) {
        var custom = require(currentDir + "/setitup.js");
        customNamespaces = custom.namespaces || {};

        for (var i in custom.drivers) {
          drivers[i] = custom.drivers[i];
        }
    }

    //check if the user want to check a specific namespace
    if (typeof askedNamespace === 'string' && Object.keys(config).indexOf(askedNamespace) === -1) {
        log.error("Namespace "+ askedNamespace +" not found in config file");
        process.exit();
    }

    for (var namespace in config) {

        if (typeof askedNamespace === 'string' && namespace !== askedNamespace) {
            continue;
        }

        if (void(0) === namespaces[namespace] && void(0) === customNamespaces[namespace]) {
            log.error("Namespace " + namespace + " doesn't exists\n");
            continue;
        }

        if (void(0) !== namespaces[namespace]) {
            stack.addToStack('callNamespace', callNamespace, [namespace, config[namespace], false]);
        }

        if (void(0) !== customNamespaces[namespace]) {
            stack.addToStack('callNamespace', callNamespace, [namespace, config[namespace], true]);
        }
    }

    if (void(0) !== callback && typeof callback === "function") {
        stack.addToStack('callNamespace', callback);
    } else {
        stack.addToStack('callNamespace', process.exit, [1]);
    }

    stack.tick('callNamespace');
}

module.exports = LaunchCommand;