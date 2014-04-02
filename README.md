# Express Path

Easy route mapping for Express

[![NPM version](https://badge.fury.io/js/express-path.svg)](http://badge.fury.io/js/express-path)
[![Build Status](https://travis-ci.org/hyubs/express-path.svg?branch=master)](https://travis-ci.org/hyubs/express-path)
[![Dependency Status](https://gemnasium.com/hyubs/express-path.svg)](https://gemnasium.com/hyubs/express-path)

## Installation

via npm:

```bash
$ npm install express-path
```

## Updates and Changes

* 2014-04-03 - __v0.3.x__ - Updated outdated dependencies. Preview for CoffeeScript support.
* 2013-08-25 - __v0.2.1__ - Major bug fix for those trying to pass array routes instead of a file path. Added acceptance test which runs various use cases for routes.
* 2013-08-12 - __v0.2.0__ - Package was rewritten, making it testable. New major feature is the support for middlewares. Some minor features are turning on/off the console.logs and error throwing.

## Usage

### Express Application

Here's a quick example on how to use this module with your Express application.

```javascript
var express = require('express');
var app = express();
var expressPath = require('express-path')

// Your express settings here

var routes = [
	// Route mapping here
];
expressPath(app, routes);

// All your other stuff before the server starts
```

### Route Mapping

The 2nd parameter of `()` can be any of the following:

* 	a 2-dimensional array in the format as shown below

	```javascript
	[
		[urlPath, controllerMethod], // httpRequestMethod defaults to 'all'
		[urlPath, controllerMethod, httpRequestMethod],
		[urlPath, controllerMethod, middlewareMethod, httpRequestMethod],
		[urlPath, controllerMethod, middlewareMethod1, middlewareMethod2, ... , httpRequestMethod], // etc
	]
	```

	Example

	```javascript
	// In your app.js
	var routes = [
		['/', 'index#index'],
		['login', 'auth#login', 'post'],
		['items/comments/create', 'items/comments#create', 'auth#login', 'post'],
		['admin/users/remove', 'admin/users#remove', 'auth#login', 'auth#isAdmin', 'post']
	];
	expressPath(app, routes);
	```

	* 	`urlPath` is the URL path relative to the root of your Node.JS app server.
	* 	`controllerMethod` is a \# delimeted string containing the controller (the JS file) and the method (the JS function of the route).
	* 	`middlewareMethod` is an optional parameter which defines middlewares Express will use before your controller. You can add many of these as shown in the example. You have to define an `httpRequestMethod` if you add this parameter.
	* 	`httpRequestMethod` is an optional parameter (required if you have `middlewareMethod`) which tells Express which type of HTTP requests will be routed to the controller's method. Accepted parameters are listed below.
		* 	`all` (any HTTP request)
		*	`get`
		* 	`post`
		* 	`put`
		* 	`delete`

* 	a string containing a relative path to your route map file

	If you are using a separate file, just use `module.exports` with your array.

	```javascript
	// In your routeMap.js
	module.exports = [
		['/', 'index#index'],
		['login', 'auth#login', 'post'],
		['items/comments/create', 'items/comments#create', 'auth#login', 'post'],
		['admin/users/remove', 'admin/users#remove', 'auth#login', 'auth#isAdmin', 'post']
	];

	// In your app.js
	expressPath(app, 'routeMap');
	```


### Controllers/Methods

Just follow the default Express routes file for your controllers.

By default, Express Path will look for your files under `/controllers/`.

```javascript
// For example this is in controllers/users.js
exports.login = function(req, res){

};
```

For the sample code above, you need a route map like this:

```javascript
var routes = [
	['/users/login', 'users#login']
];

expressPath(app, routes);
```

You can now go to `/users/login` to see your page.


### Middlewares

Express Path now supports middlewares. These are called in sequence before your controller is called.

By default, Express Path will look for your files under `/middlewares/`.

```javascript
// For example this is in middlewares/auth.js
exports.login = function(req, res, next){
	if(/* code to check if user is logged in */) {
		// Allow Express to continue to the next middleware or your controller
		next();
	}
   else {
   	// Not logged in! You can do redirects here.
	}
};

exports.isAdmin = function(req, res, next){
	if(/* code to check if user is an admin */) {
		// Allow Express to continue to the next middleware or your controller
		next();
	}
   else {
   	// Not an admin! You can do redirects here.
	}
};

For the sample code above, you need a route map like this:

var routes = [
	['admin/users/remove', 'admin/users#remove', 'auth#login', 'auth#isAdmin', 'post']
];

expressPath(app, routes);
```


### Parameters

You can add a 3rd parameter in `()` to set optional parameters.

Example

```javascript
expressPath(app, routes, { "controllersPath" : "routes" });
```

*	`controllersPath` (string) - Defaults to "controllers"

	Path of the directory relative to the app's main script.

	Example:

	```bash
	cd /home/user/mynodeapp
	node app.js

	// Express Path will try to look for your controllers in /home/user/mynodeapp/controllers
	```

*	`middlewaresPath` (string) - Defaults to "middlewares"

	Path of the directory relative to the app's main script.

	Example:

	```bash
	cd /home/user/mynodeapp
	node app.js

	// Express Path will try to look for your middlewares in /home/user/mynodeapp/middlewares
	```

*	`strict` (boolean) - Defaults to true

	If this is true, Express Path will throw errors during route mapping. Otherwise, it just displays the errors in the console.

*	`type` (string) - is an option parameter that allows you to specify the file type of your controller and middleware files. Accepts ```js``` or ```coffee``` (CoffeeScript).

*	`verbose` (boolean) - Defaults to true

	If this is true, Express Path will show all console logs (including errors). Otherwise, it will not display anything.



## License

MIT License. Read the LICENSE file.

In summary, you can do whatever you want with the code but if it breaks, sorry :(


## Contributions

### Thanks

Thank you to the following people who contributed code or ideas for this module:

* [@petecoop](https://github.com/petecoop)
* [@RoToRa](http://www.reddit.com/user/RoToRa)
* [@eyolas](https://github.com/eyolas)

### How to Contribute

If you find bugs or think some parts can be improved, please post the request on GitHub.

If you want to fix it yourself, kudos! Fork the repo, do your magic, and invoke a pull request. I'll be sure to thank you and add you here as a contributor.
