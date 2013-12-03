/*
 * Setitup
 * https://github.com/CapMousse/setitup
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

var ticks = [];
var queues = [];
var doneCallback = [];
var errorCallback = [];
var args = [];

module.exports = {
    add: function(name, callback){
        if (void(0) === queues[name]) {
            queues[name] = 1;
        } else {
            queues[name]++;
        } 

        return function(){
            var result = callback.apply(this, arguments);

            if (void(0) === ticks[name]) {
                ticks[name] = 1;
                args[name] = [];
            } else {
                ticks[name]++;
            }

            if (false === result) {
                if ( void(0) !== errorCallback[name]){
                    errorCallback[name].call(false);   
                }
                
                return false;
            }

            args[name].push(result);

            if (ticks[name] === queues[name] && void(0) !== doneCallback[name]) {
                doneCallback[name].apply(this, args[name]);
                doneCallback[name] = void(0);
            }

            return result;
        };
    },
    done: function(name, callback) {
        doneCallback[name] = callback;

        if (void(0) !== queues[name] && void(0) !== ticks[name] && ticks[name] === queues[name]) {
            doneCallback[name].apply(this, args[name]);
        }
    },
    error: function(name, callback) {
        errorCallback[name] = callback;
    },
    run: function(name) {
        if (void(0) !== doneCallback[name]) {
            return doneCallback[name].call(this);
        }
    }
};