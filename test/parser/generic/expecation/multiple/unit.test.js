describe('Expectation Parsing', function() {

    it('should parse Expectations from both Features and Tests', function(done) {

        framework.match(__dirname, function(specs) {

            var featureExpectations = specs[0].getFeatures()[0].getScenarios()[0].getExpectations(),
                testExpectations = specs[0].getTests()[0].getScenarios()[0].getExpectations();

            // Check Feature Expectations
            featureExpectations.length.should.be.exactly(6);

            // Check Feature Expectation Titles
            featureExpectations[0].getTitle().should.be.exactly('Given some condition');
            featureExpectations[1].getTitle().should.be.exactly('And given another condition');
            featureExpectations[2].getTitle().should.be.exactly('When something is done');
            featureExpectations[3].getTitle().should.be.exactly('And when some other thing is done');
            featureExpectations[4].getTitle().should.be.exactly('Then something happens');
            featureExpectations[5].getTitle().should.be.exactly('And then some other thing happens');

            // Check Feature Expectation Indexes
            featureExpectations[0].getIndex().should.be.exactly(0);
            featureExpectations[1].getIndex().should.be.exactly(1);
            featureExpectations[2].getIndex().should.be.exactly(2);
            featureExpectations[3].getIndex().should.be.exactly(3);
            featureExpectations[4].getIndex().should.be.exactly(4);
            featureExpectations[5].getIndex().should.be.exactly(5);

            // Check Feature Expectation Locations
            featureExpectations[0].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                col: 8,
                line: 5
            });

            featureExpectations[1].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                col: 12,
                line: 6
            });

            // Check Test Expectations
            testExpectations.length.should.be.exactly(6);

            // Check Test Expectation Titles
            testExpectations[0].getTitle().should.be.exactly('Given some condition');
            testExpectations[1].getTitle().should.be.exactly('And given another condition');
            testExpectations[2].getTitle().should.be.exactly('When something is done');
            testExpectations[3].getTitle().should.be.exactly('And when some other thing is done');
            testExpectations[4].getTitle().should.be.exactly('Then something happens');
            testExpectations[5].getTitle().should.be.exactly('And then some other thing happens');

            // Check Test Expectation Expressions
            testExpectations[0].hasExpression().should.be.exactly(true);
            testExpectations[1].hasExpression().should.be.exactly(false);
            testExpectations[2].hasExpression().should.be.exactly(true);
            testExpectations[3].hasExpression().should.be.exactly(false);
            testExpectations[4].hasExpression().should.be.exactly(true);
            testExpectations[5].hasExpression().should.be.exactly(false);

            // Check Test Expectation Indexes
            testExpectations[0].getIndex().should.be.exactly(0);
            testExpectations[1].getIndex().should.be.exactly(1);
            testExpectations[2].getIndex().should.be.exactly(2);
            testExpectations[3].getIndex().should.be.exactly(3);
            testExpectations[4].getIndex().should.be.exactly(4);
            testExpectations[5].getIndex().should.be.exactly(5);

            // Check Test Expectation Locations
            testExpectations[0].getLocation().should.be.eql({
                filename: __dirname + '/tests/a.test.js',
                col: 8,
                line: 5
            });

            testExpectations[1].getLocation().should.be.eql({
                filename: __dirname + '/tests/a.test.js',
                col: 8,
                line: 8
            });

        }, done);

    });

});

