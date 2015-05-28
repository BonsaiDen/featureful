describe('Spec creation without', function() {

    it('should create Specs from Features even if Tests are missing', function(done) {

        framework.match(__dirname, function(specs) {

            // Number of all specs found
            specs.length.should.be.exactly(1);

            // Spec Titles from Feature Title
            specs[0].getTitle().should.be.exactly('A');

            // Check Number of Features
            specs[0].getFeatures().length.should.be.exactly(1);

            // Check Number of Tests
            specs[0].getTests().length.should.be.exactly(0);

            // Check Filenames
            specs[0].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');

            // Check Feature Titles
            specs[0].getFeatures()[0].getTitle().should.be.exactly('A');

            // Check Feature Filenames
            specs[0].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');

        }, done);

    });

});

