'use strict';

var fs = require('fs');
var toml = require('toml');
var exec = require('child_process').exec;
var queue = require('../utils/queue');
var colors = require('../utils/consoleColors');
var namespaces = require('./namespaces');
var currentDir = process.cwd();

function checkConfig(){
    if (fs.existsSync(currentDir+'/setitup.config') === false) {
        console.log("The setitip.config file doesn't exist");
        return false;
    }

    return true;
}

function getConfig(){
    var configContent = fs.readFileSync(currentDir+'/setitup.config');

    return toml.parse(configContent);
}

function checkGit(git){
    if (typeof git != 'string'){
        return;
    }

    console.log(colors.green + "-->" + colors.white + " Checking if git repository exists " + colors.reset);
    exec('git ls-remote '+git, queue.add('install', function(error, stdout, stderr){
        if (error) {
            console.log(colors.red + "The repository " + colors.white + git + colors.red + " doesn't exists" + colors.reset);
            process.exit();
        }
    }));
}

function checkOutput(output){
    if (typeof output != "string") {
        return;
    }

    if (fs.existsSync(currentDir + "/" + output) === false) {
        console.log(colors.green + "-->" + colors.white + " Creating dir for git repository " + colors.reset);
        fs.mkdirSync(currentDir + "/" + output);
        currentDir  = currentDir + "/" + output;
    }
}

function checkoutGit(git, callback){
    console.log(colors.green + "-->" + colors.white + " Checking out git repository " + colors.reset);

    exec('git clone ' + git + ' ' + currentDir, function(error, stdout, stderr){
        if (error) {
            console.log(colors.red + "Error while cloning repository" + colors.reset);
            console.log(stderr);
        } else {
            callback();
        }
    });
}

function runInstall(){
    var config, namespace, customNamespaces;

    if (checkConfig() === false) {
        return
    }

    config = getConfig();

    if (fs.existsSync(currentDir + "/setitup.js") !== false) {
        customNamespaces = require(currentDir + "/setitup.js");
    }

    for (namespace in config) {
        if (namespaces[namespace] == void(0) && customNamespaces[namespace] == void(0)) {
            console.log(colors.white + "Namespace "+ colors.red + namespace + colors.white +" doesn't exists" + colors.reset );
            continue;
        }

        if (namespaces[namespace]) {
            console.log(colors.green + "-->" + colors.white + " Processing " + namespace + colors.reset)
            namespaces[namespace](config[namespace], currentDir);
        }

        if (customNamespaces[namespace]) {
            console.log(colors.green + "-->" + colors.white + " Processing custom " + namespace + colors.reset)
            customNamespaces[namespace](config[namespace], currentDir);
        }
    }
}

module.exports = function(git, output){
    queue.done('install', function(){
        if (typeof git == 'string') {
            checkoutGit(git, runInstall);
        } else {
            runInstall();
        }
    });

    checkGit(git);
    queue.add('install', checkOutput)(output);
};