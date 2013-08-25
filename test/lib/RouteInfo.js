var should = require("should");

describe('RouteInfo', function () {
	var RouteInfo = require('../../lib/RouteInfo');
	var validUrlPath = '/beagle/bark';
	var validMMPath = 'beagle#bark';
	var validMMPathWithFolder = 'dogs/beagle#bark';
	var validMMPathFile = 'beagle.js';
	var validMMPathWithFolderFile = 'dogs/beagle.js';
	var validMMPathMethod = 'bark';
	var validMMPathWithFolderMethod = 'bark';
	var invalidMMPath = 'oh/alderaan';
	var invalidMMPathWithFolder = 'oh/noes/alderaan';

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

	describe('#sanitizeMMPath()', function () {
		it('should return the URL path if it is already valid', function () {
			(new RouteInfo).sanitizeMMPath('/').should.equal('/');
			(new RouteInfo).sanitizeMMPath(validMMPath).should.equal(validMMPath);
		});

		it('should return the URL path preceeded by a /', function () {
			(new RouteInfo).sanitizeMMPath('/beagle#bark').should.equal(validMMPath);
			(new RouteInfo).sanitizeMMPath('beagle#bark').should.equal(validMMPath);
		});

		it('should return the URL path without a trailing /', function () {
			(new RouteInfo).sanitizeMMPath('/beagle#bark/').should.equal(validMMPath);
			(new RouteInfo).sanitizeMMPath('beagle#bark/').should.equal(validMMPath);
		});

		it('should return the URL path without any whitespaces at the start and end', function () {
			(new RouteInfo).sanitizeMMPath(' /beagle#bark').should.equal(validMMPath);
			(new RouteInfo).sanitizeMMPath('  /beagle#bark').should.equal(validMMPath);
			(new RouteInfo).sanitizeMMPath('	/beagle#bark').should.equal(validMMPath);
			(new RouteInfo).sanitizeMMPath('/beagle#bark ').should.equal(validMMPath);
			(new RouteInfo).sanitizeMMPath('/beagle#bark  ').should.equal(validMMPath);
			(new RouteInfo).sanitizeMMPath('/beagle#bark	').should.equal(validMMPath);
			(new RouteInfo).sanitizeMMPath(' /beagle#bark ').should.equal(validMMPath);
			(new RouteInfo).sanitizeMMPath('	/beagle#bark	').should.equal(validMMPath);
		});
	});

	describe('#isValidMMPath()', function () {
		it('should return true if the MM path is valid', function () {
			(new RouteInfo).isValidMMPath(validMMPath).should.equal(true);
			(new RouteInfo).isValidMMPath(validMMPathWithFolder).should.equal(true);

			(new RouteInfo).isValidMMPath('/' + validMMPath).should.equal(true);
			(new RouteInfo).isValidMMPath('/' + validMMPathWithFolder).should.equal(true);

			(new RouteInfo).isValidMMPath(validMMPath + '/').should.equal(true);
			(new RouteInfo).isValidMMPath(validMMPathWithFolder + '/').should.equal(true);

			(new RouteInfo).isValidMMPath('/' + validMMPath + '/').should.equal(true);
			(new RouteInfo).isValidMMPath('/' + validMMPathWithFolder + '/').should.equal(true);
		});

		it('should return false if the MM path does not contain a #', function () {
			(new RouteInfo).isValidMMPath(invalidMMPath).should.equal(false);
			(new RouteInfo).isValidMMPath(invalidMMPathWithFolder).should.equal(false);

			(new RouteInfo).isValidMMPath('/' + invalidMMPath).should.equal(false);
			(new RouteInfo).isValidMMPath('/' + invalidMMPathWithFolder).should.equal(false);

			(new RouteInfo).isValidMMPath(invalidMMPath + '/').should.equal(false);
			(new RouteInfo).isValidMMPath(invalidMMPathWithFolder + '/').should.equal(false);

			(new RouteInfo).isValidMMPath('/' + invalidMMPath + '/').should.equal(false);
			(new RouteInfo).isValidMMPath('/' + invalidMMPathWithFolder + '/').should.equal(false);
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
			(new RouteInfo).getModulePath(validMMPath).should.equal(validMMPathFile);
			(new RouteInfo).getModulePath(validMMPathWithFolder).should.equal(validMMPathWithFolderFile);
		});
	});

	describe('#getMethod()', function () {
		it('should return the name of the method', function () {
			(new RouteInfo).getMethod(validMMPath).should.equal(validMMPathMethod);
			(new RouteInfo).getMethod(validMMPathWithFolder).should.equal(validMMPathWithFolderMethod);
		});
	});
});
