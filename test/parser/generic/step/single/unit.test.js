describe('Step Parsing', function() {

    it('should parse single Steps with code expressions from both Features and Tests', function(done) {

        framework.match(__dirname, function(specs) {

            var featureSteps = specs[0].getFeatures()[0].getScenarios()[0].getSteps(),
                testSteps = specs[0].getTests()[0].getScenarios()[0].getSteps();

            // Check Feature Steps
            featureSteps.length.should.be.exactly(1);

            // Check Features Step Titles
            featureSteps[0].getTitle().should.be.exactly('Given some condition');

            // Check Feature Step Locations
            featureSteps[0].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                column: 8,
                line: 5
            });

            // Check Test Steps
            testSteps.length.should.be.exactly(1);

            // Check Test Step Titles
            testSteps[0].getTitle().should.be.exactly('Given some condition');

            // Check Test Step Expressions
            testSteps[0].hasExpression().should.be.exactly(true);

            // Check Test Step Locations
            testSteps[0].getLocation().should.be.eql({
                filename: __dirname + '/tests/a.test.js',
                column: 8,
                line: 5
            });


        }, done);

    });

});

