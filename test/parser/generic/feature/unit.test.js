describe('Feature Parsing', function() {

    it('should parse Features from both Features and Tests', function(done) {

        framework.match(__dirname, function(specs) {

            var feature = specs[0].getFeatures()[0],
                test = specs[0].getTests()[0];

            // Check Feature
            feature.getTitle().should.be.exactly('A Feature');
            feature.getTags().should.be.eql(['tagOne', 'tagTwo']);
            feature.getDescription().should.be.exactly('A\nDescription\nthat\nshould be\nhere.');
            feature.getLocation().should.be.eql({
                filename: __dirname + '/features/a.feature',
                column: 0,
                line: 2
            });

            // Check Test
            test.getTitle().should.be.exactly('A Feature');
            test.getTags().should.be.eql(['tagOne', 'tagTwo']);
            test.getDescription().should.be.exactly('A\nDescription\nthat\nshould be\nhere.');
            test.getLocation().should.be.eql({
                filename: __dirname + '/tests/a.test.js',
                column: 0,
                line: 2
            });

        }, done);

    });

});

