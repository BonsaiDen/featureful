// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var path = require('path'),
    Parser = require('..').Parser,
    Validator = require('../lib/validator/Validator'),
    featureParser = require('../lib/feature'),
    util = require('../lib/util');

// Disable colors in tests
util._noColor = true;

require('should');


// Test Framework -------------------------------------------------------------
global.framework = {

    parse: function(dir, options) {

        options = options || {};

        options.features = {
            pattern: dir + '/features/**/*.feature',
        };

        options.tests = {
            pattern: dir + '/tests/**/*.test.js',
            framework: 'mocha'
        };

        options.specs = {
            matching: options.matching
        };

        return new Parser(options);

    },

    parseFeature: function(filename) {
        try {
            return featureParser(filename, true);

        } catch(err) {
            return err;
        }
    },

    parseTest: function(framework, filename, prefix) {
        var Framework = require(path.join('../lib/test/framework', framework + '.js'));
        return new Framework().parse(filename, prefix);
    },

    match: function(dir, callback, done, options) {

        framework.parse(dir, options).matchSpecs().then(function(specs) {
            try {
                callback(specs, options);
                done();

            } catch(err) {
                done(err);
            }

        }, done);

    },

    validate: function(dir, id, callback, done, options) {

        options = options || {};

        options.features = {
            pattern: dir + '/features/' + id + '.feature'
        };

        options.tests = {
            pattern: dir + '/tests/' + id + '.test.js',
            framework: options.framework || 'mocha'
        };

        options.specs = {
            matching: options.matching || {
                type: 'path'
            }
        };

        new Parser(options).matchSpecs().then(function(specs) {

            var validator = new Validator(options),
                error = validator.compare(specs);

            try {
                callback(error, specs);
                done();

            } catch(err) {
                done(err);
            }

        }, done);

    }

};

