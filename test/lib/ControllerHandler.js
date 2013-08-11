module.exports = function (should) {
	describe('ControllerHandler', function () {
		var ControllerHandler = require('../../lib/ControllerHandler');
		var validPath = __dirname + '/../dummies/controller.js';
		var invalidPath = __dirname + '/oh/alderaan';

		describe('#exists()', function () {
			var createControllerHandler = function () {
				var controllerHandler = new ControllerHandler();
				controllerHandler.existsChecker = function (controllerPath) {
					return (controllerPath === validPath);
				};

				return controllerHandler;
			};

			it('should return true if path exists', function () {
				var controllerHandler = createControllerHandler();
				controllerHandler.fileExists(validPath).should.equal(true);
			});

			it('should return false if path does not exist', function () {
				var controllerHandler = createControllerHandler();
				controllerHandler.fileExists(invalidPath).should.equal(false);
			});
		});

		describe('#getFile()', function () {
			it('should return the contents of the file if path exists', function () {
				(new ControllerHandler()).getFile(validPath).should.equal(require(validPath));
			});

			it('should throw an error when file could not be retrieved', function () {
				(function(){
					(new ControllerHandler()).getFile(invalidPath);
				}).should.throw();
			});
		});
	});
};