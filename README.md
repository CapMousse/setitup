# Setitup [![Build Status](https://secure.travis-ci.org/CapMousse/setitup.png?branch=master)](http://travis-ci.org/CapMousse/setitup) [![NPM version](https://badge.fury.io/js/setitup.png)](http://badge.fury.io/js/setitup)

Setitup is an automated tool to rapidly setup a project on a new environment. Don't waste time to clone repository, install package and launch commands, let Setitup do it for you.

Setitup comes with a small footprint and can be easily customised to add your own namespaces.

## Using Setitup

Setitup can be easily installed by npm by running the command `npm install setitup -g`

Here is a list of available commands: 

```
init                                Create a new setitup.config file on your project directory
install                             Install project from the current directory
install -g {giturl}                 Install project from a git repository
install -g {giturl} -o {directory}  Install project from a git repository on the asked directory
install -n {namespace}              Install the asked namespace
doctor                              Check if current config is ready for the project
doctor  -n {namespace}              Check if current config is ready for the project namespace
help                                Show help for setitup
```

## Namespace

Namespace are the main feature of Setitup: they provide usefull tools to set up your environment. Install gems and npm package, setup virtual host, create database, run commands...

You can easily create your own namespace to add feature to Setitup!

Here is a list of available namespaces : 

```
project    setup your virtualhost environment
database   setup your the database (mysql/sqlite)
gem        gem dependencies
npm        npm dependences
commands   commands to launch to setup your project
````

**All namespaces are optional.**


## How to use

### Create a config file

To start, you need to create a config file, named `setitup.config` (using `YAML`), in your project folder. You can use `setitup init` to create a default file for you or create it manually.


#### Project
The project namespace contains basic information for your setup:
- host : the virtual host to create
- root : the root dir for the virtual host


```yaml
project:
    host :    "your.host"
    root :    "root/dir "
```

#### Database
The database namespace contains all information needed to setup your database:
- driver : the driver to use (for now, only MySQL)
- name : the database name
- charset : the database charset (optional)
- user : the user to create database (optional)
- password : the user password to create database (optional)

```yaml
database:
    driver :  "mysql"
    name :    "database name"
    charset : "utf8"
```

#### Gem & Npm
The gem and npm namespaces will automaticaly install all listed packages with the given version

```yaml
gem:
    sass :
    compass :
    susy :    "1.0.8"

npm:
    coffee-script : "~1.6.2"
    bower :
```

#### Commands
The commands namespace will run a set of custom commands when needed. 

```yaml
commands:
    - "php composer.phar install --dev"
    - "php app/console assets:install"
    - "brew update node"
```


## Create custom namespaces

If you want to add a custom namespace, to add custom commands and tools, or if you want to override an existing namespace, simply create a setitup.js on your directory.

```javascript
'use strict';

function YourNamespace (commands, rootDir, next) {
    this.commands = commands; // list of asked command, package, whatever you want listed on the config file
    this.rootDir = rootDir;
    this.next = next; // this must be called at the end of your command
}

YourNamespace.prototype.install = function(){
    // do stuff to install
    this.next();
};

YourNamespace.prototype.doctor = function(){
    // do stuff to check env
    this.next();
};

module.exports = {
    yourNamespace: YourNamespace
}
```

## License

```
DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
Version 2, December 2004

Copyright (C) 2013 Jérémy Barbe <jeremy@devenezninja.com>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

0. You just DO WHAT THE FUCK YOU WANT TO.
```

