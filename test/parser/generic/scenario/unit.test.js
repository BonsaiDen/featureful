describe('Scenario Parsing', function() {

    it('should parse Scenarios from both Features and Tests', function(done) {

        framework.match(__dirname, function(specs) {

            var featureScenarios = specs[0].getFeatures()[0].getScenarios(),
                testScenarios = specs[0].getTests()[0].getScenarios();

            // Check Feature Scenarios
            featureScenarios.length.should.be.exactly(2);
            featureScenarios[0].getTitle().should.be.exactly('Scenario A');
            featureScenarios[1].getTitle().should.be.exactly('Scenario B');

            featureScenarios[0].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                col: 4,
                line: 4
            });

            featureScenarios[1].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                col: 4,
                line: 6
            });

            featureScenarios[0].getTags().should.be.eql(['@tagOne', '@tagTwo']);
            featureScenarios[1].getTags().should.be.eql([]);

            // Check Test Scenarios
            testScenarios.length.should.be.exactly(2);
            testScenarios[0].getTitle().should.be.exactly('Scenario A');
            testScenarios[1].getTitle().should.be.exactly('Scenario B');

            testScenarios[0].getLocation().should.be.eql({
                filename: __dirname + '/tests/a.test.js',
                col: 4,
                line: 4
            });

            testScenarios[1].getLocation().should.be.eql({
                filename: __dirname + '/tests/a.test.js',
                col: 4,
                line: 8
            });

            testScenarios[0].getTags().should.be.eql(['@tagOne', '@tagTwo']);
            testScenarios[1].getTags().should.be.eql([]);

        }, done);

    });

});

