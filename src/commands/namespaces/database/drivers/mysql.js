'use strict';

var exec = require('child_process').exec;
var colors = require('../../../../utils/consoleColors');

module.exports = function(end, name, charset, user, password){
    var command = "mysql";

    command += " -u" + (user || 'root');

    if (password != void(0)) {
        command += " -p" + password;
    }

    command += " -e 'CREATE DATABASE IF NOT EXISTS `" + name + "` CHARACTER SET = \"" + charset +"\"'";
    console.log(colors.white + "\tCreating database " + colors.green + name + colors.reset);

    exec(command, function(err, stdout, stderr) {
        if (err) {
            console.log(colors.red + "\tError while creating database" + colors.reset);
            console.log("\t"+stderr);
        }

        end();
    });
};