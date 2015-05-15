// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var path = require('path'),
    Bluebird = require('bluebird'),
    glob = require('glob'),
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

        var options = this._options,
            framework = this._framework;

        return Bluebird.props({
            features: util.getFilesFromPattern(options.features.pattern),
            tests: util.getFilesFromPattern(options.tests.pattern)

        }).then(function(files) {

            var specs = util.getSpecsFromFiles(files);

            specs.map(function(spec) {

                // Parse Feature File
                if (spec.hasFeatures()) {
                    spec.setFeatures(
                        featureParser(spec.getFeatures(), true, false).features
                    );
                }

                // Parse Test File
                if (spec.hasTests()) {
                    spec.setTests(
                        framework.parse(spec.getTests(), options.tests.prefix)
                    );
                }

            });

            return specs;

        });

    },

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Parser;

