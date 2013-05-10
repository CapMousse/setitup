'use strict';

var exec = require('child_process').exec;
var colors = require('../utils/consoleColors');

module.exports = function(commands, rootDir, next){
    var loop = 0, len, callQueue = [], iterator = -1, 
        tick = function(){
            if (iterator < callQueue.length - 1) {
                iterator++;
                callQueue[iterator][0](callQueue[iterator][1], callQueue[iterator][2]);
            }
        },
        execCallback = function(command, tick){
            console.log(colors.green + "\tRuning "+command);
            exec(command, function(err){
                if (void(0) !== err) {
                    console.log(colors.red + "\tError while runing "+command);
                }

                tick();
            });
        };

    for(len = commands.length; loop < len; loop++){
        callQueue.push([execCallback, commands[loop], tick]);
    }

    callQueue.push([next, undefined, undefined]);
    tick();
};