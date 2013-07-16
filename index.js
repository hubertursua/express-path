exports.init = function(app, routes, controllersDirPath) {
	var CONTROLLERS_DIR_PATH = require('path').dirname(module.parent.filename)  + '/routes/';

	if(controllersDirPath) {
		CONTROLLERS_DIR_PATH = controllersDirPath
	}

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