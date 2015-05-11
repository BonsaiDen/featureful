module.exports = function(grunt) {

    grunt.registerTask('gherkin', 'Update tests', function() {

        grunt.log.ok('Updating tests...');

        var done = this.async(),
            Generator = require('../index'),
            gen = new Generator({

                features: {
                    pattern: process.cwd() + '/feature/**/*.feature',
                },

                tests: {
                    pattern: process.cwd() + '/test/**/*.test.js',
                },

                framework: 'mocha'

            });

        gen.parse().then(function(specs) {
            gen.compare(specs);
            grunt.log.ok('Done');
            done();

        }, done);

    });

};

