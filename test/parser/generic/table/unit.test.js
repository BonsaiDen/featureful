describe('Scenario Parsing', function() {

    it('should parse Tables from Step descriptions', function(done) {

        framework.match(__dirname, function(specs) {

            var expectations = specs[0].getFeatures()[0].getScenarios()[0].getExpectations();

            // Check Expectations
            expectations.length.should.be.exactly(1);

            // Check Expectation Title
            expectations[0].getTitle().should.be.exactly('Given the following table is parsed:');

            // Check Expectation data table
            expectations[0].getData().should.be.eql({
                color: [ 'red', 'green', 'blue' ],
                hex: [ '#ff0000', '#00ff00', '#0000ff' ],
                index: [ '0', '1', '2' ]
            });

        }, done);

    });

});


