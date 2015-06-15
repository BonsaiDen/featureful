describe('Scenario Parsing', function() {

    it('should parse Scenario Outlines from Features', function(done) {

        framework.match(__dirname, function(specs) {

            var featureScenarios = specs[0].getFeatures()[0].getScenarios();

            // Check Feature Scenarios
            featureScenarios.length.should.be.exactly(2);

            // Check Feature Scenario Titles
            featureScenarios[0].getTitle().should.be.exactly('Scenario Outline for title TA');
            featureScenarios[1].getTitle().should.be.exactly('Scenario Outline for title TB');

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

            // Check Feature Scenario Tags
            featureScenarios[0].getTags().should.be.eql(['tagOne', 'tagTwo']);
            featureScenarios[1].getTags().should.be.eql(['tagOne', 'tagTwo']);

            // Check Feature Scenario Descriptions
            featureScenarios[0].getDescription().should.be.exactly('A\nScenario\nDescription.');
            featureScenarios[1].getDescription().should.be.exactly('A\nScenario\nDescription.');

            // Check Features Scenario Steps
            featureScenarios[0].getSteps().length.should.be.exactly(3);
            featureScenarios[1].getSteps().length.should.be.exactly(3);

            // Check Features Scenario Expectation Titles
            featureScenarios[0].getSteps()[0].getTitle().should.be.exactly('Given the preset PA');
            featureScenarios[0].getSteps()[1].getTitle().should.be.exactly('When the condition CA');
            featureScenarios[0].getSteps()[2].getTitle().should.be.exactly('Then perform the action AA');

            featureScenarios[1].getSteps()[0].getTitle().should.be.exactly('Given the preset PB');
            featureScenarios[1].getSteps()[1].getTitle().should.be.exactly('When the condition CB');
            featureScenarios[1].getSteps()[2].getTitle().should.be.exactly('Then perform the action AB');

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

        }, done);

    });

});


