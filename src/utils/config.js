/*
 * Clifier
 * https://github.com/CapMousse/setitup
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

var fs = require('fs');
var yaml = require('js-yaml');
var log = require('clifier').helpers.log;
var currentDir = process.cwd();

module.exports = {
    checkConfig: function(){
        if (fs.existsSync(currentDir+'/setitup.config') === false) {
            log.error("The setitup.config file doesn't exist\n");
            return false;
        }

        return true;
    },

    getConfig: function(){
        var configContent = fs.readFileSync(currentDir+'/setitup.config');

        return yaml.load(configContent.toString());
    }
};