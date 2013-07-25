// express-path.js
// by @hyubs

"use strict";

var path = require('path');
var fs = require('fs');

var expressPath = function(app, _routeMap, _options) {
	// Set all parameters of the module
	var params 		= {
						modulePath: path.dirname(module.parent.parent.filename) + path.sep
					  , routeMap: []
					};

	// Set all options of the module
	var options 	= _options || {
						controllersPath: params.modulePath + "controllers" + path.sep
					};

	// If controllersPath was defined in the options, fix the path so that it's always relative to the main script.
	if(_options && _options.controllersPath) {
		options.controllersPath = path.normalize(params.modulePath + path.sep +  options.controllersPath + path.sep);
	}

	// Get the route map from a file or from the input array
	if(typeof _routeMap == 'string') 		params.routeMap = require(path.normalize(params.modulePath + _routeMap));
	else if(_routeMap) 						params.routeMap = _routeMap;
	else 									throw new Error("No route map defined.");

	if(!Array.isArray(params.routeMap)) 	throw new Error("Route map should be an array.");

	// Map all paths specified in routes
	for(var i in params.routeMap) {
		routeMapper(app, params.routeMap[i], options.controllersPath);
	}

	console.log('Done mapping all routes.');

	return this;
}

var routeMapper = function(app, route, controllersPath) {
	var urlPath 			= route[0]
	  , controllerMethod 	= route[1]
	  , httpRequestMethod 	= route[2] || 'all'
	  , cmArr = controllerMethod.split('#')

	if(cmArr.length !== 2) {
		throw new Error("controllerMethod parameter should contain both the controller and the method concatenated by a # symbol.");
	}

	var routeMethod = getRouteMethod(controllersPath, cmArr[0], cmArr[1]);

	// Make sure the urlPath has a slash at the beginning
	if(urlPath.substr(0, 1) !== '/') {
		urlPath = '/' + urlPath;
	}

	console.log("[" + httpRequestMethod.toUpperCase() + "] " + urlPath + " -> " + controllerMethod);

	return app[httpRequestMethod](urlPath, routeMethod);
};

var getRouteMethod = function(controllersPath, controller, method) {
	var controllerFile = controllersPath + controller;

	if(fs.existsSync(controllerFile + '.js'))
	{
		var routeController = require(controllerFile);

		if(typeof routeController[method] !== 'undefined') {
			return routeController[method];
		}
		else {
			throw new Error("Could not load method " + controller + "#" + method + " for routing.");
		}
	}
	else
	{
			throw new Error("Could not load controller " + controller + " for routing using the path " + controllerFile + ".");
	}
}

module.exports = expressPath;