'use strict';

// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Parser = require('../lib/Parser'),
    Validator = require('../lib/Validator');


// Grunt Tasks Definition -----------------------------------------------------
module.exports = function(grunt) {

    // Task Definition --------------------------------------------------------
    grunt.registerMultiTask('featureful', 'Test', function() {

        // Make this an async grunt task
        var done = this.async(),
            options = this.options();

        var parser = new Parser(options);
        parser.matchSpecs().then(function(specs) {

            grunt.log.ok('Comparing Test and Features...');

            var validator = new Validator(options),
                error = validator.compare(specs);

            if (error) {
                console.log(error);
                done(new Error('Test and Features do not match!'));

            } else {
                grunt.log.ok('Tests and Features are up to date.');
                done();
            }

        }, function(err) {
            grunt.fail.fatal(err);
        });

    });

};

