var should = require("should");

describe('ErrorHandler', function () {
	var ErrorHandler = require('../../lib/ErrorHandler');
	var msg = 'fresh peaches';

	describe('#()', function () {
		var errorHandler = new ErrorHandler();

		describe('.options', function () {
			describe('.logger', function () {
				it('should be equal to console.log() by default', function () {
					errorHandler.options.logger.should.equal(console.log);
				});
			});

			describe('.strict', function () {
				it('should be equal to true by default', function () {
					errorHandler.options.strict.should.equal(true);
				});
			});

			describe('.verbose', function () {
				it('should be equal to true by default', function () {
					errorHandler.options.verbose.should.equal(true);
				});
			});
		});
	});

	describe('#({ strict: true })', function () {
		var errorHandler = new ErrorHandler({ strict: true, logger: function() { /* silence the logger */ } });

		describe('.options', function () {
			describe('.strict', function () {
				it('should be equal to true ', function () {
					errorHandler.options.strict.should.equal(true);
				});
			});
		});

		describe('#log()', function () {
			it('should throw an error', function () {
				(function(){
					errorHandler.log(msg);
				}).should.throw();
			});

			it('should throw an error labeled exactly like the log message', function () {
				(function(){
					errorHandler.log(msg);
				}).should.throw(msg);
			});
		});
	});

	describe('#({ strict: false })', function () {
		var errorHandler = new ErrorHandler({ strict: false, logger: function() { /* silence the logger */ } });

		describe('.options', function () {
			describe('.strict', function () {
				it('should be equal to false ', function () {
					errorHandler.options.strict.should.equal(false);
				});
			});
		});

		describe('#log()', function () {
			it('should not throw an error', function () {
				(function(){
					errorHandler.log(msg);
				}).should.not.throw();
			});
		});
	});

	describe('#({ verbose: true })', function () {
		describe('.options', function () {
			describe('.verbose', function () {
				var errorHandler = new ErrorHandler({ verbose: true });

				it('should be equal to true ', function () {
					errorHandler.options.verbose.should.equal(true);
				});
			});
		});

		describe('#log()', function () {

			it('should call the logger function', function (done) {
				var errorHandler = new ErrorHandler({
					strict: false, // Silence error-throwing
					verbose: true,
					logger: function (m) {
						if(msg == m) {
							done();
						}
						else {
							done(new Error());
						}
					}
				});

				errorHandler.log(msg);
			});
		});
	});

	describe('#({ verbose: false })', function () {
		describe('.options', function () {
			describe('.verbose', function () {
				var errorHandler = new ErrorHandler({ verbose: false });

				it('should be equal to false ', function () {
					errorHandler.options.verbose.should.equal(false);
				});
			});
		});

		describe('#log()', function () {
			it('should not call the logger function', function () {
				var errorHandler = new ErrorHandler({
					strict: false, // Silence error-throwing
					verbose: false,
					logger: function (m) {
						done(new Error());
					}
				});

				errorHandler.log(msg);
			});
		});
	});
});