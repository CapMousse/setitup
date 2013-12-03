/*
 * Setitup
 * https://github.com/CapMousse/setitup
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

var stacks = {};
var stacksIterator = {};

module.exports = {
    //add or create a new stack with given callback and aguments
    addToStack: function(name, callback, args) {
        if (void(0) === stacks[name]) {
            stacks[name] = [];
            stacksIterator[name] = -1;
        }

        args = args || [];

        stacks[name].push([callback, args]);
    },

    //process next stack element of given stack name
    tick: function(name){
        if (void(0) === stacks[name]) {
            throw new Error('Stack ' + name + ' doesn\'t exists');
        }

        if (stacksIterator[name] < stacks[name].length - 1) {
            stacksIterator[name]++;
            stacks[name][stacksIterator[name]][0].apply(this, stacks[name][stacksIterator[name]][1]);
        }
    }
};