/*
 * Clifier
 * https://github.com/CapMousse/setitup
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

var exec = require('child_process').exec;
var log = require('clifier').helpers.log;
var queue = require('../utils').queue;

function Gem(gems, rootDir, next){
    if (void(0) === gems) {
        throw new Error('gems required');
    }

    this.gems = gems;
    this.rootDir = rootDir;
    this.next = next || function(){};
}

Gem.prototype.doctor = function(){
    var _this = this;
    var gem, version;

    queue.done('gem', _this.next);

    for (gem in this.gems) {
        version = (this.gems[gem] !== true && this.gems[gem] !== 'pre') ? this.gems[gem] : false;

        this.checkGem(gem, version);
    }
};

Gem.prototype.run = function(){
    var _this = this;
    var gem, version;

    queue.done('gem', _this.next);

    for (gem in this.gems) {
        version = (this.gems[gem] !== null && this.gems[gem] !== 'pre') ? this.gems[gem] : false;

        this.installGem(gem, version);
    }
};

Gem.prototype.checkGem = function(gem, version) {
    exec('gem list ' + gem +' -i ' + (version ? '-v ' + version : ''), queue.add('gem', function(err, stdout){
        if (err) {
            log.error("    Error while listing gems\n");
            return;
        }

        if (true === /^true/.test(stdout)) {
            log.write("    Gem " + gem + " already installed\n");
        } else {
            log.write(log.style("    Gem " + gem + " missing\n", 'green'));
        }
    }));
};

Gem.prototype.installGem = function(gem, version){
    exec('gem install '+gem + (version ? ' -v' + version : ''), queue.add('gem', function(err){
        if (err) {
            if (/You don't have write permissions/.test(err)) {
                log.error("    Gem don't have write persmission, try using Sudo\n");
            } else {
                log.error("    Gem : error while installing "+gem+"\n");
            }
            return true;
        }


        log.write(log.style("    Gem " + gem + " installed\n", 'green'));
    }));
};

module.exports = Gem;