/*
 * Setitup
 * https://github.com/CapMousse/setitup
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

'use strict';

var fs = require('fs');
var currentDir = process.cwd();
var log = require('clifier').helpers.log;

function Init(){
    if (fs.existsSync(currentDir+'/setitup.config')) {
        log.error("The file setitup.config already exists");
        return false;
    }

    var fileContent = ""+
        "##########################################\r\n" +
        "### This file was generated by SetItUp ###\r\n" +
        "##########################################\r\n" +
        "project:\r\n" +
        "    branch :  \"master\"\r\n" +
        "    host :    \"your.host\"\r\n" +
        "    root :    \"root/dir\"\r\n" +
        "\r\n" +
        "database:\r\n" +
        "    driver :  \"mysql\"\r\n" +
        "    name :    \"database name\"\r\n" +
        "    charset : \"used charset (optional)\"\r\n" +
        "    user :    \"databse user\"\r\n" +
        "    password: \"databse password\"\r\n" +
        "\r\n" +
        "gem:\r\n" +
        "    sass :\r\n" +
        "    compass :\r\n" +
        "    susy :    \"1.0.8\"\r\n" +
        "\r\n" +
        "npm:\r\n" +
        "    coffee-script : \"~1.6.2\"\r\n" +
        "    bower :\r\n" +
        "\r\n" +
        "commands:\r\n" +
        "    - \"php composer.phar install --dev\"\r\n" +
        "    - \"php app/console assets:install\"\r\n" +
        "    - \"php app/console cache:clear\"\r\n";

    fs.writeFileSync(currentDir+'/setitup.config', fileContent);
    return true;
}

module.exports = Init;
