// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var util = require('./util'),
    diff = require('diff');


// Interface ------------------------------------------------------------------
function Validator(options) {
    this._options = options;
}


// Methods --------------------------------------------------------------------
Validator.prototype = {

    // Compare test and feature files
    compare: function(specs) {

        var that = this,
            errors = {};

        specs.forEach(function(spec) {

            // Define Error Structure
            if (spec.hasFeatures()) {
                spec.getFeatures().forEach(function(feature) {
                    errors[feature.title] = {
                        '': []
                    };
                });
            }

            if (spec.hasTests()) {
                spec.getTests().forEach(function(test) {
                    errors[test.getTitle()] = {
                        '': []
                    };
                });
            }

            // Compare feature and test files
            if (spec.hasFeatures() && spec.hasTests()) {
                that._compareSpec(spec, errors);

            // Feature file without test file
            } else if (!spec.hasTests()) {
                spec.getFeatures().forEach(function(feature) {
                    errors[feature.title][''].push({
                        message: 'Test implementation for feature is missing.',
                        expected: 'should be implementated in {{testLocation}}',
                        test: null,
                        feature: spec
                    });
                });

            // Test file without feature file
            } else {
                spec.getTests().forEach(function(test) {
                    errors[test.getTitle()][''].push({
                        message: 'Feature specification for test is missing.',
                        expected: 'should be specified in {{featureLocation}}',
                        test: spec,
                        feature: null
                    });
                });
            }

        });

        return this._formatErrors(errors);

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
                errors[feature.title][''].push({
                    message: 'No test for Feature:',
                    title: feature.getTitle(),
                    expected: 'should be implemented in {{testLocation}}',
                    test: null,
                    feature: feature
                });

            // Test without feature specification
            }, function(test) {
                errors[test.getTitle()][''].push({
                    message: 'No specification for Feature:',
                    title: test.getTitle(),
                    expected: 'should be specified in {{featureLocation}}',
                    test: test,
                    feature: null
                });
            },

            // Maximum levenshtein distance
            10
        );

    },

    _compareFeatureScenarios: function(topErrors, feature, test, distance) {

        var errors = topErrors[feature.title];

        // Compare Feature Tags
        this._compareTags('Incorrect Feature tags in test:', feature, test, errors['']);

        // Compare Feature Title
        if (distance !== 0) {
            errors[''].push({
                message: 'Incorrect Feature title in test:',
                test: test,
                feature: feature
            });
        }

        // TODO line locations are incorrectly reported in both test and feature files
        if (feature.getDescription() !== test.getDescription()) {
            errors[''].push({
                message: 'Incorrect Feature description in test:',
                description: true,
                test: test,
                feature: feature
            });
        }

        // Define scenario error structure
        feature.getScenarios().forEach(function(feature) {
            errors[feature.title] = [];
        });

        test.getScenarios().forEach(function(test) {
            errors[test.getTitle()] = [];
        });

        // Match up scenarios (test cases)
        util.matchUp(
            feature.getScenarios(),
            test.getScenarios(),
            this._compareScenarioExpecations.bind(this, errors),

            // Feature Scenario without test implementation
            function(feature) {
                errors[feature.title].push({
                    message: 'No test for Scenario:',
                    title: feature.getTitle(),
                    expected: 'should be implemented in {{testLocation}}',
                    test: null,
                    feature: feature
                });

            // Test Scenario without feature implementation
            }, function(test) {
                errors[test.getTitle()].push({
                    message: 'No specification for Scenario:',
                    title: test.getTitle(),
                    expected: 'should be specified in {{featureLocation}}',
                    test: test,
                    feature: null
                });
            },

            // Maximum levenshtein distance
            20
        );

    },

    _compareScenarioExpecations: function(topErrors, feature, test, distance) {

        var errors = (topErrors[feature.title] = []);

        // Compare scenario title
        if (distance !== 0) {
            errors.push({
                message: 'Incorrect Scenario title in test:',
                test: test,
                feature: feature,
                loc: feature.getLocation()
            });
        }

        // Compare Scenario Tags
        this._compareTags('Incorrect Scenario tags in test:', feature, test, errors);

        var expectationErrors = [];
        util.matchUp(
            feature.getExpectations(),
            test.getExpectations(),
            this._compareAssertion.bind(this, expectationErrors),

            // Feature Expectation without test implementation
            function(feature) {
                errors.push({
                    message: 'Expectation is missing test implementation:',
                    title: feature.getTitle(),
                    expected: 'should be implemented in {{testLocation}}',
                    test: null,
                    feature: feature
                });

            // Test Expectation without feature implementation
            }, function(test) {
                expectationErrors.push({
                    message: 'Feature specification is missing for Expectation:',
                    title: test.getTitle(),
                    expected: 'should be specified in {{featureLocation}}',
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
                message: 'Incorrect Expectation title in test:',
                test: test,
                feature: feature,
                loc: feature.getLocation()
            });
        }

        // Compare Indexes
        this._compareIndex(feature, test, errors);

        // Check if the test implementation has a expression associated with it
        if (!test.hasExpression()) {
            errors.push({
                message: 'Missing code for Expectation in test:',
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

    _compareIndex: function() {
        //console.log('index', feature.getIndex(), test.getIndex());
    },


    // Error Formatting -------------------------------------------------------
    _formatErrors: function(errors) {

        var that = this,
            valid = true,
            lines = [];

        for(var feature in errors) {
            if (errors.hasOwnProperty(feature)) {

                var featureErrors = errors[feature][''].map(function(err) {
                    return util.color(that._formatError(err).split('\n').map(function(l) {
                        return '    ' + l;

                    }).join('\n'), util.color.Error);
                });

                var featureLines = [],
                    scenarioErrorCount = 0;

                for(var scenario in errors[feature]) {
                    if (errors[feature].hasOwnProperty(scenario) && scenario !== '') {

                        var scenarioErrors = errors[feature][scenario].map(function(err) {
                            return util.color(that._formatError(err).split('\n').map(function(l) {
                                return '        ' + l;

                            }).join('\n'), util.color.Error);
                        });

                        scenarioErrorCount += scenarioErrors.length;

                        //featureLines.push('');
                        if (scenarioErrors.length) {
                            featureLines.push(util.color('    Scenario: ', 'red') + util.color(scenario, 'white'));
                            featureLines.push('');
                            featureLines.push.apply(featureLines, scenarioErrors);
                        }

                    }
                }

                if (featureErrors.length || scenarioErrorCount) {

                    lines.push(util.color('Feature: ', 'red') + util.color(feature, 'white'));
                    lines.push('');

                    lines.push.apply(lines, featureErrors);
                    lines.push.apply(lines, featureLines);
                    lines.push('');

                    valid = false;

                }

            }
        }

        if (lines.length) {
            console.log('\n' + lines.join('\n'));
        }

        return valid;

    },

    _formatError: function(error) {

        var msg = util.color('Error: ' + this._formatMessage(util.color(error.message, util.color.Message)), util.color.Error),
            location = this._formatLocation((error.test || error.feature).getLocation()),
            locationTwo = null,
            expected = '';

        // Title checks
        if (error.test && error.feature) {

            if (error.tags) {

                msg += '\n\n    ' + this._formatDiff(
                    error.feature.getTags().join(' '),
                    error.test.getTags().join(' ')
                );

                msg += util.color('\n\n  do not match the tags in the feature file:', util.color.Message);
                msg += '\n\n    ' + util.color(error.feature.getTags().join(' '));

            } else if (error.description) {

                msg += '\n\n    ' + util.color('"') + this._formatDiff(
                    error.feature.getDescription().split('\n').join('\n     '),
                    error.test.getDescription().split('\n').join('\n     ')

                ) + util.color('"');

                msg += util.color('\n\n  does not match the description in the feature file:', util.color.Message);
                msg += '\n\n    ' + util.color('"' + error.feature.getDescription().split('\n').join('\n     ') + '"');

            } else {
                msg += '\n\n    ' + util.color('"') + this._formatDiff(
                    error.feature.getTitle(),
                    error.test.getTitle()

                ) + util.color('"');

                msg += util.color('\n\n  does not match the title in the feature file:', util.color.Message);
                msg += '\n\n    ' + util.color('"' + error.feature.getTitle() + '"');

            }

            locationTwo = this._formatLocation(error.feature.getLocation(), true);

        // Missing features / scenarios / expectations
        } else if (error.title) {

            msg += '\n\n    ' + util.color('"' + error.title + '"');

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
            msg += '\n\n  ' + util.color(expected, util.color.Message);
        }

        return msg + '\n\n' + (locationTwo ? '  ' + locationTwo + '\n  ' : '') + location + '\n';

    },

    _formatDiff: function(first, second) {
        var parts = diff.diffWordsWithSpace(first, second);
        return parts.map(function(p) {
            return util.color(p.value[p.added ? 'green' : p.removed ? 'red' : 'grey']);

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

    _formatLocation: function(loc, noPrefix) {

        var msg;
        if (!noPrefix) {
            msg = util.color('from ' + loc.filename, util.color.Location);

        } else {
            msg = util.color('in ' + loc.filename, util.color.Location);
        }

        if (loc.line !== -1 && loc.col !== -1) {
            return msg + util.color(' (line ' + loc.line + ', column ' + loc.col + ')', util.color.Location);

        } else {
            return msg;
        }

    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Validator;

