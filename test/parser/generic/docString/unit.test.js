describe('Scenario Parsing', function() {

    it('should parse Doc Strings from Step descriptions', function(done) {

        framework.match(__dirname, function(specs) {

            var steps = specs[0].getFeatures()[0].getScenarios()[0].getSteps();

            // Check Steps
            steps.length.should.be.exactly(1);

            // Check Step Title
            steps[0].getTitle().should.be.exactly('Given a doc string with the following value:');

            // Check Step doc string
            steps[0].getData().should.be.exactly('A doc string text.\n\nWith multiple lines.\n\nOf text.');

        }, done);

    });

});

