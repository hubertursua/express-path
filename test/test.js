var should = require("should");

var tests = [
	'lib/ControllerHandler',
	'lib/ErrorHandler',
	'lib/MethodHandler',
	'lib/RouteInfo',
	'lib/RouteMap'
];

tests.forEach(function (test) {
	require('./' + test)(should);
});
