'use strict';

var fs = require('fs');
var yaml = require('js-yaml');
var exec = require('child_process').exec;
var queue = require('../utils/queue');
var colors = require('../utils/consoleColors');
var namespaces = require('../namespaces');
var currentDir = process.cwd();

function checkConfig(){
    if (fs.existsSync(currentDir+'/setitup.config') === false) {
        console.log("The setitup.config file doesn't exist");
        return false;
    }

    return true;
}

function getConfig(){
    var configContent = fs.readFileSync(currentDir+'/setitup.config');

    return yaml.load(configContent.toString());
}

function checkGit(git){
    if (typeof git !== 'string') {
        return;
    }

    console.log(colors.green + "-->" + colors.white + " Checking if git repository exists " + colors.reset);
    exec('git ls-remote '+git, queue.add('checkConfig', function(error){
        if (error) {
            console.log(colors.red + "The repository " + colors.white + git + colors.red + " doesn't exists" + colors.reset);
            process.exit();
        }
    }));
}

function checkoutGit(git){
    console.log(colors.green + "-->" + colors.white + " Checking out git repository " + colors.reset);

    exec('git clone ' + git + ' ' + currentDir, queue.add('checkoutGit', function(error, stdout, stderr){
        if (error) {
            console.log(colors.red + "Error while cloning repository" + colors.reset);
            console.log(stderr);
            process.exit();
        }
    }));
}

function checkOutput(output){
    if (typeof output !== "string") {
        return;
    }

    if (fs.existsSync(currentDir + "/" + output) === false) {
        console.log(colors.green + "-->" + colors.white + " Creating dir for git repository " + colors.reset);
        fs.mkdirSync(currentDir + "/" + output);
        currentDir  = currentDir + "/" + output;
    }
}

function runInstall(askedNamespace, callback){
    var iterator = -1,
        callQueue = [],
        next = function(){
            if (iterator < callQueue.length - 1) {
                iterator++;
                callQueue[iterator].shift().apply(this, callQueue[iterator]);
            }
        },
        callNamespace = function(namespace, config, custom) {
            console.log(colors.green + "-->" + colors.white + " Processing " + (custom ? "custom " : "") + namespace + colors.reset);
            namespaces[namespace](config, currentDir, next);
        },
        config, namespace, customNamespaces = [];

    if (checkConfig() === false) {
        return;
    }

    config = getConfig();

    if (fs.existsSync(currentDir + "/setitup.js") !== false) {
        customNamespaces = require(currentDir + "/setitup.js");
    }

    for (namespace in config) {

        if (typeof askedNamespace === 'string' && namespace !== askedNamespace) {
            continue;
        }

        if (void(0) === namespaces[namespace] && void(0) === customNamespaces[namespace]) {
            console.log(colors.white + "Namespace "+ colors.red + namespace + colors.white +" doesn't exists" + colors.reset );
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
    }

    next();
}

module.exports = function(git, output, namespace, callback) {
    queue.done('checkoutGit', function(){
        runInstall(namespace, callback);
    });

    queue.done('checkConfig', function(){
        if (typeof git === 'string') {
            return queue.add('checkoutGit', checkoutGit)(git);
        }
        
        return queue.run('checkoutGit');
    });

    queue.add('checkConfig', checkConfig)();
    queue.add('checkConfig', checkOutput)(output);
    queue.add('checkConfig', checkGit)(git); 
    
};