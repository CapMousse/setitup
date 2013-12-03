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
var stack = require('../utils').stack;

function Project(commands, rootDir, next) {
    if (void(0) === commands) {
        throw new Error('commands required');
    }

    if (void(0) === rootDir) {
        throw new Error('rootDir required');
    }

    this.commands = commands;
    this.rootDir = rootDir;
    this.next = next || function(){};

    //For vhost, we must use Absolute path
    this.commands.root = this.rootDir + '/' + (this.commands.root || '');
}

Project.prototype.doctor = function() {
    var result = true;
    var _this = this;

    if (this.commands.host){
        result = this.checkVhost.call(_this) && result;
    }

    return result;
};

Project.prototype.run = function() {
    if (this.commands.host) {
        stack.addToStack('project', function(){
            this.createVhost();
            stack.tick('project');
        });
    }

    stack.addToStack('project', this.next);
    stack.tick('project');
};

Project.checkVhost = function() {
    var vhost = "<VirtualHost *:" + this.commands.port + ">\n    ServerName " + this.commands.host + "\n    DocumentRoot \"" + this.commands.root + "\"\n</VirtualHost>";

    if (
        !fs.existsSync("/etc/apache2/extra") &&
        !fs.existsSync("/etc/apache2/extra/httpd-vhosts.conf") &&
        !fs.existsSync("/etc/apache2/sites-available/")
    ) {
        return false;
    }

    if (
        !fs.existsSync("/etc/apache2/sites-available/" + this.commands.host + ".conf") &&
        fs.readFileSync('/etc/apache2/extra/httpd-vhosts.conf').toString().indexOf(vhost) !== -1
    ) {
        return false;
    }

    return true;
};

Project.prototype.createVhost = function(){
    var vhost = "<VirtualHost *:" + this.commands.port + ">\n    ServerName " + this.commands.host + "\n    DocumentRoot \"" + this.commands.root + "\"\n</VirtualHost>";
    var content;

    log.write("    Writing virtual host");

    // Check if current system use Vhost as apache2 etra vhost file
    if (fs.existsSync("/etc/apache2/extra") && fs.existsSync("/etc/apache2/extra/httpd-vhosts.conf")) {
        content = fs.readFileSync('/etc/apache2/extra/httpd-vhosts.conf');

        // Check if Vhost is already defined
        if (content.toString().indexOf(vhost) !== -1) {
            log.warning("    Virtual host already exists");
            return;
        }

        // Sometime, current user can't write on vhost file
        try{
            fs.appendFileSync("/etc/apache2/extra/httpd-vhosts.conf", "\n" + vhost);
            log.write(log.style("    You can restart apache to enable your new virtual host", 'green'));
        } catch (error) {
            log.error("    Can't write on virtual host file, try using sudo");
        }

        return;
    }

    // Check if current system use apache2 with a2site
    if (fs.existsSync("/etc/apache2/sites-available/")) {

        //Check if current host is already defined
        if (fs.existsSync("/etc/apache2/sites-available/" + this.commands.host + ".conf")) {
            log.warning("    Virtual host already exists");
            return;
        }

        fs.writeFileSync("/etc/apache2/sites-available/" + this.commands.host + ".conf", vhost);

        exec("ln -s /etc/apache2/sites-available/" + this.commands.host + ".conf /etc/apache2/sites-enabled/" + this.commands.host + ".conf", stack.addToStack('project', function(){
            log.write(log.style("    You can restart apache to enable your new virtual host", 'green'));
            stack.tick('project');
        }));

        return;
    }

    log.error("     No virtual host file found ");
};

module.exports = Project;
