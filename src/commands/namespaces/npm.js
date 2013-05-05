'use strict';

var exec = require('child_process').exec;
var colors = require('../../utils/consoleColors');
var queue = require('../../utils/queue');

module.exports = function(commands, rootDir, next){
	var npm, version;

	for (npm in commands) {
		version = commands[npm] !== true ? commands[npm] : false;

		(function(npm, version){
			exec('npm install ' + npm + (version ? '@\"' + version + '\"': ''), queue.add('npm', function(err, stdout, stderr){
				if (void(0) !== err){
					console.log(colors.green + "\tNPM package " + npm + " installed");
				} else {
					console.log(colors.red + "\tError while installer package " + npm);
				}
				
			}));	
		})(npm, version);
	}

	queue.done('npm', next);
};