// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var path = require('path'),
    Bluebird = require('bluebird'),
    glob = require('glob'),
    Spec = require('./Spec'),
    featureParser = require('./feature'),
    util = require('./util');


// Interface ------------------------------------------------------------------
function Parser(options) {

    // Configuration
    this._options = {
        features: options.features,
        tests: options.tests,
        framework: options.framework || 'mocha',
        keywords: options.keywords
    };

    // Load Framework Implementation
    this._framework = null;

    // Load builtin framework
    var Framework;
    try {
        Framework = require(path.join(__dirname, 'framework', options.framework + '.js'));
        this._framework = new Framework();

    } catch(err) {

        // Load custom framework
        try {
            Framework = require(options.framework);
            this._framework = new Framework();

        } catch(err) {
            throw new Error('Unable to load test support framework for "' + options.framework + '"');
        }

    }

}


// Statics --------------------------------------------------------------------
Parser.parseFeatureFromPatterns = function(patterns) {

    var files = [];
    patterns.forEach(function(pattern) {
        glob.sync(pattern).forEach(function(file) {
            if (files.indexOf(file) === -1) {
                files.push(file);
            }
        });
    });

    return files.map(function(file) {

        var ast = featureParser(file, false, true);
        if (ast instanceof Error) {
            throw ast;

        } else {
            return ast;
        }

    });

};


// Methods --------------------------------------------------------------------
Parser.prototype = {

    matchSpecs: function() {

        var that = this,
            options = this._options,
            framework = this._framework;

        return Bluebird.props({
            features: util.getFilesFromPattern(options.features.pattern),
            tests: util.getFilesFromPattern(options.tests.pattern)

        }).then(function(files) {
            // TODO error out in case of duplicate Feature Names in Specs
            // TODO error out in case of duplicate Scenario Names in Features
            // TODO error out in case of duplicate Assertions Names in Scenarios
            return that._getSpecsFromFiles(files, options, framework);
        });

    },

    _getSpecsFromFiles: function(files, options, framework) {

        // Set structure for specs
        var set = {};

        // Go through all found feature files and create feature entries
        files.features.forEach(function(path) {

            // Parse Features From File and
            featureParser(path.fullpath, true, false).features.forEach(function(feature) {

                // TODO figure out linking from a @spec tag or comment ?

                // Unique Spec ID, by default this is the name of the feature
                var sid = feature.getTitle();

                // Create a new spec for the feature
                var spec = (set[sid] || new Spec(sid, {
                    filename: path.fullpath,
                    col: -1,
                    line: -1
                }));

                // TODO figure out the possible list of filenames for all features
                // from tests that are missing implementations

                // Add feature to spec
                spec.addFeature(feature);

                // Set spec reference
                set[sid] = spec;

            });

        });

        // Go through all found test files and create test entries
        files.tests.forEach(function(path) {

            // Parse Tests from File
            framework.parse(path.fullpath, options.tests.prefix).forEach(function(test) {

                // TODO figure out linking from a @spec tag or comment ?

                // Unique Spec ID, by default this is the title of the test
                var sid = test.getTitle();

                // Re-use existing spec reference from feature file if it already
                // exists
                var spec = (set[sid] || new Spec(sid, {
                    filename: path.fullpath,
                    col: -1,
                    line: -1
                }));
                // TODO figure out the possible list of filenames for all tests
                // from features that are missing specification

                // Add test to spec
                spec.addTest(test);

                // Set spec reference
                set[sid] = spec;

            });

        });

        // Create final list of specs and sort them by their title
        var specs = [];
        for(var i in set) {
            if (set.hasOwnProperty(i)) {
                specs.push(set[i]);
            }
        }

        specs.sort(function(a, b) {
            return a.getTitle().localeCompare(b.getTitle());
        });

        return specs;

    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Parser;

