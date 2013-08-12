var should = require("should");

var tests = [
	'lib/ErrorHandler',
	'lib/MethodHandler',
	'lib/ModuleHandler',
	'lib/RouteInfo',
	'lib/RouteMap'
];

tests.forEach(function (test) {
	require('./' + test)(should);
});
