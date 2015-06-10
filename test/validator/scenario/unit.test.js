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
                actual: 'A Scenario without Test',
                expected: 'should be implemented under existing parent test.',
                from: {
                    filename: root + '/test/validator/scenario/features/scenarioWithoutTest.feature',
                    line: 3,
                    col: 4
                },
                location: {
                    filename: root + '/test/validator/scenario/tests/scenarioWithoutTest.test.js',
                    line: 1,
                    col: 0
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature').getScenario('A Scenario without Test').format().split(/\n/).should.be.eql([
                "- No test for Scenario:",
                "",
                "      \"A Scenario without Test\"",
                "",
                "  at " + root + "/test/validator/scenario/features/scenarioWithoutTest.feature (line 3, column 4)",
                "",
                "  should be implemented under existing parent test.",
                "",
                "  in " + root + "/test/validator/scenario/tests/scenarioWithoutTest.test.js (line 1, column 0)"
            ]);

            // Check formatterd Error Message of the Feature
            result.getFeature('A Feature').format().split(/\n/).should.be.eql([
                "Scenario: A Scenario without Test",
                "",
                "- No test for Scenario:",
                "",
                "      \"A Scenario without Test\"",
                "",
                "  at " + root + "/test/validator/scenario/features/scenarioWithoutTest.feature (line 3, column 4)",
                "",
                "  should be implemented under existing parent test.",
                "",
                "  in " + root + "/test/validator/scenario/tests/scenarioWithoutTest.test.js (line 1, column 0)"
            ]);

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
                actual: 'A Scenario without Feature',
                expected: 'should be specified under existing parent feature.',
                from: {
                    filename: root + '/test/validator/scenario/tests/testWithoutScenario.test.js',
                    line: 3,
                    col: 4
                },
                location: {
                    col: 0,
                    filename: root + '/test/validator/scenario/features/testWithoutScenario.feature',
                    line: 1
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature').getScenario('A Scenario without Feature').format().split(/\n/).should.be.eql([
                "- No specification for Scenario:",
                "",
                "      \"A Scenario without Feature\"",
                "",
                "  at " + root + "/test/validator/scenario/tests/testWithoutScenario.test.js (line 3, column 4)",
                "",
                "  should be specified under existing parent feature.",
                "",
                "  in " + root + "/test/validator/scenario/features/testWithoutScenario.feature (line 1, column 0)"
            ]);

            // Check formatterd Error Message of the Feature
            result.getFeature('A Feature').format().split(/\n/).should.be.eql([
                "Scenario: A Scenario without Feature",
                "",
                "- No specification for Scenario:",
                "",
                "      \"A Scenario without Feature\"",
                "",
                "  at " + root + "/test/validator/scenario/tests/testWithoutScenario.test.js (line 3, column 4)",
                "",
                "  should be specified under existing parent feature.",
                "",
                "  in " + root + "/test/validator/scenario/features/testWithoutScenario.feature (line 1, column 0)"
            ]);

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
                    filename: root + '/test/validator/scenario/features/scenarioTestTitle.feature',
                    line: 4,
                    col: 4
                },
                location: {
                    filename: root + '/test/validator/scenario/tests/scenarioTestTitle.test.js',
                    line: 4,
                    col: 4
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature').getScenario('A Scenario Title').format().split(/\n/).should.be.eql([
                "- Incorrect Scenario title in test:",
                "",
                "      \"A Scenario Title mismatch\"",
                "",
                "  at " + root + "/test/validator/scenario/tests/scenarioTestTitle.test.js (line 4, column 4)",
                "",
                "  does not match the title from the feature file:",
                "",
                "      \"A Scenario Title\"",
                "",
                "  in " + root + "/test/validator/scenario/features/scenarioTestTitle.feature (line 4, column 4)"
            ]);

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
                    filename: root + '/test/validator/scenario/features/scenarioTestTags.feature',
                    line: 4,
                    col: 4
                },
                location: {
                    filename: root + '/test/validator/scenario/tests/scenarioTestTags.test.js',
                    line: 4,
                    col: 4
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature').getScenario('A Scenario with Tags').format().split(/\n/).should.be.eql([
                "- Incorrect Scenario tags in test:",
                "",
                "      @tagOne @tagTwotagMismatch",
                "",
                "  at " + root + "/test/validator/scenario/tests/scenarioTestTags.test.js (line 4, column 4)",
                "",
                "  does not match the tags from the feature file:",
                "",
                "      @tagOne @tagTwo",
                "",
                "  in " + root + "/test/validator/scenario/features/scenarioTestTags.feature (line 4, column 4)"
            ]);

        }, done);

    });

    // TODO index checks ?

    // TODO error out on duplicated scenario name in one feature

});

