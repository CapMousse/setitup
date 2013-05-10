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
            if (void(0) === ticks[name]) {
                ticks[name] = 1;
            } else {
                ticks[name]++;
            }

            callback.apply(this, arguments);

            if (ticks[name] >= queues[name] && doneCallback[name]) {
                doneCallback[name].call(this);
            }
        };
    },
    done: function(name, callback){
        doneCallback[name] = callback;
    }
};