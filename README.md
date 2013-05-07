# Setitup

Local environment project setup made easy.

**SetItUp** is an automated tool to rapidly setup a project on a new developement environment. Don't waste time to install each package, to install dependencies or to create your database, **SetItUp** will do it for you !.

SetItUp can be easily customised to add your custom namespace and add custom commands.

**Now in beta, feedback is welcome**

## How to install

Simply run `npm install setitup -g`

## How to use

### Create a config file

To start, you need to create a config file, named `setitup.config` (using `YAML`), in your project folder. You can use `setitup init` to create a default file for you or create it manually.

This file contains several namespaces, each one assigned to one part of your setup:

- project : your basic project configuration
- database : your database configuration
- gem : needed gems
- npm : needed node packages
- commands : custom commands to launch

**All namespaces are optional.**


#### Project
The project namespace contains basic information for your setup: 
- branch : the branch to use
- host : the virtual host to create
- root : the root dir for the virtual host


```yaml
project:
    branch :  "master"
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
    - "php app/console cache:clear"
```

### Setup environment

Now that your project has a `setitup.config`, you can run `setitup install` to launch installation.

If you don't have clone your git repository to your computer, you can use `setitup install -g repos_url_here`. You can even set a custom ouput dir for git clone, using `-o`: `setitup install -g repos_url_here -o a/ouput/dir`.

## Create custom namespaces

If you want to add a custom namespace, to add custom commands and tools, or if you want to override an existing namespace, simply create a setitup.js on your directory.

```javascript
'use strict';

module.exports = {
    /**
     * {Object|Array} commands the list of commands of the current namespace
     * {String}       rootDir  the root dir of the project
     * {Function}     a callback to call when namespace work is finished
     */
    namespaceName: function(commands, rootDir, next) {
        next();
    }
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

