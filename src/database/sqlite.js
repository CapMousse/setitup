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

function Sqlite(config, rootDir, end) {
    this.config = config;
    this.rootDir = rootDir;
    this.end = end || function(){};
}

Sqlite.prototype.doctor = function(){
    if (fs.existsSync(this.rootDir + '/' + (this.config.dir ? this.config.dir + "/" : '' ) + this.config.name) === false) {
        return this.end(false);
    }

    this.end(true);
};

Sqlite.prototype.run = function(){
    log.write("    Creating SQLITE database " + log.style(this.config.name, 'bold'));

    fs.openSync(this.rootDir + '/' + (this.config.dir ? this.config.dir + "/" : '' ) + this.config.name, 'a');
    
    this.end();
};

module.exports = Sqlite;