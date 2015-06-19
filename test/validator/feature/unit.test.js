describe('Feature Validation', function() {

    var root = process.cwd();

    it('should validate matching Features from Features and Tests', function(done) {

        framework.validate(__dirname, 'a', function(result) {
            result.should.be.exactly(false);

        }, done);

    });

    it('should report missing Tests files for Feature descriptions', function(done) {

        framework.validate(__dirname, 'featureWithoutTestFile', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature without Test']);

            // Check actual error for Feature
            result.getFeature('A Feature without Test').getErrors().length.should.be.exactly(1);

            // There should be no Scenario errors
            result.getFeature('A Feature without Test').getScenarios().should.be.eql([]);

            // Check actual Error
            result.getFeature('A Feature without Test').getErrors().should.be.eql([{
                type: 'missing',
                message: 'Test implementation for feature is missing.',
                actual: 'A Feature without Test',
                expected: 'should be implemented in matching test file.',
                from: {
                    filename: root + '/test/validator/feature/features/featureWithoutTestFile.feature',
                    line: 1,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/feature/tests/featureWithoutTestFile.test.js',
                    line: -1,
                    column: -1
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature without Test').format().split(/\n/).should.be.eql([
                "- Test implementation for feature is missing.",
                "",
                "      \"A Feature without Test\"",
                "",
                "  at " + root + "/test/validator/feature/features/featureWithoutTestFile.feature (line 1, column 0)",
                "",
                "  should be implemented in matching test file.",
                "",
                "  in " + root + "/test/validator/feature/tests/featureWithoutTestFile.test.js"
            ]);

        }, done);

    });

    it('should report missing Feature files for Test implementations', function(done) {

        framework.validate(__dirname, 'testWithoutFeatureFile', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Test without Feature']);

            // Check actual error for Feature
            result.getFeature('A Test without Feature').getErrors().length.should.be.exactly(1);

            // There should be no Scenario errors
            result.getFeature('A Test without Feature').getScenarios().should.be.eql([]);

            // Check actual Error
            result.getFeature('A Test without Feature').getErrors().should.be.eql([{
                type: 'missing',
                message: 'Feature specification for test is missing.',
                actual: 'A Test without Feature',
                expected: 'should be specified in matching feature file.',
                from: {
                    filename: root + '/test/validator/feature/tests/testWithoutFeatureFile.test.js',
                    line: 1,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/feature/features/testWithoutFeatureFile.feature',
                    line: -1,
                    column: -1
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Test without Feature').format().split(/\n/).should.be.eql([
                "- Feature specification for test is missing.",
                "",
                "      \"A Test without Feature\"",
                "",
                "  at " + root + "/test/validator/feature/tests/testWithoutFeatureFile.test.js (line 1, column 0)",
                "",
                "  should be specified in matching feature file.",
                "",
                "  in " + root + "/test/validator/feature/features/testWithoutFeatureFile.feature"
            ]);

        }, done);

    });

    it('should report missing Tests implementations for Feature descriptions', function(done) {

        framework.validate(__dirname, 'featureWithoutTest', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature without Test']);

            // Check actual error for Feature
            result.getFeature('A Feature without Test').getErrors().length.should.be.exactly(1);

            // There should be no Scenario errors
            result.getFeature('A Feature without Test').getScenarios().should.be.eql([]);

            // Check actual Error
            result.getFeature('A Feature without Test').getErrors().should.be.eql([{
                type: 'missing',
                message: 'Test implementation for feature is missing.',
                actual: 'A Feature without Test',
                expected: 'should be implemented in matching test file.',
                from: {
                    filename: root + '/test/validator/feature/features/featureWithoutTest.feature',
                    line: 1,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/feature/tests/featureWithoutTest.test.js',
                    line: -1,
                    column: -1
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature without Test').format().split(/\n/).should.be.eql([
                "- Test implementation for feature is missing.",
                "",
                "      \"A Feature without Test\"",
                "",
                "  at " + root + "/test/validator/feature/features/featureWithoutTest.feature (line 1, column 0)",
                "",
                "  should be implemented in matching test file.",
                "",
                "  in " + root + "/test/validator/feature/tests/featureWithoutTest.test.js"
            ]);

        }, done);

    });

    it('should report missing Feature and Test files (in case there are already other matching Specs)', function(done) {

        framework.validate(__dirname, 'multiple/*', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(2);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['Feature B', 'Feature C']);

            // Check actual error for Feature
            result.getFeature('Feature B').getErrors().length.should.be.exactly(1);
            result.getFeature('Feature C').getErrors().length.should.be.exactly(1);

            // There should be no Scenario errors
            result.getFeature('Feature B').getScenarios().should.be.eql([]);
            result.getFeature('Feature C').getScenarios().should.be.eql([]);

            // Check actual Error
            result.getFeature('Feature C').getErrors().should.be.eql([{
                type: 'missing',
                message: 'Feature specification for test is missing.',
                actual: 'Feature C',
                expected: 'should be specified in matching feature file.',
                from: {
                    filename: root + '/test/validator/feature/tests/multiple/c.test.js',
                    line: 1,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/feature/features/multiple/c.feature',
                    line: -1,
                    column: -1
                }
            }]);

            // Check formatted Error Message
            result.getFeature('Feature C').format().split(/\n/).should.be.eql([
                "- Feature specification for test is missing.",
                "",
                "      \"Feature C\"",
                "",
                "  at " + root + "/test/validator/feature/tests/multiple/c.test.js (line 1, column 0)",
                "",
                "  should be specified in matching feature file.",
                "",
                "  in " + root + "/test/validator/feature/features/multiple/c.feature"
            ]);

            result.getFeature('Feature B').getErrors().should.be.eql([{
                type: 'missing',
                message: 'Test implementation for feature is missing.',
                actual: 'Feature B',
                expected: 'should be implemented in matching test file.',
                from: {
                    filename: root + '/test/validator/feature/features/multiple/b.feature',
                    line: 1,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/feature/tests/multiple/b.test.js',
                    line: -1,
                    column: -1
                }
            }]);

            // Check formatted Error Message
            result.getFeature('Feature B').format().split(/\n/).should.be.eql([
                "- Test implementation for feature is missing.",
                "",
                "      \"Feature B\"",
                "",
                "  at " + root + "/test/validator/feature/features/multiple/b.feature (line 1, column 0)",
                "",
                "  should be implemented in matching test file.",
                "",
                "  in " + root + "/test/validator/feature/tests/multiple/b.test.js"
            ]);

        }, done);

    });

    it('should report missing Feature descriptions for Test implementations', function(done) {

        framework.validate(__dirname, 'testWithoutFeature', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Test without Feature']);

            // Check actual error for Feature
            result.getFeature('A Test without Feature').getErrors().length.should.be.exactly(1);

            // There should be no Scenario errors
            result.getFeature('A Test without Feature').getScenarios().should.be.eql([]);

            // Check actual Error
            result.getFeature('A Test without Feature').getErrors().should.be.eql([{
                type: 'missing',
                message: 'Feature specification for test is missing.',
                actual: 'A Test without Feature',
                expected: 'should be specified in matching feature file.',
                from: {
                    filename: root + '/test/validator/feature/tests/testWithoutFeature.test.js',
                    line: 1,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/feature/features/testWithoutFeature.feature',
                    line: -1,
                    column: -1
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Test without Feature').format().split(/\n/).should.be.eql([
                "- Feature specification for test is missing.",
                "",
                "      \"A Test without Feature\"",
                "",
                "  at " + root + "/test/validator/feature/tests/testWithoutFeature.test.js (line 1, column 0)",
                "",
                "  should be specified in matching feature file.",
                "",
                "  in " + root + "/test/validator/feature/features/testWithoutFeature.feature"
            ]);

        }, done);

    });

    it('should report mismatches between Feature -> Test: Title', function(done) {

        framework.validate(__dirname, 'featureTestTitle', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature Title']);

            // Check actual error for Feature
            result.getFeature('A Feature Title').getErrors().length.should.be.exactly(1);

            // There should be no Scenario errors
            result.getFeature('A Feature Title').getScenarios().should.be.eql([]);

            // Check actual Error
            result.getFeature('A Feature Title').getErrors().should.be.eql([{
                type: 'title',
                message: 'Incorrect Feature title in test:',
                expected: 'A Feature Title',
                actual: 'A Feature Title mismatch',
                from: {
                    filename: root + '/test/validator/feature/features/featureTestTitle.feature',
                    line: 2,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/feature/tests/featureTestTitle.test.js',
                    line: 2,
                    column: 0
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature Title').format().split(/\n/).should.be.eql([
                "- Incorrect Feature title in test:",
                "",
                "      \"A Feature Title mismatch\"",
                "",
                "  at " + root + "/test/validator/feature/tests/featureTestTitle.test.js (line 2, column 0)",
                "",
                "  does not match the title from the feature file:",
                "",
                "      \"A Feature Title\"",
                "",
                "  in " + root + "/test/validator/feature/features/featureTestTitle.feature (line 2, column 0)"
            ]);

        }, done);

    });

    it('should report mismatches between Feature -> Test: Description', function(done) {

        framework.validate(__dirname, 'featureTestDescription', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature Description']);

            // Check actual error for Feature
            result.getFeature('A Feature Description').getErrors().length.should.be.exactly(1);

            // There should be no Scenario errors
            result.getFeature('A Feature Description').getScenarios().should.be.eql([]);

            // Check actual Error
            result.getFeature('A Feature Description').getErrors().should.be.eql([{
                type: 'description',
                message: 'Incorrect Feature description in test:',
                expected: 'A\nDescription\nthat\nshould be\nhere.',
                actual: 'A\nDescription\nthat\ndoes not match\nhere.',
                from: {
                    filename: root + '/test/validator/feature/features/featureTestDescription.feature',
                    line: 2,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/feature/tests/featureTestDescription.test.js',
                    line: 2,
                    column: 0
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature Description').format().split(/\n/).should.be.eql([
                "- Incorrect Feature description in test:",
                "",
                "      \"",
                "      A",
                "      Description",
                "      that",
                "      shoulddoes benot match",
                "      here.",
                "      \"",
                "",
                "  at " + root + "/test/validator/feature/tests/featureTestDescription.test.js (line 2, column 0)",
                "",
                "  does not match the description from the feature file:",
                "",
                "      \"",
                "      A",
                "      Description",
                "      that",
                "      should be",
                "      here.",
                "      \"",
                "",
                "  in " + root + "/test/validator/feature/features/featureTestDescription.feature (line 2, column 0)"
            ]);

        }, done);

    });

    it('should report mismatches between Feature -> Test: Tags', function(done) {

        framework.validate(__dirname, 'featureTestTags', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature with Tags']);

            // Check actual error for Feature
            result.getFeature('A Feature with Tags').getErrors().length.should.be.exactly(1);

            // There should be no Scenario errors
            result.getFeature('A Feature with Tags').getScenarios().should.be.eql([]);

            // Check actual Error
            result.getFeature('A Feature with Tags').getErrors().should.be.eql([{
                type: 'tags',
                message: 'Incorrect Feature tags in test:',
                expected: ['tagOne', 'tagTwo'],
                actual: ['tagOne', 'tagMismatch'],
                from: {
                    filename: root + '/test/validator/feature/features/featureTestTags.feature',
                    line: 2,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/feature/tests/featureTestTags.test.js',
                    line: 2,
                    column: 0
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature with Tags').format().split(/\n/).should.be.eql([
                "- Incorrect Feature tags in test:",
                "",
                "      @tagOne @tagTwotagMismatch",
                "",
                "  at " + root + "/test/validator/feature/tests/featureTestTags.test.js (line 2, column 0)",
                "",
                "  does not match the tags from the feature file:",
                "",
                "      @tagOne @tagTwo",
                "",
                "  in " + root + "/test/validator/feature/features/featureTestTags.feature (line 2, column 0)"
            ]);

        }, done);

    });

    it('should report duplicates Feature / Test titles when matching via tags', function(done) {

        framework.validate(__dirname, 'duplicate/*', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(2);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // Check actual error for Feature
            result.getFeature('A Feature').getErrors().length.should.be.exactly(2);

            // There should be no Scenario errors
            result.getFeature('A Feature').getScenarios().should.be.eql([]);

            // Check actual Errors
            result.getFeature('A Feature').getErrors().should.be.eql([{
                type: 'missing',
                message: 'Duplicated Feature title:',
                expected: 'a Feature with the same title is already specified in another Spec.',
                actual: 'A Feature',
                from: {
                    filename: root + '/test/validator/feature/features/duplicate/b.feature',
                    line: 2,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/feature/features/duplicate/a.feature',
                    line: 2,
                    column: 0
                }

            }, {
                type: 'missing',
                message: 'Duplicated Test title:',
                expected: 'a Test with the same title is already implemented in another Spec.',
                actual: 'A Feature',
                from: {
                    filename: root + '/test/validator/feature/tests/duplicate/b.test.js',
                    line: 2,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/feature/tests/duplicate/a.test.js',
                    line: 2,
                    column: 0
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature').format().split(/\n/).should.be.eql([
                "- Duplicated Feature title:",
                "",
                "      \"A Feature\"",
                "",
                "  at " + root + "/test/validator/feature/features/duplicate/b.feature (line 2, column 0)",
                "",
                "  a Feature with the same title is already specified in another Spec.",
                "",
                "  in " + root + "/test/validator/feature/features/duplicate/a.feature (line 2, column 0)",
                "",
                "- Duplicated Test title:",
                "",
                "      \"A Feature\"",
                "",
                "  at " + root + "/test/validator/feature/tests/duplicate/b.test.js (line 2, column 0)",
                "",
                "  a Test with the same title is already implemented in another Spec.",
                "",
                "  in " + root + "/test/validator/feature/tests/duplicate/a.test.js (line 2, column 0)"
            ]);

        }, done, {
            matching: {
                type: 'tag',
                pattern: /feature\-([\d]+)/
            }
        });

    });

    it('should report duplicates Feature / Test titles when matching via path', function(done) {

        framework.validate(__dirname, 'duplicate/*', function(result) {

            // Check total error count
            result.getCount().should.be.exactly(2);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // Check actual error for Feature
            result.getFeature('A Feature').getErrors().length.should.be.exactly(2);

            // There should be no Scenario errors
            result.getFeature('A Feature').getScenarios().should.be.eql([]);

            // Check actual Errors
            result.getFeature('A Feature').getErrors().should.be.eql([{
                type: 'missing',
                message: 'Duplicated Feature title:',
                expected: 'a Feature with the same title is already specified in another Spec.',
                actual: 'A Feature',
                from: {
                    filename: root + '/test/validator/feature/features/duplicate/b.feature',
                    line: 2,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/feature/features/duplicate/a.feature',
                    line: 2,
                    column: 0
                }

            }, {
                type: 'missing',
                message: 'Duplicated Test title:',
                expected: 'a Test with the same title is already implemented in another Spec.',
                actual: 'A Feature',
                from: {
                    filename: root + '/test/validator/feature/tests/duplicate/b.test.js',
                    line: 2,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/feature/tests/duplicate/a.test.js',
                    line: 2,
                    column: 0
                }
            }]);

            // Check formatted Error Message
            result.getFeature('A Feature').format().split(/\n/).should.be.eql([
                "- Duplicated Feature title:",
                "",
                "      \"A Feature\"",
                "",
                "  at " + root + "/test/validator/feature/features/duplicate/b.feature (line 2, column 0)",
                "",
                "  a Feature with the same title is already specified in another Spec.",
                "",
                "  in " + root + "/test/validator/feature/features/duplicate/a.feature (line 2, column 0)",
                "",
                "- Duplicated Test title:",
                "",
                "      \"A Feature\"",
                "",
                "  at " + root + "/test/validator/feature/tests/duplicate/b.test.js (line 2, column 0)",
                "",
                "  a Test with the same title is already implemented in another Spec.",
                "",
                "  in " + root + "/test/validator/feature/tests/duplicate/a.test.js (line 2, column 0)"
            ]);

        }, done, {
            matching: {
                type: 'path'
            }
        });

    });

});

