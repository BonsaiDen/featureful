describe('Multi Validation', function() {

    var Validator = require('../../../../lib/validator/Validator'),
        root = process.cwd();

    it('should validate that multiple Tests for the same Feature share the same Description', function(done) {

        framework.match(__dirname, function(specs) {

            var validator = new Validator(),
                result = validator.compare(specs);

            // Check Error Count
            result.getCount().should.be.exactly(1);

            // Check feature errors (only Features with errors should be reported)
            result.getFeatures().should.be.eql(['A Feature']);

            // Check error count for Feature
            result.getFeature('A Feature').getCount().should.be.exactly(1);

            // Check actual Error
            result.getFeature('A Feature').getErrors().should.be.eql([{
                type: 'description',
                message: 'Incorrect Feature description in test:',
                expected: 'A\nFeature\nDescription.',
                actual: 'A\nFeature\nDescription\nmismatch.',
                from: {
                    filename: root + '/test/validator/specMergeTests/descriptionMismatch/features/a.feature',
                    line: 2,
                    column: 0
                },
                location: {
                    filename: root + '/test/validator/specMergeTests/descriptionMismatch/tests/a_2.test.js',
                    line: 2,
                    column: 0
                }
            }]);

            // TODO Check formatted Error Message

        }, done);

    });

});

