/*
 * Setitup
 * https://github.com/CapMousse/setitup
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

var log = require('clifier').helpers.log;

function Database(commands, rootDir, drivers, next){
    if (void(0) === commands) {
        throw new Error('commands required');
    }

    if (void(0) === rootDir) {
        throw new Error('rootDir required');
    }

    this.commands = commands;
    this.rootDir = rootDir;
    this.next = next || function(){};
    this.drivers = drivers;
}

Database.prototype.getDriver = function() {
    if (this.commands.driver === void(0) || this.commands.name === void(0)) {
        return this.next();
    };

    if (this.drivers[this.commands.driver] === void(0)) {
        log.error("     Database driver " + this.commands.driver + " doen't exists\n");
        this.next();
        return;
    }

    return new this.drivers[this.commands.driver](this.commands, this.rootDir, this.next);
};

Database.prototype.doctor = function(){
    var driver = this.getDriver();

    if (!driver) {
        return
    }

    if (!driver.doctor) {
        log.error('Driver '+this.commands.driver+ " don't have a doctor command\n");
        return this.next();
    }

    return driver.doctor();
};

Database.prototype.run = function(){
    var driver = this.getDriver();

    if (!driver) {
        return
    }
    
    if (!driver.install) {
        log.error('Driver '+this.commands.driver+ " don't have a install command\n");
        return this.next();
    }

    return driver.run();
};

module.exports = Database;