/*
 * Clifier
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
    var iterator = -1,
        callQueue = [],
        next = function(){
            if (iterator < callQueue.length - 1) {
                iterator++;
                callQueue[iterator].shift().apply(this, callQueue[iterator]);
            }
        },
        callNamespace = function(namespace, config, custom) {
            log.write(log.style("-->", 'green') + log.style(" Processing " + (custom ? "custom " : "") + namespace + "\n", 'white'));

            if (custom) {
                (new customNamespaces[namespace](config, currentDir, next)).doctor();
            } else {
                (new namespaces[namespace](config, currentDir, next)).doctor();
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
            callQueue.push([callNamespace, namespace, config[namespace], false]);
        }

        if (void(0) !== customNamespaces[namespace]) {
            callQueue.push([callNamespace, namespace, config[namespace], true]);
        }
    }

    if (void(0) !== callback && typeof callback === "function") {
        callQueue.push([callback]);
    } else {
        callQueue.push([process.exit]);
    }

    next();
}

module.exports = function(namespace, callback){
    new Doctor(namespace, callback);
};
