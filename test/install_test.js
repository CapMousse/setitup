'use strict';

var fs = require('fs');
var init = require('../src/commands/init');
var install = require('../src/commands/install');
var Clifier = require("clifier");

exports.testIntall = function(test) {
	test.expect(2);

  var oldExit = process.exit;
  var log = [];
  Clifier.helpers.log.write = function(content) {
      log.push(content);
  };
  process.exit = function(){};
	
	install();
	test.equal(log[0], '\u001b[1m\u001b[31mThe setitup.config file doesn\'t exist\n\u001b[39m\u001b[22m');

	init();

	//try to install command namespace
	log = [];
	install(void(0), void(0), 'commands');
	test.equal(log[0], "\u001b[32m-->\u001b[39m\u001b[37m Processing commands\n\u001b[39m");

  //remove setitup.config test file generated by init command
  fs.unlinkSync(process.cwd() + '/setitup.config');
  process.exit = oldExit;

  test.done();
};