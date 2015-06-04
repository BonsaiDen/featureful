describe('Scenario Validation', function() {

    var root = process.cwd();

    it('should validate matching Scenarios from Features and Tests', function(done) {

        framework.validate(__dirname, 'a', function(result) {
            result.should.be.exactly(false);

        }, done);

    });

    it('should report missing Tests implementations for Scenario descriptions', function(done) {

        framework.validate(__dirname, 'scenarioWithoutTest', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // There should be no generic Feature errors
            result.getFeature('A Feature').getErrors().length.should.be.exactly(0);

            // Check error count for Feature
            result.getFeature('A Feature').getCount().should.be.exactly(1);

            // Check scenario errors (only Scenarios with errors should be reported)
            result.getFeature('A Feature').getScenarios().should.be.eql(['A Scenario without Test']);

            // Check actual error for Scenario
            result.getFeature('A Feature').getScenario('A Scenario without Test').getErrors().length.should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario without Test').getErrors().should.be.eql([{
                type: 'missing',
                message: 'No test for Scenario:',
                expected: 'should be implemented in {{testLocation}}',
                from: {
                    filename: root + '/test/validator/scenario/features/scenarioWithoutTest.feature',
                    line: 3,
                    col: 4
                }
            }]);

            // Check formatted Error Message

        }, done);

    });

    it('should report missing Scenario descriptions for Tests implementations', function(done) {

        framework.validate(__dirname, 'testWithoutScenario', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // There should be no generic Feature errors
            result.getFeature('A Feature').getErrors().length.should.be.exactly(0);

            // Check error count for Feature
            result.getFeature('A Feature').getCount().should.be.exactly(1);

            // Check scenario errors (only Scenarios with errors should be reported)
            result.getFeature('A Feature').getScenarios().should.be.eql(['A Scenario without Feature']);

            // Check actual error for Scenario
            result.getFeature('A Feature').getScenario('A Scenario without Feature').getErrors().length.should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario without Feature').getErrors().should.be.eql([{
                type: 'missing',
                message: 'No specification for Scenario:',
                expected: 'should be specified in {{featureLocation}}',
                from: {
                    filename: root + '/test/validator/scenario/tests/testWithoutScenario.test.js',
                    line: 3,
                    col: 4
                }
            }]);

            // Check formatted Error Message

        }, done);

    });

    it('should report mismatches between Scenario -> Test: Title', function(done) {

        framework.validate(__dirname, 'scenarioTestTitle', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // There should be no generic Feature errors
            result.getFeature('A Feature').getErrors().length.should.be.exactly(0);

            // Check error count for Feature
            result.getFeature('A Feature').getCount().should.be.exactly(1);

            // Check scenario errors (only Scenarios with errors should be reported)
            result.getFeature('A Feature').getScenarios().should.be.eql(['A Scenario Title']);

            // Check actual error for Scenario
            result.getFeature('A Feature').getScenario('A Scenario Title').getErrors().length.should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario Title').getErrors().should.be.eql([{
                type: 'title',
                message: 'Incorrect Scenario title in test:',
                expected: 'A Scenario Title',
                actual: 'A Scenario Title mismatch',
                from: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/scenario/features/scenarioTestTitle.feature',
                    line: 4,
                    col: 4
                },
                location: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/scenario/tests/scenarioTestTitle.test.js',
                    line: 4,
                    col: 4
                }
            }]);

            // Check formatted Error Message

        }, done);

    });

    it('should report mismatches between Scenario -> Test: Tags', function(done) {

        framework.validate(__dirname, 'scenarioTestTags', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // There should be no generic Feature errors
            result.getFeature('A Feature').getErrors().length.should.be.exactly(0);

            // Check error count for Feature
            result.getFeature('A Feature').getCount().should.be.exactly(1);

            // Check scenario errors (only Scenarios with errors should be reported)
            result.getFeature('A Feature').getScenarios().should.be.eql(['A Scenario with Tags']);

            // Check actual error for Scenario
            result.getFeature('A Feature').getScenario('A Scenario with Tags').getErrors().length.should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getScenario('A Scenario with Tags').getErrors().should.be.eql([{
                type: 'tags',
                message: 'Incorrect Scenario tags in test:',
                expected: ['tagOne', 'tagTwo'],
                actual: ['tagOne', 'tagMismatch'],
                from: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/scenario/features/scenarioTestTags.feature',
                    line: 4,
                    col: 4
                },
                location: {
                    filename: '/home/ivo/Desktop/featureful/test/validator/scenario/tests/scenarioTestTags.test.js',
                    line: 4,
                    col: 4
                }
            }]);

            // Check formatted Error Message

        }, done);

    });

    // TODO index checks ?

    // TODO validate scenarios from multiple test files for the same feature against the scenarios described in a single feature file

    // TODO error out on duplicated scenario name in one feature

});

