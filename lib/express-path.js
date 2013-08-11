// express-path.js
// by @hyubs

"use strict";

// var expressPath = function(app, routeParam, options) {
var expressPath = function (app, routeParam, opt) {
	// Dependencies
	var fs = require('fs');
	var path = require('path');
	var RouteMap = require('./RouteMap');
	var RouteInfo = require('./RouteInfo');
	var ControllerHandler = require('./ControllerHandler');
	var MethodHandler = require('./MethodHandler');
	var ErrorHandler = require('./ErrorHandler');

	var MODULE_PATH = path.dirname(module.parent.parent.filename) + path.sep;

	opt = opt || {};

	var options = {
		controllersPath: ((typeof opt.controllersPath === 'undefined') ? ("controllers" + path.sep) : opt.controllersPath),
		strict:          ((typeof opt.strict === 'undefined')          ? true : opt.strict),
		verbose:         ((typeof opt.verbose === 'undefined')         ? true : opt.verbose)
	};

	var errorHandler = new ErrorHandler({
		strict:  options.strict,
		verbose: options.verbose
	});

	var routeMap = new RouteMap();
	var routeInfo = new RouteInfo();
	var controllerHandler = new ControllerHandler();
	var methodHandler = new MethodHandler();

	// Get the map data. If routeParam was a path, then read that file.
	var map = RouteMap.eval(routeParam);

	// Check if the map is valid.
	if(RouteMap.isValid(map)) {
		// If it is valid, then:

		// Loop through the map.
		for(var i in map) {
			// For each route info:
			var routeInfo = map[i];

			// Get the URL path and sanitize it.
			var urlPath = routeInfo[0];
			urlPath = RouteInfo.sanitizeUrlPath(urlPath);

			// Get the controller-method path.
			var cmPath = routeInfo[1];

			// Get the HTTP request method. If there's none, default to all.
			var httpRequestMethod = routeInfo[2] || 'all';

			// Check if the controller-method path is valid.
			if(RouteInfo.isValidCMPath(cmPath)) {
				// If it is valid, then

				// Get the path of the controller and prefix it with the path to the controllers directory.
				var controllerPath = controllersPath + '/' + RouteInfo.controllerPath(cmPath);

				// Check if the controller file exists.
				if(ControllerHandler.fileExists(controllerPath)) {
					// If it does, then

					// Retrieve the file creating an "instance".
					var controllerInstance = ControllerHandler.getFile(controllerPath);

					// Get the name of the method from the route info.
					var methodName = RouteInfo.controller(cmPath);

					// Check if the method exists.
					if(MethodHandler.exists(method, controllerInstance)) {
						// If it does, then

						// Retrieve the method.
						var method = MethodHandler.invoke(method, controllerInstance);

						// Finally, bind the route in the Express app
						app[httpRequestMethod](urlPath, method);

						if(options.verbose) {
							console.log('[' + httpRequestMethod.toUpperCase() + '] ' + urlPath + '  ->  ' + cmPath);
						}
					}
					else {
						errorHandler.log("Could not load method for " + cmPath);
					}
				}
				else {
					errorHandler.log("Controller not found: " + controllerPath);
				}
			}
			else {
				errorHandler.log("Invalid controller-method path: " + cmPath);
			}
		}
	}
	else {
		errorHandler.log("Route map should be an array. No route map defined.");
	}
};

module.exports = expressPath;