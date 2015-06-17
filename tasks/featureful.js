'use strict';

// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Parser = require('../lib/spec/Parser'),
    Validator = require('../lib/validator/Validator'),
    Reporter = require('../lib/reporter/Reporter');


// Grunt Tasks Definition -----------------------------------------------------
module.exports = function(grunt) {

    // Task Definition --------------------------------------------------------
    grunt.registerMultiTask('featureful', 'Automatically verifies tests implementations against cucumber feature specs.', function() {

        var done = this.async(),
            options = this.options();

        try {
            var parser = new Parser(options);
            parser.matchSpecs().then(function(specs) {

                // Reporting
                if (options.reporter) {
                    grunt.log.ok('Rewriting existing junit XML report...');
                    Reporter.rewrite(specs, options.reporter.pattern);
                    done();

                // Validation
                } else {

                    grunt.log.ok('Comparing Test and Features...');

                    var validator = new Validator(options),
                        error = validator.compare(specs);

                    if (error) {
                        grunt.log.writeln('\n' + error.format() + '\n');
                        done(new Error('Tests and Features do not match!'));

                    } else {
                        grunt.log.ok('Tests and Features are up to date.');
                        done();
                    }

                }

            });

        } catch(err) {
            grunt.fail.fatal(err);
        }

    });

};

