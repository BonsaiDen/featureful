describe('Multi Validation', function() {

    var Validator = require('../../../../lib/validator/Validator');

    it('should fully validate Specs consisting of a single Test and multiple Feature files', function(done) {

        framework.match(__dirname, function(specs) {

            var validator = new Validator(),
                error = validator.compare(specs);

            // There should be no errors, since the feature scenarios should be merged by the validator
            error.should.be.exactly(false);

        }, done);

    });

});

