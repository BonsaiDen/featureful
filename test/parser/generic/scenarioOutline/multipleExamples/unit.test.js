describe('Scenario Parsing', function() {

    it('should parse Scenario Outlines from Features which have multiple Example Tables', function(done) {

        framework.match(__dirname, function(specs) {

            var featureScenarios = specs[0].getFeatures()[0].getScenarios();

            // Check Feature Scenarios
            featureScenarios.length.should.be.exactly(4);

            // Check Feature Scenario Titles
            featureScenarios[0].getTitle().should.be.exactly('Scenario Outline for title Foo ( A negative Example )');
            featureScenarios[1].getTitle().should.be.exactly('Scenario Outline for title Bar ( A negative Example )');

            featureScenarios[2].getTitle().should.be.exactly('Scenario Outline for title Foo ( A positive Example )');
            featureScenarios[3].getTitle().should.be.exactly('Scenario Outline for title Bar ( A positive Example )');

            // Check Feature Scenario Locations
            featureScenarios[0].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                column: 4,
                line: 4
            });

            featureScenarios[1].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                column: 4,
                line: 4
            });

            featureScenarios[2].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                column: 4,
                line: 4
            });

            featureScenarios[3].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                column: 4,
                line: 4
            });

            // Check Feature Scenario Tags
            featureScenarios[0].getTags().should.be.eql(['tagOne', 'tagTwo']);
            featureScenarios[1].getTags().should.be.eql(['tagOne', 'tagTwo']);

            // Check Feature Scenario Descriptions
            featureScenarios[0].getDescription().should.be.exactly('A\nScenario\nDescription.');
            featureScenarios[1].getDescription().should.be.exactly('A\nScenario\nDescription.');

            // Check Features Scenario Steps
            featureScenarios[0].getSteps().length.should.be.exactly(1);
            featureScenarios[1].getSteps().length.should.be.exactly(1);

            featureScenarios[2].getSteps().length.should.be.exactly(1);
            featureScenarios[3].getSteps().length.should.be.exactly(1);

            // Check Features Scenario Expectation Titles
            featureScenarios[0].getSteps()[0].getTitle().should.be.exactly('Given the number -1');
            featureScenarios[1].getSteps()[0].getTitle().should.be.exactly('Given the number -2');
            featureScenarios[2].getSteps()[0].getTitle().should.be.exactly('Given the number 1');
            featureScenarios[3].getSteps()[0].getTitle().should.be.exactly('Given the number 2');

            // Check Feature Scenario Expectation Locations
            featureScenarios[0].getSteps()[0].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                column: 8,
                line: 10
            });

            featureScenarios[1].getSteps()[0].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                column: 8,
                line: 10
            });

            featureScenarios[2].getSteps()[0].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                column: 8,
                line: 10
            });

            featureScenarios[3].getSteps()[0].getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                column: 8,
                line: 10
            });

        }, done);

    });

});

