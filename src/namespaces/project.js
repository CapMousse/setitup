'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var queue = require('../utils/queue');
var colors = require('../utils/consoleColors');

function checkoutBranch(branch){
    console.log(colors.green + "\tChecking out branch " + colors.white + branch + colors.reset);
    exec('git checkout ' + branch, queue.add('project', function(error, stdout, stderr){
        if (error) {
            console.log(colors.red + "\tError while checkout git" + colors.reset);
            console.log(stderr);
            return;
        }
        
        console.log(colors.green + "\tPulling branch " + colors.white + branch + colors.reset);
        exec('git pull origin ' + branch, queue.add('project', function(error, stdout, stderr){
            if (error) {
                console.log(colors.red + "\tError while pulling branch :" + colors.reset);
                console.log("\t" + stderr.replace("\n", "\n\t"));
            }            
        }));
    }));
}

function createVhost(host, port, root){
    var vhost = "<VirtualHost *:" + port + ">\n\tServerName " + host + "\n\tDocumentRoot \"" + root + "\"\n</VirtualHost>", content;

    console.log(colors.green + "\tWriting virtual host" + colors.reset);

    if (fs.existsSync("/etc/apache2/extra") && fs.existsSync("/etc/apache2/extra/httpd-vhosts.conf")) {
        content = fs.readFileSync('/etc/apache2/extra/httpd-vhosts.conf');

        if (content.toString().indexOf(vhost)) {
            console.log(colors.white + "\tVirtual host already exists" + colors.reset);
            return;
        }

        try{
            fs.appendFileSync("/etc/apache2/extra/httpd-vhosts.conf", "\n" + vhost);
            console.log(colors.green + "\tYou can restart apache to enable your new virtual host" + colors.reset);
        } catch (error) {
            console.log(colors.red + "\tCan't write on virtual host file, try using sudo" + colors.reset);
        }

        return;
    }

    if (fs.existsSync("/etc/apache2/sites-available/")) {
        if(fs.existsSync("/etc/apache2/sites-available/" + host + ".conf")){
            console.log(colors.white + "\tVirtual host already exists" + colors.reset);
            return;
        }

        fs.writeFileSync("/etc/apache2/sites-available/" + host + ".conf", vhost);

        exec("ln -s /etc/apache2/sites-available/" + host + ".conf /etc/apache2/sites-enabled/" + host + ".conf", queue.add('project', function(){
            console.log(colors.green + "\tYou can restart apache to enable your new virtual host" + colors.reset);
        }));

        return;
    }

    console.log(colors.red + "\t No virtual host file found " + colors.reset);
}

module.exports = function(args, rootDir, next){

    if (args.host) {
        queue.add('project', createVhost)(args.host, args.port || 80, rootDir + '/' + (args.root || ''));
    }

    if (args.branch) {
        queue.add('project', checkoutBranch)(args.branch);
    }

    queue.done('project', next);
};