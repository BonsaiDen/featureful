describe('Spec matching from Title', function() {

    it('should match up a Spec from a Single Feature and multiple Test Files (based on Titles)', function(done) {

        framework.match(__dirname, function(specs) {

            // Number of all specs found
            specs.length.should.be.exactly(1);

            // Check Spec Title
            specs[0].getTitle().should.be.exactly('A');

            // Check Number of Features
            specs[0].getFeatures().length.should.be.exactly(1);

            // Check Number of Tests
            specs[0].getTests().length.should.be.exactly(3);

            // Check Test Titles
            specs[0].getTests()[0].getTitle().should.be.exactly('A');
            specs[0].getTests()[1].getTitle().should.be.exactly('A');
            specs[0].getTests()[2].getTitle().should.be.exactly('A');

            // Check Test Filenames
            specs[0].getTests()[0].getLocation().filename.should.be.exactly(__dirname + '/tests/a_1.test.js');
            specs[0].getTests()[1].getLocation().filename.should.be.exactly(__dirname + '/tests/a_2.test.js');
            specs[0].getTests()[2].getLocation().filename.should.be.exactly(__dirname + '/tests/a_3.test.js');

        }, done);

    });

});

