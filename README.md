# Express Path

Easy route mapping for Express

[![Build Status](https://travis-ci.org/hyubs/express-path.png?branch=master)](https://travis-ci.org/hyubs/express-path)
[![Dependency Status](https://gemnasium.com/hyubs/express-path.png)](https://gemnasium.com/hyubs/express-path)

## Installation

via npm:

```bash
$ npm install express-path
```

## Updates and Changes

* 2013-07-18 - Started refactoring the code for v0.1.0. Most notable difference is I removed `init()` and replaced it with `()`. Also, you can now pass a file name for the route map and Express Path will load it.


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
		[urlPath, controllerMethod, httpRequestMethod],
		[urlPath, controllerMethod, httpRequestMethod],
		[urlPath, controllerMethod, httpRequestMethod], // etc
	]
	```

	Example

	```javascript
	// In your app.js
	var routes = [
		['/', 'index#index'],
		['users/add', 'users#add', 'post'],
		['users', 'users#list', 'get']
	];
	expressPath(app, routes);
	```

	* 	`urlPath` is the URL path relative to the root of your Node.JS app server.
	* 	`controllerMethod` is a \# delimeted string containing the controller (the JS file) and the method (the JS function of the route).
	* 	`httpRequestMethod` is an optional parameter which tells Express which type of HTTP requests will be routed to the controller's method. Accepted parameters are listed below.
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
		['users/add', 'users#add', 'post'],
		['users', 'users#list', 'get']
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


### Parameters

You can add a 3rd parameter in `()` to set optional parameters (currently, there's only one option available).

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

## License

MIT License. Read the LICENSE file.

In summary, you can do whatever you want with the code but if it breaks, sorry :(


## Contributions

If you find bugs or think some parts can be improved, please post the request on GitHub.

If you want to fix it yourself, kudos! Fork the repo, do your magic, and invoke a pull request. I'll be sure to thank you and add you here as a contributor.