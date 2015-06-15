describe('Scenario Parsing', function() {

    it('should parse Tables in Step descriptions', function(done) {

        framework.match(__dirname, function(specs) {

            var steps = specs[0].getFeatures()[0].getScenarios()[0].getSteps();

            // Check Steps
            steps.length.should.be.exactly(1);

            // Check Step Title
            steps[0].getTitle().should.be.exactly('Given the following table is parsed:');

            // Check Step data table
            steps[0].getArgument().getColumns().should.be.eql(['color', 'hex', 'index']);

            steps[0].getArgument().getRows().should.be.eql([
                ['red', '#ff0000', '0'],
                ['green', '#00ff00', '1'],
                ['blue', '#0000ff', '2']
            ]);

        }, done);

    });

});


