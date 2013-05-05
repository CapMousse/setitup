'use strict';

var exec = require('child_process').exec;
var colors = require('../../utils/consoleColors');
var queue = require('../../utils/queue');

module.exports = function(commands, rootDir, next){
    var gem, version;

    for (gem in commands) {
        version = (commands[gem] !== true && commands[gem] !== 'pre') ? commands[gem] : false;

        (function(gem, version){
            exec('gem list ' + gem +' -i ' + (version ? '-v ' + version : ''), queue.add('gem', function(err, stdout, stderr){
                if ( true === /^true/.test(stdout)) {
                    return console.log(colors.green + "\tGem " + gem + " already installed");
                }

                exec('gem install '+gem + (version ? ' -v' + commands[gem] : ''), queue.add('gem', function(err, stdout, stderr){
                    return console.log(colors.white + "\tGem " + gem + " installed");
                }));
            }));    
        })(gem, version);
    }

    queue.done('gem', next);
};