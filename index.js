// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var path = require('path'),
    diff = require('diff'),
    Bluebird = require('bluebird'),
    parser = require('./lib/parser'),
    util = require('./lib/util');


// Interface ------------------------------------------------------------------
function Generator(options) {

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
        framework = require(path.join(__dirname, 'lib', 'framework', options.framework + '.js'));
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


// Methods --------------------------------------------------------------------
Generator.prototype = {

    // Parse the feature files and tests
    parse: function() {

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
                    spec.setFeatures(parser(
                        spec.getFeatures(),
                        options.language,
                        options.keywords

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

    // Compare test and feature files
    compare: function(specs) {

        var that = this,
            errors = [];

        specs.forEach(function(spec) {

            // Compare feature and test files
            if (spec.hasFeatures() && spec.hasTests()) {
                that._compareSpec(spec, errors);

            // Feature file without test file
            } else if (!spec.hasTests()) {
                errors.push({
                    message: 'Test implementation for feature is missing',
                    expected: 'a matching file at {{testLocation}}',
                    test: null,
                    feature: spec
                });

            // Test file without feature file
            } else {
                errors.push({
                    message: 'Feature specification for test is missing',
                    expected: 'a matching feature file at {{featureLocation}}',
                    test: spec,
                    feature: null
                });
            }

        });

        // Reverse errors so that highlevel ones are at the start
        errors.reverse();

        var formatted = errors.map(this._formatError.bind(this));
        console.log(formatted.join('\n\n'));

    },

    _compareSpec: function(spec, errors) {

        // Match up specs (files)
        util.matchUp(
            spec.getFeatures(),
            spec.getTests(),

            // Compare features and tests
            this._compareFeatureScenarios.bind(this, errors),

            // Feature without test implementation
            function(feature) {
                errors.push({
                    message: 'Feature is missing test implementation for:',
                    title: feature.getTitle(),
                    expected: 'a matching implementation in {{testLocation}}',
                    test: null,
                    feature: feature
                });

            // Test without feature specification
            }, function(test) {
                errors.push({
                    message: 'Test is missing feature specification for:',
                    title: test.getTitle(),
                    expected: 'a matching specification in {{featureLocation}}',
                    test: test,
                    feature: null
                });
            },

            // Maximum levenshtein distance
            10
        );

    },

    _compareFeatureScenarios: function(errors, feature, test, distance) {

        // Compare Feature Tags
        this._compareTags('Feature tags:', feature, test, errors);

        // Compare Feature Title
        if (distance !== 0) {
            errors.push({
                message: 'mismatch of Feature title',
                test: test,
                feature: feature
            });
        }

        if (feature.getDescription() !== test.getDescription()) {
            errors.push({
                message: 'mismatch of Feature description',
                description: true,
                test: test,
                feature: feature
            });
        }

        // Match up scenarios (test cases)
        util.matchUp(
            feature.getScenarios(),
            test.getScenarios(),
            this._compareScenarioExpecations.bind(this, errors),

            // Feature Scenario without test implementation
            function(feature) {
                errors.push({
                    message: 'Scenario is missing test implementation for:',
                    title: feature.getTitle(),
                    expected: 'a matching implementation in {{testLocation}}',
                    test: null,
                    feature: feature
                });

            // Test Scenario without feature implementation
            }, function(test) {
                errors.push({
                    message: 'Scenario in missing feature specification for:',
                    title: test.getTitle(),
                    expected: 'a matching specification in {{featureLocation}}',
                    test: test,
                    feature: null
                });
            },

            // Maximum levenshtein distance
            20
        );

    },

    _compareScenarioExpecations: function(errors, feature, test, distance) {

        // Compare scenario title
        if (distance !== 0) {
            errors.push({
                message: 'mismatch of Scenario title',
                test: test,
                feature: feature
            });
        }

        // Compare Scenario Tags
        this._compareTags('Scenario tags:', feature, test, errors);

        var expectationErrors = [];
        util.matchUp(
            feature.getExpectations(),
            test.getExpectations(),
            this._compareAssertion.bind(this, expectationErrors),

            // Feature Expectation without test implementation
            function(feature) {
                errors.push({
                    message: 'Expectation is missing test implementation for:',
                    title: feature.getTitle(),
                    expected: 'a matching implementation in {{testLocation}}',
                    test: null,
                    feature: feature
                });

            // Test Expectation without feature implementation
            }, function(test) {
                expectationErrors.push({
                    message: 'Expectation is missing feature specification for:',
                    title: test.getTitle(),
                    expected: 'a matching specification in {{featureLocation}}',
                    test: test,
                    feature: null
                });
            },

            // Maximum levenshtein distance
            20
        );

        // Sort Errors based on line number
        expectationErrors.sort(function(a, b) {
            return b.test.getLocation().line
                 - a.test.getLocation().line;
        });

        errors.push.apply(errors, expectationErrors);

    },

    _compareAssertion: function(errors, feature, test, distance) {

        // Compare expectation title
        if (distance > 0) {
            errors.push({
                message: 'Expectation title:',
                test: test,
                feature: feature
            });
        }

        // Compare Indexes
        this._compareIndex(feature, test, errors);

        // Check if the test implementation has a expression associated with it
        if (!test.hasExpression()) {
            errors.push({
                message: 'Expectation is missing actual implementation for:',
                title: test.getTitle(),
                test: test,
                feature: null
            });
        }

    },

    _compareTags: function(message, feature, test, errors) {

        var featureTags = feature.getTags().join(' '),
            testTags = test.getTags().join(' ');

        if (featureTags !== testTags) {

            errors.push({
                message: message,
                tags: true,
                test: test,
                feature: feature
            });

        }

    },

    _compareIndex: function(feature, test, errors) {
        console.log('index', feature.getIndex(), test.getIndex());
    },


    // Error Formatting -------------------------------------------------------
    _formatError: function(error) {

        var location = this._formatLocation((error.test || error.feature).getLocation());

        var msg = util.color('Error ' + location, util.color.Error),
            expected = '';

        // Message
        msg += '\n\n    ' + this._formatMessage(util.color(error.message, util.color.Message));

        // Title checks
        if (error.test && error.feature) {

            if (error.tags) {
                msg += '\n\n        ' + this._formatDiff(
                    error.feature.getTags().join(' '),
                    error.test.getTags().join(' ')
                );

                msg += util.color('\n\n    do not match the ones defined in ', util.color.Message)
                    + this._getFeatureLocationFromTest(error.test) + util.color(':', util.color.Message);

                msg += '\n\n        ' + util.color(error.feature.getTags().join(' '));

            } else {
                msg += '\n\n        ' + util.color('"') + this._formatDiff(
                    error.feature.getTitle(),
                    error.test.getTitle()

                ) + util.color('"');

                msg += util.color('\n\n    does not match definition in ', util.color.Message)
                    + this._getFeatureLocationFromTest(error.test) + util.color(':', util.color.Message);

                msg += '\n\n        ' + util.color('"' + error.feature.getTitle() + '"');

            }

        // Missing features / scenarios / expectations
        } else if (error.title) {

            msg += '\n\n        ' + util.color('"' + error.title + '"');

            if (error.test && error.expected) {
                expected = error.expected.replace(
                    '{{featureLocation}}',
                    this._getFeatureLocationFromTest(error.test)
                );

            } else if (error.feature && error.expected) {
                expected = error.expected.replace(
                    '{{testLocation}}',
                    this._getTestLocationFromFeature(error.feature)
                );
            }

        // Missing file
        } else {

            if (error.test) {
                expected = error.expected.replace(
                    '{{featureLocation}}',
                    this._getFeatureLocationFromTest(error.test)
                );

            } else if (error.feature) {
                expected = error.expected.replace(
                    '{{testLocation}}',
                    this._getTestLocationFromFeature(error.feature)
                );
            }

        }

        if (expected) {
            msg += '\n\n    ' + util.color('expected ' + expected, util.color.Message);
        }

        return msg + '\n';

    },

    _formatDiff: function(first, second) {
        var parts = diff.diffChars(first, second);
        return parts.map(function(p) {
            return util.color(p.value[p.added ? 'green' : p.removed ? 'red' : 'grey'])

        }).join('');
    },

    _formatMessage: function(msg) {

        var Message = util.color('', util.color.Message).slice(0, 5);
        return msg.replace(/(Test|Scenario|Feature|Expectation)/g, function(val) {
            return util.color(val, util.color.Value) + Message;
        });

    },

    _getTestLocationFromFeature: function(feature) {
        return util.color(util.replaceFilenameFromPatterns(
            feature.getLocation().filename,
            this._options.features.pattern,
            this._options.tests.pattern

        ), util.color.Key);
    },

    _getFeatureLocationFromTest: function(test) {
        return util.color(util.replaceFilenameFromPatterns(
            test.getLocation().filename,
            this._options.tests.pattern,
            this._options.features.pattern

        ), util.color.Key);
    },

    _formatLocation: function(loc) {

        var msg = util.color('in ', util.color.Error) + util.color(loc.filename, util.color.Path);

        if (loc.line !== -1 && loc.col !== -1) {
            return msg + util.color(' (line ' + loc.line + ', column ' + loc.col + ')', util.color.Location);

        } else {
            return msg;
        }

    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Generator;

