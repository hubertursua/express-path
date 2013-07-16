module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		removelogging: {
			dist: {
				src: "index.js",
				dest: "bin/index.js"
			}
		},
		uglify: {
			options: {
				banner: '// <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>) \n' +
						'// by <%= pkg.author %> \n' +
						'// <%= pkg.repository.url %> \n'
			},
			build: {
				src: 'bin/index.js',
				dest: 'bin/index.js'
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-remove-logging');

	// Default task(s).
	grunt.registerTask('default', ['uglify']);
};