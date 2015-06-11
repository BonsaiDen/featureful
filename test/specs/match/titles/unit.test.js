describe('Spec Matching', function() {

    it('should by DEFAULT match up Features and Tests into the same Spec based on their Titles', function(done) {

        framework.match(__dirname, function(specs) {

            // Number of all specs found
            specs.length.should.be.exactly(3);

            // Check Spec Titles
            specs[0].getTitle().should.be.exactly('A');
            specs[1].getTitle().should.be.exactly('B');
            specs[2].getTitle().should.be.exactly('C');

            // Check Number of Features
            specs[0].getFeatures().length.should.be.exactly(1);
            specs[1].getFeatures().length.should.be.exactly(1);
            specs[2].getFeatures().length.should.be.exactly(1);

            // Check Number of Tests
            specs[0].getTests().length.should.be.exactly(1);
            specs[1].getTests().length.should.be.exactly(1);
            specs[2].getTests().length.should.be.exactly(1);

            // Check Filenames
            specs[0].getLocation().filename.should.be.exactly(__dirname + '/features/foo/bar/a.feature');
            specs[1].getLocation().filename.should.be.exactly(__dirname + '/features/foo/b.feature');
            specs[2].getLocation().filename.should.be.exactly(__dirname + '/features/c.feature');

            // Check Feature Titles
            specs[0].getFeatures()[0].getTitle().should.be.exactly('A');
            specs[1].getFeatures()[0].getTitle().should.be.exactly('B');
            specs[2].getFeatures()[0].getTitle().should.be.exactly('C');

            // Check Feature Filenames
            specs[0].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/foo/bar/a.feature');
            specs[1].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/foo/b.feature');
            specs[2].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/c.feature');

            // Check Test Titles
            specs[0].getTests()[0].getTitle().should.be.exactly('A');
            specs[1].getTests()[0].getTitle().should.be.exactly('B');
            specs[2].getTests()[0].getTitle().should.be.exactly('C');

            // Check Test Filenames
            specs[0].getTests()[0].getLocation().filename.should.be.exactly(__dirname + '/tests/foo/bar/a.test.js');
            specs[1].getTests()[0].getLocation().filename.should.be.exactly(__dirname + '/tests/foo/b.test.js');
            specs[2].getTests()[0].getLocation().filename.should.be.exactly(__dirname + '/tests/c.test.js');

        }, done);

    });

});
