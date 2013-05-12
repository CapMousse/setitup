'use strict';

var fs = require('fs');
var colors = require('../utils/consoleColors');

module.exports = function(end, config){
    console.log(colors.white + "    Creating SQLITE database " + colors.green + config.name + colors.reset);

    fs.openSync( process.cwd() + '/' + (config.dir ? config.dir + "/" : '' ) + config.name, 'a');
    
    end();
};