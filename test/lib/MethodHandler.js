var should = require("should");

describe('MethodHandler', function () {
	var MethodHandler = require('../../lib/MethodHandler');

	var beagle = new function () {
		this.bark = function () {
			return "woof!";
		}

		return this;
	};

	var nullCat;

	describe('#exists()', function () {
		it('should return true if the method exists', function () {
			(new MethodHandler()).exists('bark', beagle).should.equal(true);
		});

		it('should return false if the method does not exist', function () {
			(new MethodHandler()).exists('purr', beagle).should.equal(false);
		});

		it('should throw an error if there is no instance', function () {
			(function(){
				(new MethodHandler()).exists('bark', nullCat);
			}).should.throw("Cannot read property 'bark' of undefined");
		});
	});

	describe('#get()', function () {
		it('should throw an error if there is no instance', function () {
			(function(){
				(new MethodHandler()).get('bark', nullCat);
			}).should.throw("Cannot read property 'bark' of undefined");
		});

		it('should return undefined if the method does not exist', function () {
			var mi = (new MethodHandler()).get('meow', beagle);
			should.not.exist(mi);
		});

		it('should return the method if it exists', function () {
			(new MethodHandler()).get('bark', beagle).should.equal(beagle.bark);
		});
	});
});
