# Express Path

Easy route mapping for Express

[![Build Status](https://travis-ci.org/hyubs/express-path.png?branch=master)](https://travis-ci.org/hyubs/express-path)
[![Dependency Status](https://gemnasium.com/hyubs/express-path.png)](https://gemnasium.com/hyubs/express-path)

## Installation

via npm:

```bash
$ npm install express-path
```

## Usage

### Express Application

Here's a quick example on how to use this module with your Express application.

```javascript
var express = require('express');
var app = express();

// Your express settings here

// Just before you start your http server, initialize express-path
var routes = [
	// Route mapping here
];
require('express-path').init(app, routes);
```

### Route Mapping

The 2nd parameter of `init()` is a 2-dimensional array in the format as shown below.

```javascript
[
	[urlPath, controllerMethod, httpRequestMethod],
	[urlPath, controllerMethod, httpRequestMethod],
	[urlPath, controllerMethod, httpRequestMethod], // etc
]
```

Example

```javascript
[
	['/', 'index#index'],
	['users/add', 'users#add', 'post'],
	['users', 'users#list', 'get']
]
```

* 	`urlPath` is the URL path relative to the root of your Node.JS app server.
* 	`controllerMethod` is a \# delimeted string containing the controller (the JS file) and the method (the JS function of the route).
* 	`httpRequestMethod` is an optional parameter which tells Express which type of HTTP requests will be routed to the controller's method. Accepted parameters are listed below.
	* 	all (any HTTP request)
	*	get
	* 	post
	* 	put
	* 	delete


### Controllers/Methods

Just follow the default Express routes file for your controllers.

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

require('express-path').init(app, routes);
```

You can now go to `/users/login` to see your page.


### Parameters

You can add a 3rd parameter in `init()` to set optional parameters.

Example

```javascript
require('express-path').init(app, routes, { "controllersPath" : "routes" });
```

*	`controllersPath` (string) - Defaults to "controllers"

	Path of the directory relative to the app's main script.

	Example:

	```bash
	cd /home/user/mynodeapp
	node app.js

	# Express Path will try to look for your controllers in /home/user/mynodeapp/controllers
	```





## License

(The MIT License)

Copyright (c) 2013 Hyubs Ursua

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.