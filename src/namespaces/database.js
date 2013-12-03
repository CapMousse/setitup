/*
 * Setitup
 * https://github.com/CapMousse/setitup
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

var drivers = require('../database');
var log = require('clifier').helpers.log;

function Database(commands, rootDir, next){
    if (void(0) === commands) {
        throw new Error('commands required');
    }

    if (void(0) === rootDir) {
        throw new Error('rootDir required');
    }

    this.commands = commands;
    this.rootDir = rootDir;
    this.next = next || function(){};
}

Database.prototype.getDriver = function() {
    if (this.commands.driver === void(0) || this.commands.name === void(0)) {
        return this.next();
    }

    if (drivers[this.commands.driver] === void(0)) {
        log.error("     Database driver " + this.commands.driver + " doen't exists");
        return this.next();
    }

    return new drivers[this.commands.driver](this.commands, this.rootDir, this.next);
};

Database.prototype.doctor = function(){
    var driver = this.getDriver();

    return driver.doctor();
};

Database.prototype.run = function(){
    var driver = this.getDriver();


    return driver.run();
};

module.exports = Database;