describe('Expectation Parsing', function() {

    it('should parse single Expectations without code expressions from both Features and Tests', function(done) {

        framework.match(__dirname, function(specs) {

            var featureExpectations = specs[0].getFeatures()[0].getScenarios()[0].getExpectations(),
                testExpectations = specs[0].getTests()[0].getScenarios()[0].getExpectations();

            // Check Feature Expectations
            featureExpectations.length.should.be.exactly(2);

            // Check Features Expectation Titles
            featureExpectations[0].getTitle().should.be.exactly('Given some condition');
            featureExpectations[1].getTitle().should.be.exactly('When something is done');

            // Check Feature Expectation Indexes
            featureExpectations[0].getIndex().should.be.exactly(0);
            featureExpectations[1].getIndex().should.be.exactly(1);

            // Check Feature Expectation Locations
            featureExpectations[0].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                col: 8,
                line: 5
            });

            featureExpectations[1].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                col: 8,
                line: 7
            });

            // Check Test Expectations
            testExpectations.length.should.be.exactly(2);

            // Check Test Expectation Titles
            testExpectations[0].getTitle().should.be.exactly('Given some condition');
            testExpectations[1].getTitle().should.be.exactly('When something is done');

            // Check Test Expectation Expressions
            testExpectations[0].hasExpression().should.be.exactly(false);
            testExpectations[1].hasExpression().should.be.exactly(false);

            // Check Test Expectation Indexes
            testExpectations[0].getIndex().should.be.exactly(0);
            testExpectations[1].getIndex().should.be.exactly(1);

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

