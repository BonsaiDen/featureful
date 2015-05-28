// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var path = require('path'),
    Parser = require('..').Parser,
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

    }

};

