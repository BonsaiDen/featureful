'use strict';

// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Parser = require('../lib/spec/Parser'),
    Validator = require('../lib/validator/Validator');


// Grunt Tasks Definition -----------------------------------------------------
module.exports = function(grunt) {

    // Task Definition --------------------------------------------------------
    grunt.registerMultiTask('featureful', 'Automatically verifies tests implementations against cucumber feature specs.', function() {

        var done = this.async(),
            options = this.options();

        var parser = new Parser(options);
        parser.matchSpecs().then(function(specs) {

            grunt.log.ok('Comparing Test and Features...');

            var validator = new Validator(options),
                error = validator.compare(specs);

            if (error) {
                grunt.log.writeln(error.format());
                done(new Error('Tests and Features do not match!'));

            } else {
                grunt.log.ok('Tests and Features are up to date.');
                done();
            }

        }, function(err) {
            grunt.fail.fatal(err);
        });

    });

};

