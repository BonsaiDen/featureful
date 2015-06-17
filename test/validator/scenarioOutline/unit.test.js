describe('Scenario Outline Validation', function() {

    it('should validate matching Scenarios from generated Features and Tests', function(done) {

        framework.validate(__dirname, 'a', function(result) {
            result.should.be.exactly(false);

        }, done);

    });

});

