// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var ValidationError = require('./ValidationError'),
    util = require('../util');


// Spec Validator -------------------------------------------------------------
function Validator(options) {

    options = options || {};

    this._options = {
        features: options.features,
        tests: options.tests,
        specs: options.specs
    };

}


// Methods --------------------------------------------------------------------
Validator.prototype = {

    // Compare test and feature files
    compare: function(specs) {

        var error = new ValidationError();

        specs.forEach(function(spec) {

            // Compare feature and test files
            if (spec.hasFeatures() && spec.hasTests()) {

                // Merge multiple test and feature files in the spec
                this._mergeSpec(spec, error);

                this._compareSpec(spec, error);

            // Feature file without any test files at all
            } else if (!spec.hasTests()) {
                spec.getFeatures().forEach(function(feature) {
                    error.addFeatureError(feature, {
                        type: 'missing',
                        message: 'Test implementation for feature is missing.',
                        expected: 'should be implemented in matching test file.',
                        actual: feature.getTitle(),
                        from: feature.getLocation(),
                        location: this._getTestLocation(feature.getLocation())
                    });

                }, this);

            // Test file without any feature files at all
            } else {
                spec.getTests().forEach(function(test) {
                    error.addFeatureError(test, {
                        type: 'missing',
                        message: 'Feature specification for test is missing.',
                        expected: 'should be specified in matching feature file.',
                        actual: test.getTitle(),
                        from: test.getLocation(),
                        location: this._getFeatureLocation(test.getLocation())
                    });

                }, this);
            }

        }, this);

        if (error.getCount() !== 0) {
            return error;

        } else {
            return false;
        }

    },

    _mergeSpec: function(spec, error) {

        var features = spec.getFeatures(),
            tests = spec.getTests(),
            baseFeature = features[0],
            baseTest = tests[0];

        // Merge features spread across multiple files
        if (features.length > 1) {

            // Compare and merge the others
            features.slice(1).forEach(function(feature) {

                // Validate against base feature
                this._validateBaseFeature(error, baseFeature, feature);

                // Merge scenarios
                baseFeature.getScenarios().push.apply(
                    baseFeature.getScenarios(),
                    feature.getScenarios()
                );

            }, this);

            // Drop additional features
            features.length = 1;

        }

        // Merge tests spread across multiple files
        if (tests.length > 1) {

            // Compare and merge the others
            tests.slice(1).forEach(function(test) {

                // Validate against base feature
                this._validateTestFeature(error, baseFeature, test);

                // Merge scenarios
                baseTest.getScenarios().push.apply(
                    baseTest.getScenarios(),
                    test.getScenarios()
                );

            }, this);

            // Drop additional tests
            tests.length = 1;

        }

    },

    _compareSpec: function(spec, error) {

        // Match up specs (files)
        util.matchUp(
            spec.getFeatures(),
            spec.getTests(),

            // Compare features and tests
            function(feature, test) {
                // TODO check for duplicated scenarios
                this._validateTestFeature(error, feature, test);
                this._compareFeatureScenarios(error, feature, test);

            }.bind(this),

            // Feature without test implementation
            // (this can in theory only happen with broken multi Feature file setups)
            null,

            // Test without feature specification
            // (this can in theory only happen with broken multi Feature file setups)
            null,

            // Maximum levenshtein distance
            10
        );

    },

    _compareFeatureScenarios: function(error, parentFeature, parentTest) {

        // Match up scenarios (test cases)
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

                this._compareScenarioExpecations(error, parentFeature, feature, test);

            }.bind(this),

            // Feature Scenario without test implementation
            function(feature) {
                error.addScenarioError(parentFeature, feature, {
                    type: 'missing',
                    message: 'No test for Scenario:',
                    expected: 'should be implemented under existing parent test.',
                    actual: feature.getTitle(),
                    from: feature.getLocation(),
                    location: parentTest.getLocation()
                });

            // Test Scenario without feature implementation
            }, function(test) {
                error.addScenarioError(parentFeature, test, {
                    type: 'missing',
                    message: 'No specification for Scenario:',
                    actual: test.getTitle(),
                    expected: 'should be specified under existing parent feature.',
                    from: test.getLocation(),
                    location: parentFeature.getLocation()
                });
            },

            // Maximum levenshtein distance
            20
        );

    },

    //_checkForDuplicateExpecations: function(expectations, message) {
    //
    //},

    _compareScenarioExpecations: function(error, parentFeature, parentFeatureScenario, parentTestScenario) {

        // TODO check for duplicates
        //this._checkForDuplicateExpecations(parentFeatureScenario.getExpectations());
        //this._checkForDuplicateExpecations(parentTestScenario.getExpectations());

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
                        type: 'expression',
                        message: 'Missing code expression for Expectation in test:',
                        actual: test.getTitle(),
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
                    actual: feature.getTitle(),
                    expected: 'should be implemented under existing parent test.',
                    from: feature.getLocation(),
                    location: parentTestScenario.getLocation()
                });

            // Test Expectation without feature implementation
            }, function(test) {
                error.addExpecationError(parentFeature, parentFeatureScenario, test, {
                    type: 'missing',
                    message: 'Feature specification is missing for Expectation:',
                    actual: test.getTitle(),
                    expected: 'should be specified under existing parent feature.',
                    from: test.getLocation(),
                    location: parentFeatureScenario.getLocation()
                });
            },

            // Maximum levenshtein distance
            20
        );

    },

    _validateBaseFeature: function(error, baseFeature, feature) {

        // Compare Feature Tags
        var baseFeatureTags = baseFeature.getTags().join(' '),
            featureTags = feature.getTags().join(' ');

        if (baseFeatureTags !== featureTags) {
            error.addFeatureError(baseFeature, {
                type: 'tags',
                message: 'Incorrect Feature tags in split feature:',
                expected: baseFeature.getTags(),
                actual: feature.getTags(),
                from: baseFeature.getLocation(),
                location: feature.getLocation()
            });
        }

        // Compare Feature Titles
        if (baseFeature.getTitle() !== feature.getTitle()) {
            error.addFeatureError(baseFeature, {
                type: 'title',
                message: 'Incorrect Feature title in split feature:',
                expected: baseFeature.getTitle(),
                actual: feature.getTitle(),
                from: baseFeature.getLocation(),
                location: feature.getLocation()
            });
        }

        // Compare Feature Descriptions
        if (baseFeature.getDescription() !== feature.getDescription()) {
            error.addFeatureError(baseFeature, {
                type: 'description',
                message: 'Incorrect Feature description in split feature:',
                expected: baseFeature.getDescription(),
                actual: feature.getDescription(),
                from: baseFeature.getLocation(),
                location: feature.getLocation()
            });
        }

    },

    _validateTestFeature: function(error, feature, test) {

        // Compare with Feature Tags
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

        // Compare with Feature Title
        if (feature.getTitle() !== test.getTitle()) {
            error.addFeatureError(feature, {
                type: 'title',
                message: 'Incorrect Feature title in test:',
                expected: feature.getTitle(),
                actual: test.getTitle(),
                from: feature.getLocation(),
                location: test.getLocation()
            });
        }

        // Compare with Feature Description
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

    },

    _getTestLocation: function(loc) {
        if (this._getMatcher() === 'path') {
            return {
                filename: util.replaceFilenameFromPatterns(
                    loc.filename,
                    this._options.features.pattern,
                    this._options.tests.pattern
                ),
                line: -1,
                col: -1
            };

        } else {
            return null;
        }
    },

    _getFeatureLocation: function(loc) {
        if (this._getMatcher() === 'path') {
            return {
                filename: util.replaceFilenameFromPatterns(
                    loc.filename,
                    this._options.tests.pattern,
                    this._options.features.pattern
                ),
                line: -1,
                col: -1
            };

        } else {
            return null;
        }
    },

    _getMatcher: function() {
        if (this._options.specs && this._options.specs.matching) {
            return this._options.specs.matching.type;

        } else {
            return null;
        }
    }

};

// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Validator;

