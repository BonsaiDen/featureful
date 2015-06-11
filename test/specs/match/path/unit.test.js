describe('Spec Matching', function() {

    it('should allow to match up Features and Tests into the same Spec based on their Paths', function(done) {

        framework.match(__dirname, function(specs) {

            // Number of all specs found
            specs.length.should.be.exactly(2);

            // Check Spec Titles
            specs[0].getTitle().should.be.exactly('a');
            specs[1].getTitle().should.be.exactly('foo/a');

            // Check Number of Features
            specs[0].getFeatures().length.should.be.exactly(1);
            specs[1].getFeatures().length.should.be.exactly(1);

            // Check Number of Tests
            specs[0].getTests().length.should.be.exactly(1);
            specs[1].getTests().length.should.be.exactly(1);

            // Check Filenames
            specs[0].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');
            specs[1].getLocation().filename.should.be.exactly(__dirname + '/features/foo/a.feature');

            // Check Feature Titles
            specs[0].getFeatures()[0].getTitle().should.be.exactly('A');
            specs[1].getFeatures()[0].getTitle().should.be.exactly('D');

            // Check Feature Filenames
            specs[0].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');
            specs[1].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/foo/a.feature');

            // Check Test Titles
            specs[0].getTests()[0].getTitle().should.be.exactly('B');
            specs[1].getTests()[0].getTitle().should.be.exactly('C');

            // Check Test Filenames
            specs[0].getTests()[0].getLocation().filename.should.be.exactly(__dirname + '/tests/a.test.js');
            specs[1].getTests()[0].getLocation().filename.should.be.exactly(__dirname + '/tests/foo/a.test.js');

        }, done, {
            matching: {
                type: 'path'
            }
        });

    });

});

