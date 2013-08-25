var should = require("should");
var _ = require('underscore');

describe('[ACCEPTANCE]', function () {
	describe('express-path', function () {
		var expressPath = require('../lib/express-path');

		var appExpect = (function () {
			var self = this;

			self.expectedHttpRequestMethod = '';
			self.expectedUrlPath = '';
			self.expectedMiddlewares = '';
			self.expectedMethod = '';

			self.receivedHttpRequestMethod = null;
			self.receivedUrlPath = null;
			self.receivedMiddlewares = null;
			self.receivedMethod = null;

			self.init = function (httpRequestMethod, urlPath, middlewares, method) {
				self.expectedHttpRequestMethod = httpRequestMethod;
				self.expectedUrlPath = urlPath;
				self.expectedMiddlewares = middlewares;
				self.expectedMethod = method;

				self.receivedHttpRequestMethod = null;
				self.receivedUrlPath = null;
				self.receivedMiddlewares = null;
				self.receivedMethod = null;
			};

			self.isMappedCorrectly = function () {
				return (
					self.receivedHttpRequestMethod === self.expectedHttpRequestMethod.toLowerCase() &&
					self.receivedUrlPath === self.expectedUrlPath &&
					JSON.stringify(self.receivedMiddlewares) === JSON.stringify(self.expectedMiddlewares) &&
					self.receivedMethod === self.expectedMethod
				);
			};

			var receiveMapping = function (httpRequestMethod, fnArgs) {
				self.receivedHttpRequestMethod = httpRequestMethod;

				for(var i = 0; i < fnArgs.length; ++i) {
					if(i === 0) {
						self.receivedUrlPath = fnArgs[i];
					}
					else if(i === fnArgs.length - 1) {
						self.receivedMethod = fnArgs[i];
					}
					else {
						self.receivedMiddlewares = fnArgs[i];
					}
				}
			};

			// Only using ALL, GET, and POST as HTTP verbs for testing

			self.all = function () {
				receiveMapping('all', arguments);
			};

			self.get = function () {
				receiveMapping('get', arguments);
			};

			self.post = function () {
				receiveMapping('post', arguments);
			};

			return self;
		})();

		describe('#()', function () {
			var testMapping = function (httpRequestMethod, urlPath, middlewares, method, route, expectedResult) {
				expectedResult = (typeof expectedResult !== 'undefined' ? expectedResult : true);

				var localApp = _.clone(appExpect);
				localApp.init(httpRequestMethod, urlPath, middlewares, method);

				var routeMap = [route];

				var createExpressPath = function () {
					expressPath(localApp, routeMap, {
						'expressRoot': __dirname + '/dummies/express/',
						'verbose': false
					});
				};

				if(expectedResult) {
					createExpressPath();
					localApp.isMappedCorrectly().should.equal(expectedResult);
				}
				else {
					createExpressPath.should.throw();
				}
			};

			var addTest = function (verb, verbCasing, urlPath, controllerPath, methodName, middlewares, expectedUrlPath, expectedControllerPath, expectedMethod, expectedMiddlewares, expectedResult) {
				var verbString = verb;
				if(!verbString) {
					verbString = 'null';
				}

				var expectedString = (expectedResult ? 'allow' : 'not allow');
				var existingString = (expectedResult ? 'existing route' : 'missing route');

				var itString = 'should ' + expectedString + ' ' + verbString.toUpperCase() +
				               ' (' + verbCasing + ') requests for the ' +
				               existingString + ' ' + urlPath + ' => ' +
				               controllerPath + '#' + methodName +
				               ' with ' + middlewares.length + ' middleware(s)';

				it(itString, function () {
					var routeMap = [];
					routeMap.push(urlPath);
					routeMap.push(controllerPath + '#' + methodName);
					for(var m in middlewares) {
						routeMap.push(middlewares[m]);
					}
					routeMap.push(verb);

					testMapping(
						verb,
						expectedUrlPath,
						expectedMiddlewares,
						require('./dummies/express/controllers/' + expectedControllerPath)[expectedMethod],
						routeMap,
						expectedResult
					);
				});
			};

			var VERBS = [null, 'all', 'get', 'post'];
			var VERB_CASINGS = ['lowercase', 'uppercase'];
			var ROUTES = [
				{
					urlPath: 'llama',
					controllerPath: 'llama',
					methodName: 'index',
					existing: true
				},
				{
					urlPath: 'beagle/bark',
					controllerPath: 'beagle',
					methodName: 'bark',
					existing: true
				},
				{
					urlPath: 'beagle',
					controllerPath: 'beagle',
					methodName: 'index',
					existing: false
				},
				{
					urlPath: 'beagle/meow',
					controllerPath: 'beagle',
					methodName: 'meow',
					existing: false
				},
				{
					urlPath: 'flying/llama',
					controllerPath: 'flying/llama',
					methodName: 'index',
					existing: true
				},
				{
					urlPath: 'dancing/beagle/bark',
					controllerPath: 'dancing/beagle',
					methodName: 'bark',
					existing: true
				},
				{
					urlPath: 'dancing/beagle',
					controllerPath: 'dancing/beagle',
					methodName: 'index',
					existing: false
				},
				{
					urlPath: 'dancing/beagle/meow',
					controllerPath: 'dancing/beagle',
					methodName: 'meow',
					existing: false
				}
			];
			var MIDDLEWARES = [
				{
					middlewarePaths: [],
					existing: true,
					expected: []
				},
				{
					middlewarePaths: ['auth#loggedIn'],
					existing: true,
					expected: [require('./dummies/express/middlewares/auth').loggedIn]
				},
				{
					middlewarePaths: ['auth#isAdmin'],
					existing: true,
					expected: [require('./dummies/express/middlewares/auth').isAdmin]
				},
				{
					middlewarePaths: ['auth#loggedIn', 'auth#isAdmin'],
					existing: true,
					expected: [require('./dummies/express/middlewares/auth').loggedIn, require('./dummies/express/middlewares/auth').isAdmin]
				},
				{
					middlewarePaths: ['auth#isSomethingElse'],
					existing: false
				},
				{
					middlewarePaths: ['auth#isAdmin', 'auth#isSomethingElse'],
					existing: false
				}
			];

			for(var a in VERBS) {
				var verb = VERBS[a];

				for(var b in VERB_CASINGS) {
					var verbCasing = VERB_CASINGS[b];

					if(verb !== null) {
						if(verbCasing === 'lowercase') {
							verb = verb.toLowerCase();
						}
						else if(verbCasing === 'uppercase') {
							verb = verb.toUpperCase();
						}
					}

					for(var c in ROUTES) {
						var route = ROUTES[c];


						for(var d = 0; d < MIDDLEWARES.length; ++d) {
							var middleware = MIDDLEWARES[d];

							// Loop through all the combinations of 4 boolean parameters related to slashes
							for(var e = 0; e < Math.pow(2, 4); ++e) {
								// Not sure if this is the best way, but this gives me a fixed length (with leading zeros) binary string
								var binary = (parseInt(e.toString(2)) + (Math.pow(10, (Math.pow(2, 4) - 1).toString(2).length))).toString().substr(1);

								var prependSlashUrl = (binary.substr(0, 1) == '1' ? '/' : '');
								var appendSlashUrl = (binary.substr(1, 1) == '1' ? '/' : '');
								var prependSlashCM = (binary.substr(2, 1) == '1' ? '/' : '');
								var appendSlashCM = (binary.substr(3, 1) == '1' ? '/' : '');

								addTest(
									verb,
									verbCasing,
									prependSlashUrl + route.urlPath + appendSlashUrl,
									prependSlashCM + route.controllerPath,
									route.methodName + appendSlashCM,
									middleware.middlewarePaths,
									'/' + route.urlPath,
									route.controllerPath,
									route.methodName,
									middleware.expected,
									(verb !== null) && route.existing && middleware.existing
								);
							}
						}
					}
				}
			}
		});
	});
});
