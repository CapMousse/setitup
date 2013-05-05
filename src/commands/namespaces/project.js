'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var queue = require('../../utils/queue');
var colors = require('../../utils/consoleColors');

function checkoutBranch(branch){
    exec('git checkout ' + branch, queue.add('project', function(error, stdout, stderr){
        if (error) {
            console.log(colors.red + "\tError while checkout git" + colors.reset);
            console.log(stderr);
            return;
        }

        exec('git pull origin ' + branch, queue.add('project', function(error, stdout, stderr){
            if (error) {
                console.log(colors.red + "\tError while pulling branch" + colors.reset);
                console.log(stderr);
            }            
        }));
    }));
}

function createVhost(host, port, root){
    var vhost = "<VirtualHost *:" + port + ">\n\tServerName " + host + "\n\tDocumentRoot \"" + root + "\"\n</VirtualHost>", error;

    console.log(colors.green + "\tWriting virtual host" + colors.reset);

    if (fs.existsSync("/etc/apache2/extra") && fs.existsSync("/etc/apache2/extra/httpd-vhosts.conf")) {
        try{
            fs.appendFileSync("/etc/apache2/extra/httpd-vhosts.conf", "\n" + vhost);
            console.log(colors.green + "\tYou can restart apache to enable your new virtual host" + colors.reset);
        } catch (error) {
            console.log(colors.red + "\tError while writing virtual host, try using sudo" + colors.reset);
        }
        return;
    }

    if (fs.existsSync("/etc/apache2/sites-available/")) {
        fs.writeFileSync("/etc/apache2/sites-available/" + host + ".conf", vhost);

        exec("ln -s /etc/apache2/sites-available/" + host + ".conf /etc/apache2/sites-enabled/" + host + ".conf", queue.add('project', function(error, stdout, stderr){
            console.log(colors.green + "\tYou can restart apache to enable your new virtual host" + colors.reset);
        }));

        return;
    }

    console.log(colors.red + "\t No virtual host file found " + colors.reset);
}

module.exports = function(args, rootDir, next){

    if (args.branch) {
        queue.add('project', checkoutBranch)(args.branch);
    }

    if (args.host) {
        queue.add('project', createVhost)(args.host, args.port || 80, rootDir + '/' + (args.root || ''));
    }

    queue.done('project', next);
}