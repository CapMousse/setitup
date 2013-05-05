# Setitup

## What is that ?

**Setitup** is a tool to rapidly setup a project on your dev/prod env. Don't waste time to install each package, to install dependencies or to create your database, **Setitup** will do it for you !

## How to install

Simply run `npm install setitup -g`

## How to use

You can create a file named `setitup.config` file (using `YAML`) in your project folder, or run `setitup init` to create a default config file :

```yaml
project:
    branch :  "master"
    host :    "your.host"
    root :    "root/dir"

database:
   driver :  "mysql"
   name :    "database name"
    charset : "used charset (optional)"
    user :    "databse user"
    password :"databse password"

gem:
    sass :
    compass :
    susy :    "1.0.8"

npm:
    coffee-script : "~1.6.2"
    bower :

commands:
    - "php composer.phar install --dev"
    - "php app/console assets:install"
    - "php app/console cache:clear"
```

Then run `setitup install` to automaticaly setup your env. You can even use `setitup install -g git@github.com:CapMousse/setitup.git -o a/ouput/dir` to automaticaly get your project and launch install.

## Create custom namespaces

If you want to add your custom namespace, to add custom commands and tools, or if you want to overload existing namespace, simply create a setitup.js on your directory.

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

