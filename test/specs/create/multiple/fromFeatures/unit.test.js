describe('Spec creation from multiple', function() {

    it('should create Specs from multiple Features within the same File', function(done) {

        framework.match(__dirname, function(specs) {

            // Number of all specs found
            specs.length.should.be.exactly(3);

            // Check Spec Titles from Feature Titles
            specs[0].getTitle().should.be.exactly('A');
            specs[1].getTitle().should.be.exactly('B');
            specs[2].getTitle().should.be.exactly('C');

            // Check Spec Filenames
            specs[0].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');
            specs[1].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');
            specs[2].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');

            // Check Feature Filenames
            specs[0].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');
            specs[1].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');
            specs[2].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');

        }, done);

    });

});

