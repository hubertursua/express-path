"use strict";

module.exports = function () {
	var self = this;

	this.getFile = function (path) {
		return require(path);
	};

	this.isValid = function (routeMap) {
		return (Array.isArray(routeMap));
	};

	this.eval = function (route) {
		if(typeof route === 'string') {
			return self.getFile(route);
		}
		else {
			return route;
		}
	};

	return this;
};
