"use strict";

module.exports = function () {
	this.exists = function (methodName, controllerInstance) {
		return (typeof controllerInstance[methodName] !== 'undefined');
	};

	this.get = function (methodName, controllerInstance) {
		return controllerInstance[methodName];
	};

	return this;
};