describe('Expectation Validation', function() {

    it('should validate matching Expectations from Features and Tests', function(done) {

        framework.validate(__dirname, 'a', function(result) {
            result.should.be.exactly(false);

        }, done);

    });

    it('should report missing Tests implementations for Expectation descriptions', function(done) {

        framework.validate(__dirname, 'expectationWithoutTest', function(result) {

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

            // Check expectation errors (only Expectations with errors should be reported)
            result.getFeature('A Feature').getScenario('A Scenario').getExpectations().should.be.eql(['Given something']);

            // Check error count for Expectation
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('Given something').getCount().should.be.exactly(1);

            // Check actual Expectation errors
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('Given something').getErrors().length.should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('Given something').getErrors().should.be.eql([{
                type: 'missing',
                message: 'Test implementation is missing for Expectation:',
                expected: 'should be implemented in {{testLocation}}',
                from: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/expectation/features/expectationWithoutTest.feature',
                    line: 4,
                    col: 8
                }
            }]);

            // Check formatted Error Message

        }, done);

    });

    it('should report missing Expectation descriptions for Tests implementations', function(done) {

        framework.validate(__dirname, 'expectationWithoutFeature', function(result) {

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

            // There should be one expectation error
            result.getFeature('A Feature').getScenario('A Scenario').getExpectations().should.be.eql(['Given something']);

            // Check expectation errors (only Expectations with errors should be reported)
            result.getFeature('A Feature').getScenario('A Scenario').getExpectations().should.be.eql(['Given something']);

            // Check error count for Expectation
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('Given something').getCount().should.be.exactly(1);

            // Check actual Expectation errors
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('Given something').getErrors().length.should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('Given something').getErrors().should.be.eql([{
                type: 'missing',
                message: 'Feature specification is missing for Expectation:',
                expected: 'should be specified in {{featureLocation}}',
                from: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/expectation/tests/expectationWithoutFeature.test.js',
                    line: 5,
                    col: 8
                }
            }]);

            // Check formatted Error Message

        }, done);

    });

    it('should report mismatches between Feature -> Test: Title', function(done) {

        framework.validate(__dirname, 'expectationTitle', function(result) {

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

            // Check expectation errors (only Expectations with errors should be reported)
            result.getFeature('A Feature').getScenario('A Scenario').getExpectations().should.be.eql(['Given something']);

            // Check error count for Expectation
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('Given something').getCount().should.be.exactly(1);

            // Check actual Expectation errors
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('Given something').getErrors().length.should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('Given something').getErrors().should.be.eql([{
                type: 'title',
                message: 'Incorrect Expectation title in test:',
                expected: 'Given something',
                actual: 'Given something else',
                from: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/expectation/features/expectationTitle.feature',
                    line: 4,
                    col: 8
                },
                location: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/expectation/tests/expectationTitle.test.js',
                    line: 5,
                    col: 8
                }
            }]);

            // Check formatted Error Message

        }, done);

    });

    it('should report Expectation without code assertions', function(done) {

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

            // Check expectation errors (only Expectations with errors should be reported)
            result.getFeature('A Feature').getScenario('A Scenario').getExpectations().should.be.eql(['Given missing code']);

            // Check error count for Expectation
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('Given missing code').getCount().should.be.exactly(1);

            // Check actual Expectation errors
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('Given missing code').getErrors().length.should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('Given missing code').getErrors().should.be.eql([{
                type: 'missing',
                message: 'Missing code for Expectation in test:',
                from: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/expectation/features/missingCode.feature',
                    line: 4,
                    col: 8
                },
                location: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/expectation/tests/missingCode.test.js',
                    line: 5,
                    col: 8
                }
            }]);

            // Check formatted Error Message

        }, done);

    });

    it('should report mismatches between Feature -> Test: Index', function(done) {

        framework.validate(__dirname, 'expectationIndex', function(result) {

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

            // Check expectation errors (only Expectations with errors should be reported)
            result.getFeature('A Feature').getScenario('A Scenario').getExpectations().should.be.eql(['And given b', 'And given c']);

            // Check error count for Expectations
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('And given b').getCount().should.be.exactly(1);
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('And given c').getCount().should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('And given b').getErrors().should.be.eql([{
                type: 'order',
                message: 'Incorrect Expectation order in test:',
                expected: 2,
                actual: 3,
                from: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/expectation/features/expectationIndex.feature',
                    line: 7,
                    col: 12
                },
                location: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/expectation/tests/expectationIndex.test.js',
                    line: 14,
                    col: 8
                }
            }]);

            result.getFeature('A Feature').getScenario('A Scenario').getExpectation('And given c').getErrors().should.be.eql([{
                type: 'order',
                message: 'Incorrect Expectation order in test:',
                expected: 3,
                actual: 2,
                from: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/expectation/features/expectationIndex.feature',
                    line: 8,
                    col: 12
                },
                location: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/expectation/tests/expectationIndex.test.js',
                    line: 11,
                    col: 8
                }
            }]);

            // Check formatted Error Message

        }, done);

        // TODO error out on duplicated step descriptions

    });

});

