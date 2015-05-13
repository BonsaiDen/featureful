'use strict';

// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Parser = require('../lib/Parser'),
    Validator = require('../lib/Validator');


// Grunt Tasks Definition -----------------------------------------------------
module.exports = function(grunt) {

    // Task Definition --------------------------------------------------------
    grunt.registerMultiTask('featured', 'Test', function() {

        // Make this an async grunt task
        var done = this.async(),
            options = this.options();

        var parser = new Parser(options);
        parser.matchSpecs().then(function(specs) {

            var validator = new Validator(options);
            validator.compare(specs);
            done();

        }, function(err) {
            grunt.fail.fatal(err);
        });

    });

};

