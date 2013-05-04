# Setitup

## What is that ?

**Setitup** is a tool to rapidly setup a project on your dev/prod env. Don't waste time to install each package, to install dependencies or to create your database, **Setitup** will do it for you !

## How to install

Simply run `npm install setitup -g`

## How to use

You can create a file named `setitup.config` file (user `TOML`) in your project folder, or run `setitup init` to create the file, and define dependencies like this:

	[project]
	git = 		"git@github.com:CapMousse/projectsetupmanager.git"
	branch = 	"master"
	host = 		"dev.psm.com"
		
	[database]
	type = 		"mysql"
	name =		"test"
	user =		"root"
	password = 	"azerty"
		
	[gem]
	sass = 		"--pre"
	compass = 	true
		
	[npm]
	coffee-script = ">1.1 && <1.1"
	bower = 		true
	requirejs = 	true
	brunch = 		true
	
	[commands]
	before =	["php composer.phar install --dev"]
	after = 	["php app/console assets:install, "php app/console cache:clear"]

		
If a `setitup.config` file is defined, you can lauch `setitup doctor` to detect if your current env is ready to run your project !

If not, run `setitup install` to automaticaly setup your env ! You can even use `setitup install git@github.com:CapMousse/projectsetupmanager.git` to automaticaly get your project and launch instal !

To check if your install is always on lastest version of dependencies, you can run `setitup update`

## Create custom namespaces

If you want to add your custom namespace to add custom commands and tools, simple create a setitup.js on your directory.

