// express-path.js
// by @hyubs

"use strict";

var expressPath = function (app, routeParam, opt) {
	// Dependencies
	var fs = require('fs');
	var colors = require('colors');
	var path = require('path');
	var RouteMap = require('./RouteMap');
	var RouteInfo = require('./RouteInfo');
	var ModuleHandler = require('./ModuleHandler');
	var MethodHandler = require('./MethodHandler');
	var ErrorHandler = require('./ErrorHandler');

	opt = opt || {};

	var options = {
		controllersPath: ((typeof opt.controllersPath === 'undefined') ? "controllers" : opt.controllersPath),
		middlewaresPath: ((typeof opt.middlewaresPath === 'undefined') ? "middlewares" : opt.middlewaresPath),
		expressRoot:     ((typeof opt.expressRoot === 'undefined')     ? path.dirname(module.parent.parent.filename) : opt.expressRoot),
		strict:          ((typeof opt.strict === 'undefined')          ? true : opt.strict),
		verbose:         ((typeof opt.verbose === 'undefined')         ? true : opt.verbose),
		type:            ((typeof opt.type === 'undefined')            ? 'js' : opt.type)
	};

	var errorHandler = new ErrorHandler({
		strict:  options.strict,
		verbose: options.verbose
	});

	var routeMap = new RouteMap();
	var routeInfo = new RouteInfo(options.type);
	var moduleHandler = new ModuleHandler();
	var methodHandler = new MethodHandler();

	var getModuleMethod = function (parentPath, mmPath) {
		if(routeInfo.isValidMMPath(mmPath)) {
			// If it is valid, then

			// Get the path of the controller and prefix it with the path to the controllers directory.
			var modulePath = parentPath + '/' + routeInfo.getModulePath(mmPath);

			// Check if the controller file exists.
			if(moduleHandler.fileExists(modulePath)) {
				// If it does, then

				// Retrieve the file creating an "instance".
				var moduleInstance = moduleHandler.getFile(modulePath);

				// Get the name of the method from the route info.
				var methodName = routeInfo.getMethod(mmPath);

				// Check if the method exists.
				if(methodHandler.exists(methodName, moduleInstance)) {
					// If it does, then

					// Retrieve the method.
					var method = methodHandler.get(methodName, moduleInstance);
					return method;
				}
				else {
					errorHandler.log("Could not load method for " + mmPath);
					return null;
				}
			}
			else {
				errorHandler.log("Module not found: " + modulePath);
				return null;
			}
		}
		else {
			errorHandler.log("Invalid module-method path: " + mmPath);
			return null;
		}
	}

	// Get the map data. If routeParam was a path, then read that file.
	if(typeof routeParam === 'string') {
		routeParam = path.join(options.expressRoot, routeParam);
	}

	var map = routeMap.eval(routeParam);

	// Check if the map is valid.
	if(routeMap.isValid(map)) {
		// If it is valid, then:

		// Loop through the map.
		for(var i in map) {
			// For each route info:
			var mapRow = map[i];

			// Get the URL path and sanitize it.
			var urlPath = mapRow[0];
			urlPath = routeInfo.sanitizeUrlPath(urlPath);

			// Get the controller-method path.
			var cmPath = mapRow[1];
			cmPath = routeInfo.sanitizeMMPath(cmPath);

			// Get the middleware-method paths.
			var mmPaths = [];
			for(var j = 2; j < mapRow.length - 1; j++) {
				mmPaths.push(mapRow[j]);
			}

			// Get the HTTP request method. If there's none, default to all.
			var httpRequestMethod;
			if(mapRow.length > 2) {
				httpRequestMethod = mapRow[mapRow.length - 1].toLowerCase();
			}
			else {
				httpRequestMethod = 'all';
			}

			// Get the method of the controller
			var method = getModuleMethod(path.join(options.expressRoot, options.controllersPath), cmPath);

			// Loop through all the middleware-method paths and retrieve each of the methods
			var middlewares = [];
			mmPaths.forEach(function(mmPath) {
				var middlewareMethod = getModuleMethod(path.join(options.expressRoot, options.middlewaresPath), mmPath);
				middlewares.push(middlewareMethod);
			});

			// Finally, bind the route in the Express app
			app[httpRequestMethod](urlPath, middlewares, method);

			// If verbose is true, print out some info about the mapped routes
			if(options.verbose) {
				console.log('['.grey + httpRequestMethod.toUpperCase().green + '] '.grey + urlPath + '  ->  '.yellow + cmPath);
				if(mmPaths.length > 0) {
					console.log('    - middlewares ('.cyan + mmPaths.length.toString().grey + ')'.cyan);
					mmPaths.forEach(function(mmPath) {
						console.log('        - '.grey + mmPath.grey);
					})
				}
			}
		}
	}
	else {
		errorHandler.log("Route map should be an array. No route map defined.");
	}
};

module.exports = expressPath;







