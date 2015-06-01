describe('Feature Parsing', function() {

    it('should parse Features from both Features and Tests', function(done) {

        framework.match(__dirname, function(specs) {

            var feature = specs[0].getFeatures()[0],
                test = specs[0].getTests()[0];

            // Check Feature
            feature.getTitle().should.be.exactly('A Feature');
            feature.getDescription().should.be.exactly('A\nDescription\nthat\nshould be\nhere.');
            feature.getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                col: 0,
                line: 1
            });

            // Check Test
            test.getTitle().should.be.exactly('A Feature');
            test.getDescription().should.be.exactly('A\nDescription\nthat\nshould be\nhere.');
            test.getLocation().should.be.eql({
                filename: __dirname + '/tests/a.test.js',
                col: 0,
                line: 1
            });

        }, done);

    });

});

