// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var diff = require('diff'),
    ValidationError = require('./ValidationError'),
    util = require('../util');


// Spec Validator -------------------------------------------------------------
function Validator(options) {
    this._options = options;
}


// Methods --------------------------------------------------------------------
Validator.prototype = {

    // Compare test and feature files
    compare: function(specs) {

        var that = this,
            error = new ValidationError();

        specs.forEach(function(spec) {

            // Compare feature and test files
            if (spec.hasFeatures() && spec.hasTests()) {
                that._compareSpec(spec, error);

            // Feature file without test file
            } else if (!spec.hasTests()) {
                spec.getFeatures().forEach(function(feature) {
                    error.addFeatureError(feature, {
                        type: 'missing',
                        message: 'Test implementation for feature is missing.',
                        expected: 'should be implemented in {{testLocation}}',
                        from: feature.getLocation()
                    });
                });

            // Test file without feature file
            } else {
                spec.getTests().forEach(function(test) {
                    error.addFeatureError(test, {
                        type: 'missing',
                        message: 'Feature specification for test is missing.',
                        expected: 'should be specified in {{featureLocation}}',
                        from: test.getLocation()
                    });
                });
            }

        });

        if (error.getCount() !== 0) {
            return error;

        } else {
            return false;
        }

    },

    _compareSpec: function(spec, error) {

        // TODO verify multiple tests / features against each other
        // so that all tests do match the feature description

        // Match up specs (files)
        // TODO merge multiple tests / features into one
        var that = this;
        util.matchUp(
            spec.getFeatures(),
            spec.getTests(),

            // Compare features and tests
            function(feature, test, distance) {

                // Compare Feature Tags
                var featureTags = feature.getTags().join(' '),
                    testTags = test.getTags().join(' ');

                if (featureTags !== testTags) {
                    error.addFeatureError(feature, {
                        type: 'tags',
                        message: 'Incorrect Feature tags in test:',
                        expected: feature.getTags(),
                        actual: test.getTags(),
                        from: feature.getLocation(),
                        location: test.getLocation()
                    });
                }

                // Compare Feature Title
                if (distance !== 0) {
                    error.addFeatureError(feature, {
                        type: 'title',
                        message: 'Incorrect Feature title in test:',
                        expected: feature.getTitle(),
                        actual: test.getTitle(),
                        from: feature.getLocation(),
                        location: test.getLocation()
                    });
                }

                // TODO line locations are incorrectly reported in both test and feature files
                if (feature.getDescription() !== test.getDescription()) {
                    error.addFeatureError(feature, {
                        type: 'description',
                        message: 'Incorrect Feature description in test:',
                        expected: feature.getDescription(),
                        actual: test.getDescription(),
                        from: feature.getLocation(),
                        location: test.getLocation()
                    });
                }

                that._compareFeatureScenarios(error, feature, test);

            },

            // Feature without test implementation
            null,

            // Test without feature specification
            null,

            // Maximum levenshtein distance
            10
        );

    },

    _compareFeatureScenarios: function(error, parentFeature, parentTest) {

        // Match up scenarios (test cases)
        var that = this;
        util.matchUp(
            parentFeature.getScenarios(),
            parentTest.getScenarios(),

            // Compare Scenarios from Features and Tests
            function(feature, test, distance) {

                // Compare Scenario Tags
                var featureTags = feature.getTags().join(' '),
                    testTags = test.getTags().join(' ');

                if (featureTags !== testTags) {
                    error.addScenarioError(parentFeature, feature, {
                        type: 'tags',
                        message: 'Incorrect Scenario tags in test:',
                        expected: feature.getTags(),
                        actual: test.getTags(),
                        from: feature.getLocation(),
                        location: test.getLocation()
                    });
                }

                // Compare scenario title
                if (distance !== 0) {
                    error.addScenarioError(parentFeature, feature, {
                        type: 'title',
                        message: 'Incorrect Scenario title in test:',
                        expected: feature.getTitle(),
                        actual: test.getTitle(),
                        from: feature.getLocation(),
                        location: test.getLocation()
                    });
                }

                that._compareScenarioExpecations(error, parentFeature, feature, test);

            },

            // Feature Scenario without test implementation
            function(feature) {
                error.addScenarioError(parentFeature, feature, {
                    type: 'missing',
                    message: 'No test for Scenario:',
                    expected: 'should be implemented in {{testLocation}}',
                    from: feature.getLocation()
                });

            // Test Scenario without feature implementation
            }, function(test) {
                error.addScenarioError(parentFeature, test, {
                    type: 'missing',
                    message: 'No specification for Scenario:',
                    expected: 'should be specified in {{featureLocation}}',
                    from: test.getLocation()
                });
            },

            // Maximum levenshtein distance
            20
        );

    },

    _compareScenarioExpecations: function(error, parentFeature, parentFeatureScenario, parentTestScenario) {

        util.matchUp(
            parentFeatureScenario.getExpectations(),
            parentTestScenario.getExpectations(),

            // Compare Feature and Test Expectations
            function(feature, test, distance) {

                // Compare expectation index
                if (feature.getIndex() !== test.getIndex()) {
                    error.addExpecationError(parentFeature, parentFeatureScenario, feature, {
                        type: 'order',
                        message: 'Incorrect Expectation order in test:',
                        expected: feature.getIndex(),
                        actual: test.getIndex(),
                        from: feature.getLocation(),
                        location: test.getLocation()
                    });
                }

                // Compare expectation title
                if (distance > 0) {
                    error.addExpecationError(parentFeature, parentFeatureScenario, feature, {
                        type: 'title',
                        message: 'Incorrect Expectation title in test:',
                        expected: feature.getTitle(),
                        actual: test.getTitle(),
                        from: feature.getLocation(),
                        location: test.getLocation()
                    });
                }

                // Check if the test implementation has a expression associated with it
                if (!test.hasExpression()) {
                    error.addExpecationError(parentFeature, parentFeatureScenario, test, {
                        type: 'missing',
                        message: 'Missing code for Expectation in test:',
                        from: feature.getLocation(),
                        location: test.getLocation()
                    });
                }

            },

            // Feature Expectation without test implementation
            function(feature) {
                error.addExpecationError(parentFeature, parentFeatureScenario, feature, {
                    type: 'missing',
                    message: 'Test implementation is missing for Expectation:',
                    expected: 'should be implemented in {{testLocation}}',
                    from: feature.getLocation()
                });

            // Test Expectation without feature implementation
            }, function(test) {
                error.addExpecationError(parentFeature, parentFeatureScenario, test, {
                    type: 'missing',
                    message: 'Feature specification is missing for Expectation:',
                    expected: 'should be specified in {{featureLocation}}',
                    from: test.getLocation()
                });
            },

            // Maximum levenshtein distance
            20
        );

    }


    // Error Formatting -------------------------------------------------------
    /*
    _formatErrors: function(errors) {

        var that = this,
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

                }

            }
        }

        if (lines.length) {
            return '\n' + lines.join('\n');

        } else {
            return '';
        }

    },

    _formatError: function(error) {

        var msg = util.color('Error: ' + formatMessage(util.color(error.message, util.color.Message)), util.color.Error),
            location = formatLocation((error.test || error.feature).getLocation()),
            locationTwo = null,
            expected = '';

        // Title checks
        if (error.test && error.feature) {

            if (error.tags) {

                msg += '\n\n    ' + formatDiff(
                    error.feature.getTags().join(' '),
                    error.test.getTags().join(' ')
                );

                msg += util.color('\n\n  do not match the tags in the feature file:', util.color.Message);
                msg += '\n\n    ' + util.color(error.feature.getTags().join(' '));

            } else if (error.description) {

                msg += '\n\n    ' + util.color('"') + formatDiff(
                    error.feature.getDescription().split('\n').join('\n     '),
                    error.test.getDescription().split('\n').join('\n     ')

                ) + util.color('"');

                msg += util.color('\n\n  does not match the description in the feature file:', util.color.Message);
                msg += '\n\n    ' + util.color('"' + error.feature.getDescription().split('\n').join('\n     ') + '"');

            } else {
                msg += '\n\n    ' + util.color('"') + formatDiff(
                    error.feature.getTitle(),
                    error.test.getTitle()

                ) + util.color('"');

                msg += util.color('\n\n  does not match the title in the feature file:', util.color.Message);
                msg += '\n\n    ' + util.color('"' + error.feature.getTitle() + '"');

            }

            locationTwo = formatLocation(error.feature.getLocation(), true);

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
    }
    */

};


// Helpers --------------------------------------------------------------------
/*
function formatDiff(first, second) {
    var parts = diff.diffWordsWithSpace(first, second);
    return parts.map(function(p) {
        return util.color(p.value[p.added ? 'green' : p.removed ? 'red' : 'grey']);

    }).join('');
}

function formatMessage(msg) {

    var Message = util.color('', util.color.Message).slice(0, 5);
    return msg.replace(/(Test|Scenario|Feature|Expectation)/g, function(val) {
        return util.color(val, util.color.Value) + Message;
    });

}

function formatLocation(loc, noPrefix) {

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
*/

// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Validator;

