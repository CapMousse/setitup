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
var utils = require('../utils');
var currentDir = process.cwd();
var namespaces = require('../namespaces');

function Doctor(askedNamespace, callback){
    var config, namespace, customNamespaces = [];
    var callNamespace = function(namespace, config, custom) {
        var next = function(){
            utils.stack.tick('callNamespace');
        };

        log.write(log.style("-->", 'green') + log.style(" Processing " + (custom ? "custom " : "") + namespace + "\n", 'white'));

        if (custom) {
            (new customNamespaces[namespace](config, currentDir, next)).doctor();
        } else {
            (new namespaces[namespace](config, currentDir, next)).doctor();
        }
    };

    //check if a config file is defined
    if (utils.config.checkConfig() === false) {
        process.exit();
    }

    config = utils.config.getConfig();

    //check if a custom command file is defined
    if (fs.existsSync(currentDir + "/setitup.js") !== false) {
        customNamespaces = require(currentDir + "/setitup.js");
    }

    //check if the user want to check a specific namespace
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
            utils.stack.addToStack('callNamespace', callNamespace, [namespace, config[namespace], false]);
        }

        if (void(0) !== customNamespaces[namespace]) {
            utils.stack.addToStack('callNamespace', callNamespace, [namespace, config[namespace], true]);
        }
    }

    if (void(0) !== callback && typeof callback === "function") {
        utils.stack.addToStack('callNamespace', callback);
    } else {
        utils.stack.addToStack('callNamespace', process.exit);
    }

    utils.stack.tick('callNamespace');
}

module.exports = function(namespace, callback){
    new Doctor(namespace, callback);
};
