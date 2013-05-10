'use strict';

var exec = require('child_process').exec;
var colors = require('../utils/consoleColors');
var queue = require('../utils/queue');


function installGem(gem, version){
    exec('gem list ' + gem +' -i ' + (version ? '-v ' + version : ''), queue.add('gem', function(err, stdout){
        if (err) {
            return console.log(colors.red + "\tError while listing gems");
        }

        if (true === /^true/.test(stdout)) {
            return console.log(colors.green + "\tGem " + gem + " already installed");
        }

        exec('gem install '+gem + (version ? ' -v' + version : ''), queue.add('gem', function(err){
            if (err) {
                return console.log(colors.red + "\tError while installer gem : " + gem);   
            }

            return console.log(colors.white + "\tGem " + gem + " installed");
        }));
    }));    
}

module.exports = function(commands, rootDir, next){
    var gem, version;

    for (gem in commands) {
        version = (commands[gem] !== true && commands[gem] !== 'pre') ? commands[gem] : false;

        installGem(gem, version);
    }

    queue.done('gem', next);
};