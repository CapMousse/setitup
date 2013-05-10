'use strict';

var drivers = require('../database');
var colors = require('../utils/consoleColors');

module.exports = function(commands, rootDir, next){

    if (commands.driver === void(0) || commands.name === void(0)) {
        return next();
    }

    if (drivers[commands.driver] === void(0)) {
        console.log(colors.red + "\t Database driver " + colors.white + commands.driver + colors.red + " doen't exists" + colors.reset);
        return next();
    }

    drivers[commands.driver](next, commands.name, commands.charset || 'utf8', commands.user, commands.password);
};