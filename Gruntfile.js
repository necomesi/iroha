module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-jsdoc');

	var libDir = 'project/src';

	grunt.initConfig({

		jsdoc: {
			options: {
				destination: 'jsdoc'
			},
			jsdoc: {
				src: [
					libDir + '/iroha/iroha.js'
				]
			}
		}

	});

};
