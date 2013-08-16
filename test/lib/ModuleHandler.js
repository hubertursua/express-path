var should = require("should");

describe('ModuleHandler', function () {
	var ModuleHandler = require('../../lib/ModuleHandler');
	var validPath = __dirname + '/../dummies/controller.js';
	var invalidPath = __dirname + '/oh/alderaan';

	describe('#exists()', function () {
		var createModuleHandler = function () {
			var moduleHandler = new ModuleHandler();
			moduleHandler.existsChecker = function (controllerPath) {
				return (controllerPath === validPath);
			};

			return moduleHandler;
		};

		it('should return true if path exists', function () {
			var moduleHandler = createModuleHandler();
			moduleHandler.fileExists(validPath).should.equal(true);
		});

		it('should return false if path does not exist', function () {
			var moduleHandler = createModuleHandler();
			moduleHandler.fileExists(invalidPath).should.equal(false);
		});
	});

	describe('#getFile()', function () {
		it('should return the contents of the file if path exists', function () {
			(new ModuleHandler()).getFile(validPath).should.equal(require(validPath));
		});

		it('should throw an error when file could not be retrieved', function () {
			(function(){
				(new ModuleHandler()).getFile(invalidPath);
			}).should.throw();
		});
	});
});
