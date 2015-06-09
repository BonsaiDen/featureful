describe('Spec matching from Tag', function() {

    it('should not match up Features and Tests into Specs via a Tag Matching (when tags do not match the pattern)', function(done) {

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


