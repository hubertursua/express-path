"use strict";

module.exports = function () {
	var self = this;

	// Dependencies
	this.getRouteFile = require('./RouteMap').getFile;

	this.getFile = function (path) {
		return require(path);
	};

	this.isValid = function (routeMap) {
		return (Array.isArray(routeMap));
	};

	this.eval = function (route) {
		if(typeof route === 'string') {
			return self.getRouteFile(route);
		}
		else {
			return route;
		}
	};

	return this;
};
