describe('Ignores', function() {

    it('should allow to ignore Features, Tests and Scenarios based on their Tags', function(done) {

        framework.match(__dirname, function(specs) {

            // Number of all specs found
            specs.length.should.be.exactly(3);

            // Check Spec Titles
            specs[0].getTitle().should.be.exactly('a');
            specs[1].getTitle().should.be.exactly('c');
            specs[2].getTitle().should.be.exactly('d');

            // Check Number of Features for each Spec
            specs[0].getFeatures().length.should.be.exactly(1);
            specs[1].getFeatures().length.should.be.exactly(1);
            specs[2].getFeatures().length.should.be.exactly(0);

            // Check Number of Tests for each Spec
            specs[0].getTests().length.should.be.exactly(1);
            specs[1].getTests().length.should.be.exactly(0);
            specs[2].getTests().length.should.be.exactly(1);

            // Check Spec Filenames
            specs[0].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');
            specs[1].getLocation().filename.should.be.exactly(__dirname + '/features/c.feature');
            specs[2].getLocation().filename.should.be.exactly(__dirname + '/tests/d.test.js');

            // Check Feature Titles
            specs[0].getFeatures()[0].getTitle().should.be.exactly('Feature A');
            specs[1].getFeatures()[0].getTitle().should.be.exactly('Feature C');

            // Check Feature Filenames
            specs[0].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');
            specs[1].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/c.feature');

            // Check Test Titles
            specs[0].getTests()[0].getTitle().should.be.exactly('Feature A');
            specs[2].getTests()[0].getTitle().should.be.exactly('Feature D');

            // Check Test Filenames
            specs[0].getTests()[0].getLocation().filename.should.be.exactly(__dirname + '/tests/a.test.js');
            specs[2].getTests()[0].getLocation().filename.should.be.exactly(__dirname + '/tests/d.test.js');

            // Check Feature Scenarios
            specs[0].getFeatures()[0].getScenarios().length.should.be.exactly(1);
            specs[1].getFeatures()[0].getScenarios().length.should.be.exactly(0);

            specs[0].getFeatures()[0].getScenarios()[0].getTitle().should.be.exactly('A Scenario');

            // Check Test Scenarios
            specs[0].getTests()[0].getScenarios().length.should.be.exactly(1);
            specs[2].getTests()[0].getScenarios().length.should.be.exactly(1);

            specs[0].getTests()[0].getScenarios()[0].getTitle().should.be.exactly('A Scenario');
            specs[2].getTests()[0].getScenarios()[0].getTitle().should.be.exactly('A Scenario');

        }, done, {
            matching: {
                type: 'path'
            },
            ignores: {
                type: 'tag',
                pattern: /^(ignore|hide)$/
            }
        });

    });

});

