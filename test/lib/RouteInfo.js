module.exports = function (should) {
	describe('RouteInfo', function () {
		var RouteInfo = require('../../lib/RouteInfo');
		var validUrlPath = '/beagle/bark';
		var validCMPath = 'beagle#bark';
		var validCMPathWithFolder = 'dogs/beagle#bark';
		var validCMPathFile = 'beagle.js';
		var validCMPathWithFolderFile = 'dogs/beagle.js';
		var validCMPathMethod = 'bark';
		var validCMPathWithFolderMethod = 'bark';
		var invalidCMPath = 'oh/alderaan';
		var invalidCMPathWithFolder = 'oh/noes/alderaan';

		/*
		It should  be flexible to catch some inconsistencies or typos, but catching
		all cases for a bad URL path is not this function's task.
		*/
		describe('#sanitizeUrlPath()', function () {
			it('should return the URL path if it is already valid', function () {
				(new RouteInfo).sanitizeUrlPath('/').should.equal('/');
				(new RouteInfo).sanitizeUrlPath(validUrlPath).should.equal(validUrlPath);
			});

			it('should return the URL path preceeded by a /', function () {
				(new RouteInfo).sanitizeUrlPath('/beagle/bark').should.equal(validUrlPath);
				(new RouteInfo).sanitizeUrlPath('beagle/bark').should.equal(validUrlPath);
			});

			it('should return the URL path without a trailing /', function () {
				(new RouteInfo).sanitizeUrlPath('/beagle/bark/').should.equal(validUrlPath);
				(new RouteInfo).sanitizeUrlPath('beagle/bark/').should.equal(validUrlPath);
			});

			it('should return the URL path without any whitespaces at the start and end', function () {
				(new RouteInfo).sanitizeUrlPath(' /beagle/bark').should.equal(validUrlPath);
				(new RouteInfo).sanitizeUrlPath('  /beagle/bark').should.equal(validUrlPath);
				(new RouteInfo).sanitizeUrlPath('	/beagle/bark').should.equal(validUrlPath);
				(new RouteInfo).sanitizeUrlPath('/beagle/bark ').should.equal(validUrlPath);
				(new RouteInfo).sanitizeUrlPath('/beagle/bark  ').should.equal(validUrlPath);
				(new RouteInfo).sanitizeUrlPath('/beagle/bark	').should.equal(validUrlPath);
				(new RouteInfo).sanitizeUrlPath(' /beagle/bark ').should.equal(validUrlPath);
				(new RouteInfo).sanitizeUrlPath('	/beagle/bark	').should.equal(validUrlPath);
			});
		});

		describe('#isValidMMPath()', function () {
			it('should return true if the CM path is valid', function () {
				(new RouteInfo).isValidMMPath(validCMPath).should.equal(true);
				(new RouteInfo).isValidMMPath(validCMPathWithFolder).should.equal(true);

				(new RouteInfo).isValidMMPath('/' + validCMPath).should.equal(true);
				(new RouteInfo).isValidMMPath('/' + validCMPathWithFolder).should.equal(true);

				(new RouteInfo).isValidMMPath(validCMPath + '/').should.equal(true);
				(new RouteInfo).isValidMMPath(validCMPathWithFolder + '/').should.equal(true);

				(new RouteInfo).isValidMMPath('/' + validCMPath + '/').should.equal(true);
				(new RouteInfo).isValidMMPath('/' + validCMPathWithFolder + '/').should.equal(true);
			});

			it('should return false if the CM path does not contain a #', function () {
				(new RouteInfo).isValidMMPath(invalidCMPath).should.equal(false);
				(new RouteInfo).isValidMMPath(invalidCMPathWithFolder).should.equal(false);

				(new RouteInfo).isValidMMPath('/' + invalidCMPath).should.equal(false);
				(new RouteInfo).isValidMMPath('/' + invalidCMPathWithFolder).should.equal(false);

				(new RouteInfo).isValidMMPath(invalidCMPath + '/').should.equal(false);
				(new RouteInfo).isValidMMPath(invalidCMPathWithFolder + '/').should.equal(false);

				(new RouteInfo).isValidMMPath('/' + invalidCMPath + '/').should.equal(false);
				(new RouteInfo).isValidMMPath('/' + invalidCMPathWithFolder + '/').should.equal(false);
			});

			it('should return false if there is no controller name', function () {
				(new RouteInfo).isValidMMPath('#bark').should.equal(false);
			});

			it('should return false if there is no method name', function () {
				(new RouteInfo).isValidMMPath('beagle#').should.equal(false);
			});
		});

		describe('#getModulePath()', function () {
			it('should return the relative path of the controller appended with .js', function () {
				(new RouteInfo).getModulePath(validCMPath).should.equal(validCMPathFile);
				(new RouteInfo).getModulePath(validCMPathWithFolder).should.equal(validCMPathWithFolderFile);
			});
		});

		describe('#getMethod()', function () {
			it('should return the name of the method', function () {
				(new RouteInfo).getMethod(validCMPath).should.equal(validCMPathMethod);
				(new RouteInfo).getMethod(validCMPathWithFolder).should.equal(validCMPathWithFolderMethod);
			});
		});
	});
};