// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var path = require('path'),
    Bluebird = require('bluebird'),
    glob = require('glob'),
    Spec = require('./Spec'),
    featureParser = require('../feature'),
    util = require('../util');


// Spec Parser Interface ------------------------------------------------------
function Parser(options) {

    // Configuration
    this._options = {
        features: options.features,
        tests: options.tests,
        specs: options.specs || {}
    };

    // Defaults
    this._options.specs.matching = this._options.specs.matching || {};
    this._options.specs.ignores = this._options.specs.ignores || {};

    // Load Framework Implementation
    this._framework = null;

    // Load builtin framework
    var Framework;
    try {

        Framework = require(path.join(
            __dirname,
            '..', 'test', 'framework',
            options.tests.framework + '.js'
        ));

        this._framework = new Framework();

    } catch(err) {

        // Load custom framework
        try {
            Framework = require(options.tests.framework);
            this._framework = new Framework();

        } catch(err) {
            throw new Error('Unable to load test Framework for "' + options.tests.framework + '", ' + err);
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

    var results = [];
    for(var i = 0, l = files.length; i < l; i++) {
        try {
            results.push(featureParser(files[i], false, true));

        } catch(err) {
            return err;
        }
    }

    return results;

};


// Methods --------------------------------------------------------------------
Parser.prototype = {

    // Public -----------------------------------------------------------------
    matchSpecs: function() {

        var options = this._options,
            framework = this._framework;

        return Bluebird.props({
            features: util.getFilesFromPattern(options.features.pattern),
            tests: util.getFilesFromPattern(options.tests.pattern)

        }).then(function(files) {
            return this._getSpecsFromFiles(files, options, framework);

        }.bind(this));

    },

    getFramework: function() {
        return this._framework;
    },


    // Internal ---------------------------------------------------------------
    _getSpecsFromFiles: function(files, options, framework) {

        var matcher = this._getMatcher(options),
            ignores = this._getIgnores(options),
            set = {};

        // Go through all found feature files and create feature entries
        files.features.forEach(function(path) {

            // Parse Features From File and
            featureParser(path.fullpath, true, false).getFeatures().forEach(function(feature) {

                // Unique Spec ID, by default this is the name of the feature
                var sid = matcher(feature, path, options),
                    ignored = ignores && ignores(feature, path, options);

                if (sid !== null && ignored !== true) {

                    // Re-use existing spec reference from another feature file
                    // if it already exists
                    var spec = (set[sid] || new Spec(sid, {
                        filename: path.fullpath,
                        column: -1,
                        line: -1
                    }));

                    // Add feature to spec
                    spec.addFeature(feature);

                    // Filter Features
                    if (ignores) {
                        spec.filterFeatures(ignores, path, options);
                    }

                    // Set spec reference
                    // TODO test undefined / null filenames
                    set[sid] = spec;

                }

            });

        });

        // Go through all found test files and create test entries
        files.tests.forEach(function(path) {

            // Parse Tests from File
            framework.parse(path.fullpath, options.tests).forEach(function(test) {

                // Unique Spec ID, by default this is the title of the test
                var sid = matcher(test, path, options),
                    ignored = ignores && ignores(test, path, options);

                if (sid !== null && ignored !== true) {

                    // Re-use existing spec reference from feature file if it
                    // already exists
                    var spec = (set[sid] || new Spec(sid, {
                        filename: path.fullpath,
                        column: -1,
                        line: -1
                    }));

                    // Add test to spec
                    spec.addTest(test);

                    // Filter Tests etc.
                    if (ignores) {
                        spec.filterTests(ignores, path, options);
                    }

                    // Set spec reference
                    // TODO test undefined / null filenames
                    set[sid] = spec;

                }

            });

        });

        // Create final list of specs and sort them by their title
        var specs = [];
        for(var i in set) {

            /* istanbul ignore else */
            if (set.hasOwnProperty(i)) {
                specs.push(set[i]);
            }

        }

        // Sort Specs by Title
        specs.sort(function(a, b) {
            return a.getTitle().localeCompare(b.getTitle());
        });

        return specs;

    },

    _getMatcher: function(options) {
        if (typeof options.specs.matching === 'function') {
            return options.specs.matching;

        } else if (typeof options.specs.matching.type === 'string') {
            return Parser.Matchers[options.specs.matching.type];
        } else {
            return Parser.Matchers.title;
        }
    },


    _getIgnores: function(options) {

        if (typeof options.specs.ignores === 'function') {
            return options.specs.ignores;

        } else if (typeof options.specs.ignores.type === 'string') {
            return Parser.Ignores[options.specs.ignores.type];

        } else {
            return false;
        }
    }

};


// Spec Matchers --------------------------------------------------------------
Parser.Matchers = {

    title: function(obj, path) {
        return obj.getTitle();
    },

    path: function(obj, path) {
        return path.id;
    },

    tag: function(obj, path, options) {

        var tags = obj.getTags();

        for(var i = 0, l = tags.length; i < l; i++) {
            /* istanbul ignore else */
            if (options.specs.matching.pattern.test(tags[i])) {
                return tags[i];
            }
        }

        return null;

    }

};


// Ingore Handlers ------------------------------------------------------------
Parser.Ignores = {

    tag: function(obj, path, options) {

        var tags = obj.getTags();

        for(var i = 0, l = tags.length; i < l; i++) {
            /* istanbul ignore else */
            if (options.specs.ignores.pattern.test(tags[i])) {
                return true;
            }
        }

        return false;

    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Parser;

