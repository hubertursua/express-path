module.exports = function (should) {
	describe('RouteMap', function () {
		var RouteMap = require('../../lib/RouteMap');
		var validPath = __dirname + '/../dummies/controller.js';
		var invalidPath = __dirname + '/oh/alderaan';
		var validRouteMapPath = __dirname + '/../dummies/routeMap.js';
		var validRouteMap = require(validRouteMapPath);

		describe('#getFile()', function () {
			it('should return the contents of the file if path exists', function () {
				(new RouteMap()).getFile(validPath).should.equal(require(validPath));
			});

			it('should throw an error when file could not be retrieved', function () {
				(function(){
					(new RouteMap()).getFile(invalidPath);
				}).should.throw();
			});
		});

		describe('#isValid()', function () {
			it('should return true if an array was passed', function () {
				(new RouteMap()).isValid([]).should.equal(true);
			});

			it('should return false if anything other than an array was passed', function () {
				(new RouteMap()).isValid(100).should.equal(false);
				(new RouteMap()).isValid('').should.equal(false);
				(new RouteMap()).isValid({}).should.equal(false);
				(new RouteMap()).isValid(null).should.equal(false);
			});
		});

		describe('#eval()', function () {
			var routeFileContents = 'dancing trex';
			var routeArray = [
				['/beagle/bark', 'beagle#bark'],
				['/beagle/sit', 'beagle#sit']
			];

			var routeMap = new RouteMap();
			routeMap.getRouteFile = function () {
				return routeFileContents;
			};

			it('should return contents from a file if a string was passed', function () {
				routeMap.eval(validRouteMapPath).should.equal(validRouteMap);
			});

			it('should return back the value if an array was passed', function () {
				routeMap.eval(routeArray).should.equal(routeArray);
			});
		});
	});
};