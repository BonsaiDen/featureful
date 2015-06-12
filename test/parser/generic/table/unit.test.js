describe('Scenario Parsing', function() {

    it('should parse Tables in Step descriptions', function(done) {

        framework.match(__dirname, function(specs) {

            var steps = specs[0].getFeatures()[0].getScenarios()[0].getSteps();

            // Check Steps
            steps.length.should.be.exactly(1);

            // Check Step Title
            steps[0].getTitle().should.be.exactly('Given the following table is parsed:');

            // Check Step data table
            steps[0].getData().should.be.eql({
                color: [ 'red', 'green', 'blue' ],
                hex: [ '#ff0000', '#00ff00', '#0000ff' ],
                index: [ '0', '1', '2' ]
            });

        }, done);

    });

});


