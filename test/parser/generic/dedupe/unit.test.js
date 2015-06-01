describe('Expectation Parsing', function() {

    it('should parse Expectations from both Features and de-dupe And given/when/then assertions', function(done) {

        framework.match(__dirname, function(specs) {

            var featureExpectations = specs[0].getFeatures()[0].getScenarios()[0].getExpectations();

            // Check Feature Expectations
            featureExpectations.length.should.be.exactly(6);

            // Check Features Expectation Titles
            featureExpectations[0].getTitle().should.be.exactly('Given some condition');
            featureExpectations[1].getTitle().should.be.exactly('And given another condition');
            featureExpectations[2].getTitle().should.be.exactly('When something is done');
            featureExpectations[3].getTitle().should.be.exactly('And when some other thing is done');
            featureExpectations[4].getTitle().should.be.exactly('Then something happens');
            featureExpectations[5].getTitle().should.be.exactly('And then some other thing happens');

        }, done);

    });

});


