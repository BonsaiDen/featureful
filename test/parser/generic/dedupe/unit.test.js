describe('Step Parsing', function() {

    it('should parse Steps from both Features and de-dupe And given/when/then assertions', function(done) {

        framework.match(__dirname, function(specs) {

            var featureSteps = specs[0].getFeatures()[0].getScenarios()[0].getSteps();

            // Check Feature Steps
            featureSteps.length.should.be.exactly(6);

            // Check Features Step Titles
            featureSteps[0].getTitle().should.be.exactly('Given some condition');
            featureSteps[1].getTitle().should.be.exactly('And given another condition');
            featureSteps[2].getTitle().should.be.exactly('When something is done');
            featureSteps[3].getTitle().should.be.exactly('And when some other thing is done');
            featureSteps[4].getTitle().should.be.exactly('Then something happens');
            featureSteps[5].getTitle().should.be.exactly('And then some other thing happens');

        }, done);

    });

});


