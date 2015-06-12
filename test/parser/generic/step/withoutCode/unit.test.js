describe('Step Parsing', function() {

    it('should parse single Steps without code expressions from both Features and Tests', function(done) {

        framework.match(__dirname, function(specs) {

            var featureSteps = specs[0].getFeatures()[0].getScenarios()[0].getSteps(),
                testSteps = specs[0].getTests()[0].getScenarios()[0].getSteps();

            // Check Feature Steps
            featureSteps.length.should.be.exactly(2);

            // Check Features Step Titles
            featureSteps[0].getTitle().should.be.exactly('Given some condition');
            featureSteps[1].getTitle().should.be.exactly('When something is done');

            // Check Feature Step Indexes
            featureSteps[0].getIndex().should.be.exactly(0);
            featureSteps[1].getIndex().should.be.exactly(1);

            // Check Feature Step Locations
            featureSteps[0].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                col: 8,
                line: 5
            });

            featureSteps[1].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                col: 8,
                line: 7
            });

            // Check Test Steps
            testSteps.length.should.be.exactly(2);

            // Check Test Step Titles
            testSteps[0].getTitle().should.be.exactly('Given some condition');
            testSteps[1].getTitle().should.be.exactly('When something is done');

            // Check Test Step Expressions
            testSteps[0].hasExpression().should.be.exactly(false);
            testSteps[1].hasExpression().should.be.exactly(false);

            // Check Test Step Indexes
            testSteps[0].getIndex().should.be.exactly(0);
            testSteps[1].getIndex().should.be.exactly(1);

            // Check Test Step Location
            testSteps[0].getLocation().should.be.eql({
                filename: __dirname + '/tests/a.test.js',
                col: 8,
                line: 5
            });

            testSteps[1].getLocation().should.be.eql({
                filename: __dirname + '/tests/a.test.js',
                col: 8,
                line: 8
            });


        }, done);

    });

});

