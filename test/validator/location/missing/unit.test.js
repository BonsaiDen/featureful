describe('Feature Validation', function() {

    var Validator = require('../../../../lib/validator/Validator'),
        root = process.cwd();

    it('should not report expected locations for Features and Tests when using Tag matching', function(done) {

        framework.match(__dirname, function(specs) {

            // Number of all specs found
            specs.length.should.be.exactly(2);

            var validator = new Validator(),
                result = validator.compare(specs);

            // Check error count
            result.getCount().should.be.exactly(2);

            // Check Feature Errors
            result.getFeatures().should.be.eql(['Feature A', 'Feature B']);

            // Check Feature Error Count
            result.getFeature('Feature A').getCount().should.be.exactly(1);
            result.getFeature('Feature B').getCount().should.be.exactly(1);

            result.getFeature('Feature A').getErrors().should.be.eql([{
                actual: 'Feature A',
                expected: 'should be implemented in matching test file.',
                from: {
                    column: 0,
                    filename: root + '/test/validator/location/missing/features/foo/bar/a.feature',
                    line: 2
                },
                location: null,
                message: 'Test implementation for feature is missing.',
                type: 'missing'
            }]);

            result.getFeature('Feature B').getErrors().should.be.eql([{
                actual: 'Feature B',
                expected: 'should be specified in matching feature file.',
                from: {
                    column: 0,
                    filename: root + '/test/validator/location/missing/tests/b.test.js',
                    line: 2
                },
                location: null,
                message: 'Feature specification for test is missing.',
                type: 'missing'
            }]);

            result.getFeature('Feature A').format().split(/\n/).should.be.eql([
                '- Test implementation for feature is missing.',
                '',
                '      "Feature A"',
                '',
                '  at ' + root + '/test/validator/location/missing/features/foo/bar/a.feature (line 2, column 0)',
                '',
                '  should be implemented in matching test file.'
            ]);

            result.getFeature('Feature B').format().split(/\n/).should.be.eql([
                '- Feature specification for test is missing.',
                '',
                '      "Feature B"',
                '',
                '  at ' + root + '/test/validator/location/missing/tests/b.test.js (line 2, column 0)',
                '',
                '  should be specified in matching feature file.'
            ]);

        }, done, {
            matching: {
                type: 'tag',
                pattern: /spec\-(\d+)/
            }
        });

    });

});

