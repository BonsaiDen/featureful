describe('Scenario Parsing', function() {

    it('should parse Doc Strings from Step descriptions', function(done) {

        framework.match(__dirname, function(specs) {

            var expectations = specs[0].getFeatures()[0].getScenarios()[0].getExpectations();

            // Check Expectations
            expectations.length.should.be.exactly(1);

            // Check Expectation Title
            expectations[0].getTitle().should.be.exactly('Given a doc string with the following value:');

            // Check Expectation doc string
            expectations[0].getData().should.be.exactly('A doc string text.\n\nWith multiple lines.\n\nOf text.');

        }, done);

    });

});

