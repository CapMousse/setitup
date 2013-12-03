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

function Mysql(config, rootDir, end) {
    this.config = config;
    this.rootDir = rootDir;
    this.end = end || function(){};
}

Mysql.prototype.doctor = function(){
    var command = "mysql";
    var _this = this;

    command += " -u" + (this.config.user || 'root');
    command += " -e \"SHOW DATABASES LIKE '" + this.config.name + "'\"";

    exec(command, function(err, stdout) {
        if (err || stdout.toString().length === 0) {
            return _this.end(false);
        }

        _this.end(true);
    });

    return true;
};

Mysql.prototype.run = function(){
    var command = "mysql";
    var _this = this;

    command += " -u" + (this.config.user || 'root');

    if (this.config.password !== void(0)) {
        command += " -p" + this.config.password;
    }

    command += " -e 'CREATE DATABASE IF NOT EXISTS `" + this.config.name + "` CHARACTER SET = \"" + (this.config.charset || 'UFT8') +"\"'";
    log.write("    Creating database " + log.style(this.config.name, 'bold'));

    exec(command, function(err, stdout, stderr) {
        if (err) {
            log.error("    Error while creating database");
            log.write("\t"+stderr);
        }

        _this.end();
    });

    return true;
};

module.exports = Mysql;