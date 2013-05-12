'use strict';

var exec = require('child_process').exec;
var colors = require('../utils/consoleColors');

module.exports = function(end, config){
    var command = "mysql";

    command += " -u" + (config.user || 'root');

    if (config.password !== void(0)) {
        command += " -p" + config.password;
    }

    command += " -e 'CREATE DATABASE IF NOT EXISTS `" + config.name + "` CHARACTER SET = \"" + (config.charset || 'UFT8') +"\"'";
    console.log(colors.white + "    Creating database " + colors.green + config.name + colors.reset);

    exec(command, function(err, stdout, stderr) {
        if (err) {
            console.log(colors.red + "    Error while creating database" + colors.reset);
            console.log("\t"+stderr);
        }

        end();
    });
};