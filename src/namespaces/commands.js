'use strict';

var exec = require('child_process').exec;
var colors = require('../utils/consoleColors');

module.exports = function(commands, rootDir, next){
    var loop = 0, len, callQueue = [], iterator = -1, 
        tick = function(){
            if (iterator < callQueue.length - 1) {
                iterator++;
                callQueue[iterator].shift().apply(this, callQueue[iterator]);
            }
        },
        execCallback = function(command, tick){
            console.log(colors.green + "    Runing "+command);
            exec(command, function(err, stdout, stderr){
                if (void(0) !== err && null !== err) {
                    console.log(colors.red + "    Error while runing "+command);
                    console.log("    " + stderr.replace("\n", "\n    "));
                }

                tick();
            });
        };

    for(len = commands.length; loop < len; loop++){
        callQueue.push([execCallback, commands[loop], tick]);
    }

    callQueue.push([next]);
    tick();
};