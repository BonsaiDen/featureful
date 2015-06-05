describe('Validation', function() {

    var Validator = require('../../../../lib/validator/Validator');

    it('should validate that multiple Tests for the same Feature share the same Title', function(done) {

        framework.match(__dirname, function(specs) {

            var validator = new Validator(),
                error = validator.compare(specs);

            // Check Error Count
            error.getCount().should.be.exactly(1);

            // TODO full error checking

        }, done, {
            matcher: {
                type: 'tag',
                pattern: /tagFeature/
            }
        });

    });

});

