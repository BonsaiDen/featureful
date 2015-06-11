describe('Spec Matching', function() {

    it('should not match up Features and Tests into Specs based on their Tags (when tags do not match the pattern)', function(done) {

        framework.match(__dirname, function(specs) {

            // Number of all specs found
            specs.length.should.be.exactly(0);

        }, done, {
            matching: {
                type: 'tag',
                pattern: /^spec\-(\d+)/
            }
        });

    });

});


