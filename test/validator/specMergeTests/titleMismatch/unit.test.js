describe('Multi Validation', function() {

    var Validator = require('../../../../lib/validator/Validator'),
        root = process.cwd();

    it('should validate that multiple Tests for the same Feature share the same Title', function(done) {

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
                type: 'title',
                message: 'Incorrect Feature title in test:',
                expected: 'A Feature',
                actual: 'A Feature title mismatch',
                from: {
                    filename: root + '/test/validator/specMergeTests/titleMismatch/features/a.feature',
                    line: 2,
                    col: 0
                },
                location: {
                    filename: root + '/test/validator/specMergeTests/titleMismatch/tests/a_2.test.js',
                    line: 2,
                    col: 0
                }
            }]);

            // Check formatted Error Message

        }, done, {
            matcher: {
                type: 'tag',
                pattern: /tagFeature/
            }
        });

    });

});

