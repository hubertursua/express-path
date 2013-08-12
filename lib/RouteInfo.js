"use strict";

module.exports = function () {
	var self = this;

	// Dependencies
	this.trim = function(str, c) {
		if(typeof c === 'string' && c !== ' ') {
			return require('string')(str)
				.chompRight(c)
				.chompLeft(c)
				.s;
		}
		else {
			return require('string')(str).trim().s;
		}
	};

	this.sanitizeUrlPath = function (path) {
		path = self.trim(path, ' ');
		path = self.trim(path, '/');
		path = '/' + path;
		return path;
	};

	this.isValidMMPath = function (path) {
		var hashCount = (path.match(/\#/g)||[]).length;
		var hashPos = path.indexOf('#');
		var pathLength = path.length;

		return (
			hashCount === 1 &&
			hashPos > 0 &&
			hashPos < pathLength - 1
		);
	};

	this.getModulePath = function (path) {
		var hashPos = path.indexOf('#');
		return path.substring(0, hashPos) + '.js';
	};

	this.getMethod = function (path) {
		var hashPos = path.indexOf('#');
		return path.substring(hashPos + 1);
	};

	return this;
};
