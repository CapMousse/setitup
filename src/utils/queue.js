'use strict';

var ticks = [];
var queues = [];
var doneCallback = [];

module.exports = {
    add: function(name, callback){
        if (void(0) === queues[name]) {
            queues[name] = 1;
        } else {
            queues[name]++;
        } 

        return function(){
            if (false === callback.apply(this, arguments)) {
                return false;
            }

            if (void(0) === ticks[name]) {
                ticks[name] = 1;
            } else {
                ticks[name]++;
            }

            if (ticks[name] === queues[name] && void(0) !== doneCallback[name]) {
                doneCallback[name].call(this);
                doneCallback[name] = void(0);
            }
        };
    },
    done: function(name, callback){
        doneCallback[name] = callback;
    },
    run: function(name){
        if (void(0) !== doneCallback[name]) {
            return doneCallback[name].call(this);
        }
    }
};