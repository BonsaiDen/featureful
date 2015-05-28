describe('Spec creation from multiple', function() {

    it('should create Specs from multiple Tests within the same File', function(done) {

        framework.match(__dirname, function(specs) {

            // Number of all specs found
            specs.length.should.be.exactly(3);

            // Check Spec Titles from Feature Titles
            specs[0].getTitle().should.be.exactly('A');
            specs[1].getTitle().should.be.exactly('B');
            specs[2].getTitle().should.be.exactly('C');

            // Check Spec Filenames
            specs[0].getLocation().filename.should.be.exactly(__dirname + '/tests/a.test.js');
            specs[1].getLocation().filename.should.be.exactly(__dirname + '/tests/a.test.js');
            specs[2].getLocation().filename.should.be.exactly(__dirname + '/tests/a.test.js');

            // Check Test Filenames
            specs[0].getTests()[0].getLocation().filename.should.be.exactly(__dirname + '/tests/a.test.js');
            specs[1].getTests()[0].getLocation().filename.should.be.exactly(__dirname + '/tests/a.test.js');
            specs[2].getTests()[0].getLocation().filename.should.be.exactly(__dirname + '/tests/a.test.js');

        }, done);

    });

});

