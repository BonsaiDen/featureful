describe('Spec matching from Title', function() {

    it('should match up a Spec from a Single Feature and multiple Test Files (based on Titles)', function(done) {

        framework.match(__dirname, function(specs) {

            // Number of all specs found
            specs.length.should.be.exactly(1);

            // Check Spec Title
            specs[0].getTitle().should.be.exactly('A');

            // Check Number of Features
            specs[0].getFeatures().length.should.be.exactly(3);

            // Check Number of Tests
            specs[0].getTests().length.should.be.exactly(1);

            // Check Feature Titles
            specs[0].getFeatures()[0].getTitle().should.be.exactly('A');
            specs[0].getFeatures()[1].getTitle().should.be.exactly('A');
            specs[0].getFeatures()[2].getTitle().should.be.exactly('A');

            // Check Feature Filenames
            specs[0].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/a_1.feature');
            specs[0].getFeatures()[1].getLocation().filename.should.be.exactly(__dirname + '/features/a_2.feature');
            specs[0].getFeatures()[2].getLocation().filename.should.be.exactly(__dirname + '/features/a_3.feature');

        }, done);

    });

});


