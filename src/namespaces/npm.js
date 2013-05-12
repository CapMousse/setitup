'use strict';

var exec = require('child_process').exec;
var colors = require('../utils/consoleColors');
var queue = require('../utils/queue');

function installNpm(npm, version){
    exec('npm install ' + npm + (version ? '@\"' + version + '\"': ''), queue.add('npm', function(err){
        if (void(0) !== err){
            console.log(colors.green + "    NPM package " + npm + " installed");
        } else {
            console.log(colors.red + "    Error while installer package " + npm);
        }
        
    }));
}

module.exports = function(commands, rootDir, next){
    var npm, version;

    for (npm in commands) {
        version = commands[npm] !== true ? commands[npm] : false;

        installNpm(npm, version);
    }

    queue.done('npm', next);
};