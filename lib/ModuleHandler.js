"use strict";

module.exports = function () {
	var self = this;

	// Dependencies
	this.existsChecker = require('fs').existsSync || require('path').existsSync;

	this.fileExists = function (controllerPath) {
		return (self.existsChecker(controllerPath));
	};

	this.getFile = function (controllerPath) {
		return require(controllerPath);
	};

	return this;
};
