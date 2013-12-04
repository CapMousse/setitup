/*
 * Setitup
 * https://github.com/CapMousse/setitup
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

var utils = require('../utils');

function Doctor(askedNamespace, callback){
    utils.launchCommand(askedNamespace, 'doctor', callback);
}

module.exports = function(namespace, callback){
    new Doctor(namespace, callback);
};
