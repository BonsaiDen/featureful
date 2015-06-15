describe('Step Parsing', function() {

    it('should parse Steps from both Features and Tests', function(done) {

        framework.match(__dirname, function(specs) {

            var featureSteps = specs[0].getFeatures()[0].getScenarios()[0].getSteps(),
                testSteps = specs[0].getTests()[0].getScenarios()[0].getSteps();

            // Check Feature Steps
            featureSteps.length.should.be.exactly(6);

            // Check Feature Step Titles
            featureSteps[0].getTitle().should.be.exactly('Given some condition');
            featureSteps[1].getTitle().should.be.exactly('And given another condition');
            featureSteps[2].getTitle().should.be.exactly('When something is done');
            featureSteps[3].getTitle().should.be.exactly('And when some other thing is done');
            featureSteps[4].getTitle().should.be.exactly('Then something happens');
            featureSteps[5].getTitle().should.be.exactly('And then some other thing happens');

            // Check Feature Step Indexes
            featureSteps[0].getIndex().should.be.exactly(0);
            featureSteps[1].getIndex().should.be.exactly(1);
            featureSteps[2].getIndex().should.be.exactly(2);
            featureSteps[3].getIndex().should.be.exactly(3);
            featureSteps[4].getIndex().should.be.exactly(4);
            featureSteps[5].getIndex().should.be.exactly(5);

            // Check Feature Step Locations
            featureSteps[0].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                column: 8,
                line: 5
            });

            featureSteps[1].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                column: 12,
                line: 6
            });

            // Check Test Steps
            testSteps.length.should.be.exactly(6);

            // Check Test Step Titles
            testSteps[0].getTitle().should.be.exactly('Given some condition');
            testSteps[1].getTitle().should.be.exactly('And given another condition');
            testSteps[2].getTitle().should.be.exactly('When something is done');
            testSteps[3].getTitle().should.be.exactly('And when some other thing is done');
            testSteps[4].getTitle().should.be.exactly('Then something happens');
            testSteps[5].getTitle().should.be.exactly('And then some other thing happens');

            // Check Test Step Expressions
            testSteps[0].hasExpression().should.be.exactly(true);
            testSteps[1].hasExpression().should.be.exactly(false);
            testSteps[2].hasExpression().should.be.exactly(true);
            testSteps[3].hasExpression().should.be.exactly(false);
            testSteps[4].hasExpression().should.be.exactly(true);
            testSteps[5].hasExpression().should.be.exactly(false);

            // Check Test Step Indexes
            testSteps[0].getIndex().should.be.exactly(0);
            testSteps[1].getIndex().should.be.exactly(1);
            testSteps[2].getIndex().should.be.exactly(2);
            testSteps[3].getIndex().should.be.exactly(3);
            testSteps[4].getIndex().should.be.exactly(4);
            testSteps[5].getIndex().should.be.exactly(5);

            // Check Test Step Locations
            testSteps[0].getLocation().should.be.eql({
                filename: __dirname + '/tests/a.test.js',
                column: 8,
                line: 5
            });

            testSteps[1].getLocation().should.be.eql({
                filename: __dirname + '/tests/a.test.js',
                column: 8,
                line: 8
            });

        }, done);

    });

});

