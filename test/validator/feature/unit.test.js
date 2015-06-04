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
                expected: 'should be implemented in {{testLocation}}',
                from: {
                    filename: root + '/test/validator/feature/features/featureWithoutTestFile.feature',
                    line: 1,
                    col: 0
                }
            }]);

            // Check formatted Error Message

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
                expected: 'should be specified in {{featureLocation}}',
                from: {
                    filename: root + '/test/validator/feature/tests/testWithoutFeatureFile.test.js',
                    line: 1,
                    col: 0
                }
            }]);

            // Check formatted Error Message

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
                expected: 'should be implemented in {{testLocation}}',
                from: {
                    filename: root + '/test/validator/feature/features/featureWithoutTest.feature',
                    line: 1,
                    col: 0
                }
            }]);

            // Check formatted Error Message

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
                expected: 'should be specified in {{featureLocation}}',
                from: {
                    filename: root + '/test/validator/feature/tests/testWithoutFeature.test.js',
                    line: 1,
                    col: 0
                }
            }]);

            // Check formatted Error Message

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
                    col: 0
                },
                location: {
                    filename: root + '/test/validator/feature/tests/featureTestTitle.test.js',
                    line: 2,
                    col: 0
                }
            }]);

            // Check formatted Error Message

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
                    col: 0
                },
                location: {
                    filename: root + '/test/validator/feature/tests/featureTestDescription.test.js',
                    line: 2,
                    col: 0
                }
            }]);

            // Check formatted Error Message

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
                    col: 0
                },
                location: {
                    filename: root + '/test/validator/feature/tests/featureTestTags.test.js',
                    line: 2,
                    col: 0
                }
            }]);

            // Check formatted Error Message

        }, done);

    });

    // TODO validate test implementations from multiple files against a feature descriped in one file

    // TODO error out on duplicated feature names

});

