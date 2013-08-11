module.exports = function (opt) {
	var self = this;
	opt = opt || {};

	this.options = {
		logger: ((typeof opt.logger === 'undefined') ? console.log : opt.logger),
		strict:  ((typeof opt.strict === 'undefined') ? true : opt.strict),
		verbose: ((typeof opt.verbose === 'undefined') ? true : opt.verbose)
	};

	this.log = function (msg) {
		if(self.options.verbose) {
			self.options.logger(msg);
		}

		if(self.options.strict) {
			throw new Error(msg);
		}
	}

	return this;
};