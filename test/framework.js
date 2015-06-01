// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var path = require('path'),
    Parser = require('..').Parser,
    Validator = require('../lib/Validator'),
    featureParser = require('../lib/feature');

require('should');


// Test Framework -------------------------------------------------------------
global.framework = {

    parse: function(dir) {

        return new Parser({

            features: {
                pattern: dir + '/features/**/*.feature',
            },

            tests: {
                pattern: dir + '/tests/**/*.test.js',
            },

            framework: 'mocha'

        });

    },

    parseFeature: function(filename) {
        return featureParser(filename, true);
    },

    parseTest: function(framework, filename, prefix) {
        var Framework = require(path.join('../lib/', 'framework', framework + '.js'));
        return new Framework().parse(filename, prefix);
    },

    match: function(dir, callback, done) {

        framework.parse(dir).matchSpecs().then(function(specs) {
            try {
                callback(specs);
                done();

            } catch(err) {
                done(err);
            }

        }, done);

    },

    validate: function(dir, id, callback, done, options) {

        var parser = new Parser({

            features: {
                pattern: dir + '/features/' + id + '.feature',
            },

            tests: {
                pattern: dir + '/tests/' + id + '.test.js',
            },

            framework: 'mocha'

        });

        parser.matchSpecs().then(function(specs) {

            var validator = new Validator(options),
                error = validator.compare(specs);

            try {
                callback(error);
                done();

            } catch(err) {
                done(err);
            }

        }, done);

    }

};

