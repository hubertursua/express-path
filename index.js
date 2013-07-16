var path = require('path');

/*
Parameters:
	@app = Express app instance
	@routes = Array defining the routes to be mapped
	@params = {
		controllersDir = Directory of the controllers relative to the main script
	}
*/

exports.init = function(app, routes, params) {
	var CONTROLLERS_DIR_PATH = path.dirname(module.parent.filename) + path.sep;

	if(params.controllersDir) {
		CONTROLLERS_DIR_PATH += params.controllersDir;
	}
	else {
		CONTROLLERS_DIR_PATH += 'controllers';
	}

	CONTROLLERS_DIR_PATH = path.normalize(CONTROLLERS_DIR_PATH + path.sep);

	console.log('CONTROLLERS_DIR_PATH: ' + CONTROLLERS_DIR_PATH);

	app.routeMapper = function(route, controllerMethod, requestType) {
		var cmArr = controllerMethod.split('#');

		if(cmArr.length !== 2) {
			throw new Error("controllerMethod parameter should contain both the controller and the method concatenated by a # symbol.");
		}

		var controller = cmArr[0];
		var method = cmArr[1];

		if(!requestType) {
			requestType = 'all';
		}

		var routeController;
		try {
			routeController = require(CONTROLLERS_DIR_PATH + controller);
		}
		catch(err) {
			throw new Error("Could not load controller " + controller + " for routing.");
		}

		var routeMethod;
		if(typeof routeController[method] !== 'undefined') {
			routeMethod = routeController[method];
		}
		else {
			throw new Error("Could not load method " + controller + "#" + method + " for routing.");
		}

		console.log("[" + requestType.toUpperCase() + "] " + route + " -> " + controllerMethod);
		return this[requestType](route, routeMethod);
	};

	// Map all paths specified in routes
	for(var i in routes) {
		var route = routes[i];
		if(route.length == 2) {
			app.routeMapper(route[0], route[1]);
		}
		else {
			app.routeMapper(route[0], route[1], route[2]);
		}
	}
}