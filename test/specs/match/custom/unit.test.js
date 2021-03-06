describe('Spec Matching', function() {

    var root = process.cwd(),
        Test = require('../../../../lib/test/Test');

    it('should allow to match up Features and Tests into the same Spec based on custom functions', function(done) {

        var index = 0;
        framework.match(__dirname, function(specs) {

            // Number of all specs found
            specs.length.should.be.exactly(1);

            // Check Spec Titles
            specs[0].getTitle().should.be.exactly('matchingID');

            // Check Number of Features
            specs[0].getFeatures().length.should.be.exactly(1);

            // Check Number of Tests
            specs[0].getTests().length.should.be.exactly(1);

            // Check Filenames
            specs[0].getLocation().filename.should.be.exactly(__dirname + '/features/b.feature');

            // Check Feature Titles
            specs[0].getFeatures()[0].getTitle().should.be.exactly('Feature B');

            // Check Feature Filenames
            specs[0].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/b.feature');

            // Check Test Titles
            specs[0].getTests()[0].getTitle().should.be.exactly('Feature A');

            // Check Test Filenames
            specs[0].getTests()[0].getLocation().filename.should.be.exactly(__dirname + '/tests/a.test.js');

            // Check matching function calls
            index.should.be.exactly(4);

        }, done, {
            matching: function matchingFunction(object, path, options) {

                // Should first try to match all Features
                if (index === 0) {

                    // Should pass in a Feature instance
                    object.toJSON().should.be.eql({
                        type: 'Feature',
                        tags: [],
                        title: 'Feature A',
                        description: '',
                        scenarios: [],
                        location: {
                            filename: root + '/test/specs/match/custom/features/a.feature',
                            line: 1,
                            column: 0
                        }
                    });

                    // Should pass in a Path Descriptor
                    path.should.be.eql({
                        directory: '',
                        fullpath: root + '/test/specs/match/custom/features/a.feature',
                        id: 'a',
                        name: 'a'
                    });

                } else if (index === 1) {

                    // Should pass in a Feature instance
                    object.toJSON().should.be.eql({
                        type: 'Feature',
                        tags: [],
                        title: 'Feature B',
                        description: '',
                        scenarios: [],
                        location: {
                            filename: root + '/test/specs/match/custom/features/b.feature',
                            line: 1,
                            column: 0
                        }
                    });

                    // Should pass in a Path Descriptor
                    path.should.be.eql({
                        directory: '',
                        fullpath: root + '/test/specs/match/custom/features/b.feature',
                        id: 'b',
                        name: 'b'
                    });

                // Should then try to match all Tests
                } else if (index === 2) {

                    // Should pass in a Test instance
                    object.should.be.instanceof(Test);

                    // Should pass in a Path Descriptor
                    path.should.be.eql({
                        directory: '',
                        fullpath: root + '/test/specs/match/custom/tests/a.test.js',
                        id: 'a',
                        name: 'a'
                    });

                } else if (index === 3) {

                    // Should pass in a Test instance
                    object.should.be.instanceof(Test);

                    // Should pass in a Path Descriptor
                    path.should.be.eql({
                        directory: '',
                        fullpath: root + '/test/specs/match/custom/tests/b.test.js',
                        id: 'b',
                        name: 'b'
                    });

                } else {
                    throw new Error('Unexpected fifth matching call.');
                }

                // Should pass in the Parser options
                options.should.be.eql({
                    features: {
                        pattern: root + '/test/specs/match/custom/features/**/*.feature'
                    },
                    tests: {
                        pattern: root + '/test/specs/match/custom/tests/**/*.test.js',
                        framework: 'mocha'
                    },
                    specs: {
                        ignores: {},
                        matching: matchingFunction
                    }
                });

                // Match second feature with first test
                if (index === 1 || index === 2) {
                    index++;
                    return 'matchingID';

                } else {
                    index++;
                    return null;
                }

            }

        });

    });

});

