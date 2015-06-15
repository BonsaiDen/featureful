describe('Step Validation', function() {

    var root = process.cwd();

    it('should validate matching Steps from Features and Tests', function(done) {

        framework.validate(__dirname, 'a', function(result) {
            result.should.be.exactly(false);

        }, done);

    });

    it('should report missing Tests implementations for Step descriptions', function(done) {

        framework.validate(__dirname, 'stepWithoutTest', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // There should be no generic Feature Errors
            result.getFeature('A Feature').getErrors().length.should.be.exactly(0);

            // Check error count for Feature
            result.getFeature('A Feature').getCount().should.be.exactly(1);

            // Check scenario errors (only Scenarios with errors should be reported)
            result.getFeature('A Feature').getScenarios().should.be.eql(['A Scenario']);

            // Check error count for Scenario
            result.getFeature('A Feature').getScenario('A Scenario').getCount().should.be.exactly(1);

            // There should be no generic Scenario errors
            result.getFeature('A Feature').getScenario('A Scenario').getErrors().length.should.be.exactly(0);

            // Check step errors (only Steps with errors should be reported)
            result.getFeature('A Feature').getScenario('A Scenario').getSteps().should.be.eql(['Given something']);

            // Check error count for Step
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given something').getCount().should.be.exactly(1);

            // Check actual Step errors
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given something').getErrors().length.should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given something').getErrors().should.be.eql([{
                type: 'missing',
                message: 'Test implementation is missing for Step:',
                actual: 'Given something',
                expected: 'should be implemented under existing parent test.',
                from: {
                    filename: root + '/test/validator/step/features/stepWithoutTest.feature',
                    line: 4,
                    column: 8
                },
                location: {
                    filename: root + '/test/validator/step/tests/stepWithoutTest.test.js',
                    line: 3,
                    column: 4
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given something').format().split(/\n/).should.be.eql([
                "- Test implementation is missing for Step:",
                "",
                "      \"Given something\"",
                "",
                "  at " + root + "/test/validator/step/features/stepWithoutTest.feature (line 4, column 8)",
                "",
                "  should be implemented under existing parent test.",
                "",
                "  in " + root + "/test/validator/step/tests/stepWithoutTest.test.js (line 3, column 4)"
            ]);

            // Check formatterd Error Message of the Scenario
            result.getFeature('A Feature').getScenario('A Scenario').format().split(/\n/).should.be.eql([
                "Step: Given something",
                "",
                "- Test implementation is missing for Step:",
                "",
                "      \"Given something\"",
                "",
                "  at " + root + "/test/validator/step/features/stepWithoutTest.feature (line 4, column 8)",
                "",
                "  should be implemented under existing parent test.",
                "",
                "  in " + root + "/test/validator/step/tests/stepWithoutTest.test.js (line 3, column 4)"
            ]);

        }, done);

    });

    it('should report missing Step descriptions for Test implementations', function(done) {

        framework.validate(__dirname, 'stepWithoutFeature', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // There should be no generic Feature Errors
            result.getFeature('A Feature').getErrors().length.should.be.exactly(0);

            // Check error count for Feature
            result.getFeature('A Feature').getCount().should.be.exactly(1);

            // Check scenario errors (only Scenarios with errors should be reported)
            result.getFeature('A Feature').getScenarios().should.be.eql(['A Scenario']);

            // Check error count for Scenario
            result.getFeature('A Feature').getScenario('A Scenario').getCount().should.be.exactly(1);

            // There should be no generic Scenario errors
            result.getFeature('A Feature').getScenario('A Scenario').getErrors().length.should.be.exactly(0);

            // There should be one step error
            result.getFeature('A Feature').getScenario('A Scenario').getSteps().should.be.eql(['Given something']);

            // Check step errors (only Steps with errors should be reported)
            result.getFeature('A Feature').getScenario('A Scenario').getSteps().should.be.eql(['Given something']);

            // Check error count for Step
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given something').getCount().should.be.exactly(1);

            // Check actual Step errors
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given something').getErrors().length.should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given something').getErrors().should.be.eql([{
                type: 'missing',
                message: 'Feature specification is missing for Step:',
                actual: 'Given something',
                expected: 'should be specified under existing parent feature.',
                from: {
                    filename: root + '/test/validator/step/tests/stepWithoutFeature.test.js',
                    line: 5,
                    column: 8
                },
                location: {
                    filename: root + '/test/validator/step/features/stepWithoutFeature.feature',
                    line: 3,
                    column: 4
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given something').format().split(/\n/).should.be.eql([
                "- Feature specification is missing for Step:",
                "",
                "      \"Given something\"",
                "",
                "  at " + root + "/test/validator/step/tests/stepWithoutFeature.test.js (line 5, column 8)",
                "",
                "  should be specified under existing parent feature.",
                "",
                "  in " + root + "/test/validator/step/features/stepWithoutFeature.feature (line 3, column 4)"
            ]);

            // Check formatterd Error Message of the Scenario
            result.getFeature('A Feature').getScenario('A Scenario').format().split(/\n/).should.be.eql([
                "Step: Given something",
                "",
                "- Feature specification is missing for Step:",
                "",
                "      \"Given something\"",
                "",
                "  at " + root + "/test/validator/step/tests/stepWithoutFeature.test.js (line 5, column 8)",
                "",
                "  should be specified under existing parent feature.",
                "",
                "  in " + root + "/test/validator/step/features/stepWithoutFeature.feature (line 3, column 4)"
            ]);

        }, done);

    });

    it('should report mismatches between Feature -> Test: Title', function(done) {

        framework.validate(__dirname, 'stepTitle', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // There should be no generic Feature Errors
            result.getFeature('A Feature').getErrors().length.should.be.exactly(0);

            // Check error count for Feature
            result.getFeature('A Feature').getCount().should.be.exactly(1);

            // Check scenario errors (only Scenarios with errors should be reported)
            result.getFeature('A Feature').getScenarios().should.be.eql(['A Scenario']);

            // Check error count for Scenario
            result.getFeature('A Feature').getScenario('A Scenario').getCount().should.be.exactly(1);

            // There should be no generic Scenario errors
            result.getFeature('A Feature').getScenario('A Scenario').getErrors().length.should.be.exactly(0);

            // Check step errors (only Steps with errors should be reported)
            result.getFeature('A Feature').getScenario('A Scenario').getSteps().should.be.eql(['Given something']);

            // Check error count for Step
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given something').getCount().should.be.exactly(1);

            // Check actual Step errors
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given something').getErrors().length.should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given something').getErrors().should.be.eql([{
                type: 'title',
                message: 'Incorrect Step title in test:',
                expected: 'Given something',
                actual: 'Given something else',
                from: {
                    filename: root + '/test/validator/step/features/stepTitle.feature',
                    line: 4,
                    column: 8
                },
                location: {
                    filename: root + '/test/validator/step/tests/stepTitle.test.js',
                    line: 5,
                    column: 8
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given something').format().split(/\n/).should.be.eql([
                "- Incorrect Step title in test:",
                "",
                "      \"Given something else\"",
                "",
                "  at " + root + "/test/validator/step/tests/stepTitle.test.js (line 5, column 8)",
                "",
                "  does not match the title from the feature file:",
                "",
                "      \"Given something\"",
                "",
                "  in " + root + "/test/validator/step/features/stepTitle.feature (line 4, column 8)"
            ]);

        }, done);

    });

    it('should report Step without code assertions', function(done) {

        framework.validate(__dirname, 'missingCode', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // There should be no generic Feature Errors
            result.getFeature('A Feature').getErrors().length.should.be.exactly(0);

            // Check error count for Feature
            result.getFeature('A Feature').getCount().should.be.exactly(1);

            // Check scenario errors (only Scenarios with errors should be reported)
            result.getFeature('A Feature').getScenarios().should.be.eql(['A Scenario']);

            // Check error count for Scenario
            result.getFeature('A Feature').getScenario('A Scenario').getCount().should.be.exactly(1);

            // There should be no generic Scenario errors
            result.getFeature('A Feature').getScenario('A Scenario').getErrors().length.should.be.exactly(0);

            // Check step errors (only Steps with errors should be reported)
            result.getFeature('A Feature').getScenario('A Scenario').getSteps().should.be.eql(['Given missing code']);

            // Check error count for Step
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given missing code').getCount().should.be.exactly(1);

            // Check actual Step errors
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given missing code').getErrors().length.should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given missing code').getErrors().should.be.eql([{
                type: 'expression',
                message: 'Missing code expression for Step in test:',
                actual: 'Given missing code',
                from: {
                    filename: root + '/test/validator/step/features/missingCode.feature',
                    line: 4,
                    column: 8
                },
                location: {
                    filename: root + '/test/validator/step/tests/missingCode.test.js',
                    line: 5,
                    column: 8
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature').getScenario('A Scenario').getStep('Given missing code').format().split(/\n/).should.be.eql([
                "- Missing code expression for Step in test:",
                "",
                "      \"Given missing code\"",
                "",
                "  at " + root + "/test/validator/step/tests/missingCode.test.js (line 5, column 8)"
            ]);

        }, done);

    });

    it('should report mismatches between Feature -> Test: Index', function(done) {

        framework.validate(__dirname, 'stepIndex', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(2);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // There should be no generic Feature Errors
            result.getFeature('A Feature').getErrors().length.should.be.exactly(0);

            // Check error count for Feature
            result.getFeature('A Feature').getCount().should.be.exactly(2);

            // Check scenario errors (only Scenarios with errors should be reported)
            result.getFeature('A Feature').getScenarios().should.be.eql(['A Scenario']);

            // Check error count for Scenario
            result.getFeature('A Feature').getScenario('A Scenario').getCount().should.be.exactly(2);

            // There should be no generic Scenario errors
            result.getFeature('A Feature').getScenario('A Scenario').getErrors().length.should.be.exactly(0);

            // Check step errors (only Steps with errors should be reported)
            result.getFeature('A Feature').getScenario('A Scenario').getSteps().should.be.eql(['And given b', 'And given c']);

            // Check error count for Steps
            result.getFeature('A Feature').getScenario('A Scenario').getStep('And given b').getCount().should.be.exactly(1);
            result.getFeature('A Feature').getScenario('A Scenario').getStep('And given c').getCount().should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario').getStep('And given b').getErrors().should.be.eql([{
                type: 'order',
                message: 'Incorrect Step order in test:',
                expected: 2,
                actual: 3,
                from: {
                    filename: root + '/test/validator/step/features/stepIndex.feature',
                    line: 7,
                    column: 12
                },
                location: {
                    filename: root + '/test/validator/step/tests/stepIndex.test.js',
                    line: 14,
                    column: 8
                }
            }]);

            result.getFeature('A Feature').getScenario('A Scenario').getStep('And given c').getErrors().should.be.eql([{
                type: 'order',
                message: 'Incorrect Step order in test:',
                expected: 3,
                actual: 2,
                from: {
                    filename: root + '/test/validator/step/features/stepIndex.feature',
                    line: 8,
                    column: 12
                },
                location: {
                    filename: root + '/test/validator/step/tests/stepIndex.test.js',
                    line: 11,
                    column: 8
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature').getScenario('A Scenario').getStep('And given b').format().split(/\n/).should.be.eql([
                "- Incorrect Step order in test:",
                "",
                "      \"And given b\" is currently implemented as step #3",
                "",
                "  at " + root + "/test/validator/step/tests/stepIndex.test.js (line 14, column 8)",
                "",
                "  but should be implemented as #2 as defined in the feature file.",
                "",
                "  in " + root + "/test/validator/step/features/stepIndex.feature (line 7, column 12)"
            ]);

            result.getFeature('A Feature').getScenario('A Scenario').getStep('And given c').format().split(/\n/).should.be.eql([
                "- Incorrect Step order in test:",
                "",
                "      \"And given c\" is currently implemented as step #2",
                "",
                "  at " + root + "/test/validator/step/tests/stepIndex.test.js (line 11, column 8)",
                "",
                "  but should be implemented as #3 as defined in the feature file.",
                "",
                "  in " + root + "/test/validator/step/features/stepIndex.feature (line 8, column 12)"
            ]);

        }, done);

    });

    /*
    it('should report duplicated Steps in feature files', function(done) {

        framework.validate(__dirname, 'duplicateFeatures', function(result) {

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // Check scenario errors (only Scenarios with errors should be reported)
            result.getFeature('A Feature').getScenarios().should.be.eql(['A Scenario']);

            // Check error count for Scenario
            result.getFeature('A Feature').getScenario('A Scenario').getCount().should.be.exactly(1);

            // There should be no generic Scenario errors
            result.getFeature('A Feature').getScenario('A Scenario').getErrors().length.should.be.exactly(0);

            result.getFeature('A Feature').getScenario('A Scenario').getSteps().should.be.eql(['When a duplicate']);

            result.getFeature('A Feature').getScenario('A Scenario').getStep('When a duplicate').getCount().should.be.exactly(1);

        }, done);

    });

    it('should report duplicated Steps in test files', function(done) {

        framework.validate(__dirname, 'duplicateTests', function(result) {

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // Check scenario errors (only Scenarios with errors should be reported)
            result.getFeature('A Feature').getScenarios().should.be.eql(['A Scenario']);

            // Check error count for Scenario
            result.getFeature('A Feature').getScenario('A Scenario').getCount().should.be.exactly(1);

            // There should be no generic Scenario errors
            result.getFeature('A Feature').getScenario('A Scenario').getErrors().length.should.be.exactly(1);

            result.getFeature('A Feature').getScenario('A Scenario').getSteps().should.be.eql(['When a duplicate']);

            result.getFeature('A Feature').getScenario('A Scenario').getStep('When a duplicate').getCount().should.be.exactly(1);

        }, done);

    });
    */

});

