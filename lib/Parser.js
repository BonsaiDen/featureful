// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var path = require('path'),
    Bluebird = require('bluebird'),
    featureParser = require('./feature'),
    util = require('./util');


// Interface ------------------------------------------------------------------
function Parser(options) {

    // Configuration
    this._options = {
        features: options.features,
        tests: options.tests,
        prefix: options.prefix || '###',
        framework: options.framework || 'mocha',
        language: options.language,
        keywords: options.keywords
    };

    // Load Framework Implementation
    this._framework = null;

    // Load builtin framework
    var framework;
    try {
        framework = require(path.join(__dirname, 'framework', options.framework + '.js'));
        this._framework = new framework();

    } catch(err) {

        // Load custom framework
        try {
            framework = require(options.framework);
            this._framework = new framework();

        } catch(err) {
            throw new Error('Unable to load test support framework for "' + options.framework + '"');
        }

    }

}


// Statics --------------------------------------------------------------------
Parser.parseAST = function(filename) {
    var ast = featureParser(filename);
    console.log(JSON.stringify(ast.toJSON(), '', 2));
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
                    spec.setFeatures(featureParser(
                        spec.getFeatures(),
                        options.language,
                        options.keywords,
                        true

                    ).features);
                }

                // Parse Test File
                if (spec.hasTests()) {
                    spec.setTests(framework.parse(spec.getTests(), options.prefix));
                }

            });

            return specs;

        });

    },

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Parser;

