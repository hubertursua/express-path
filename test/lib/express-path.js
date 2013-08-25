var should = require("should");
var _ = require('underscore');

describe('express-path', function () {
	var expressPath = require('../../lib/express-path');

	var appCounter = (function () {
		var self = { };

		self.routesMapped = 0;
		self.routesExpected = 0;

		self.init = function (routesExpected) {
			self.routesMapped = 0;
			self.routesExpected = routesExpected;
		};

		self.allRoutesMapped = function () {
			return self.routesMapped === self.routesExpected;
		};

		// Only using ALL, GET, and POST as HTTP verbs for testing

		self.all = function () {
			++self.routesMapped;
		};

		self.get = function () {
			++self.routesMapped;
		};

		self.post = function () {
			++self.routesMapped;
		};

		return self;
	})();

	describe('#()', function () {
		it('should accept "controllersPath" as an option', function () {
			var localApp = _.clone(appCounter);
			localApp.init(2);

			expressPath(localApp, [
				['/', 'index2#index'],
				['/beagle/bark', 'beagle2#bark']
			], {
				'controllersPath': 'controllers2',
				'expressRoot': __dirname + '/../dummies/express/',
				'verbose': false
			});

			localApp.allRoutesMapped().should.equal(true);
		});

		it('should set options.controllersPath to "controllers" by default', function () {
			var localApp = _.clone(appCounter);
			localApp.init(1);

			expressPath(localApp, [
				['/', 'index#index']
			], {
				'controllersPath': 'controllers',
				'expressRoot': __dirname + '/../dummies/express/',
				'verbose': false
			});

			localApp.allRoutesMapped().should.equal(true);
		});

		it('should load the routes when routeParam is an array with length > 0', function () {
			var localApp = _.clone(appCounter);
			localApp.init(1);

			expressPath(localApp, [
				['/', 'index#index']
			], {
				'expressRoot': __dirname + '/../dummies/express/',
				'verbose': false
			});

			localApp.allRoutesMapped().should.equal(true);


			var localApp2 = _.clone(appCounter);
			localApp2.init(2);

			expressPath(localApp2, [
				['/', 'index#index'],
				['/beagle/bark', 'beagle#bark']
			], {
				'expressRoot': __dirname + '/../dummies/express/',
				'verbose': false
			});

			localApp2.allRoutesMapped().should.equal(true);
		});

		it('should not load any routes when routeParam is an array with length = 0', function () {
			var localApp = _.clone(appCounter);
			localApp.init(0);

			expressPath(localApp, [], { 'verbose': false });

			localApp.allRoutesMapped().should.equal(true);
		});

		it('should load the routes when routeParam is a string path', function () {
			var localApp = _.clone(appCounter);
			localApp.init(2);

			expressPath(localApp, 'myRouteMap', {
				'expressRoot': __dirname + '/../dummies/express/',
				'verbose': false
			});

			localApp.allRoutesMapped().should.equal(true);
		});

		// THESE TESTS TO FOLLOW (current structure of code makes these difficult). BUT THESE ARE INDIRECTLY COVERED BY OTHER TESTS.

		// it('should accept "middlewaresPath" as an option', function () {

		// });

		// it('should set .options.middlewaresPath to "middlewares" by default', function () {

		// });

		// it('should accept "expressRoot" as an option', function () {

		// });

		// it('should set .options.expressRoot to the path of the module that invoked Express Path by default', function () {

		// });

		// it('should accept "strict" as an option', function () {

		// });

		// it('should set .options.strict to true by default', function () {

		// });

		// it('should accept "verbose" as an option', function () {

		// });

		// it('should set .options.verbose to true by default', function () {

		// });
	});
});
