describe('Ignores', function() {

    var root = process.cwd(),
        Test = require('../../../../lib/test/Test'),
        Scenario = require('../../../../lib/test/Scenario');

    it('should allow to ignore Features, Tests and Scenarios based on custom functions', function(done) {

        var index = 0;
        framework.match(__dirname, function(specs) {


            // Number of all specs found
            specs.length.should.be.exactly(1);

            // Check Spec Titles
            specs[0].getTitle().should.be.exactly('Feature A');

            // Check Number of Features for each Spec
            specs[0].getFeatures().length.should.be.exactly(1);

            // Check Number of Tests for each Spec
            specs[0].getTests().length.should.be.exactly(1);

            // Check Spec Filenames
            specs[0].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');

            // Check Feature Titles
            specs[0].getFeatures()[0].getTitle().should.be.exactly('Feature A');

            // Check Feature Filenames
            specs[0].getFeatures()[0].getLocation().filename.should.be.exactly(__dirname + '/features/a.feature');

            // Check Test Titles
            specs[0].getTests()[0].getTitle().should.be.exactly('Feature A');

            // Check Test Filenames
            specs[0].getTests()[0].getLocation().filename.should.be.exactly(__dirname + '/tests/a.test.js');

            // Check Feature Scenarios
            specs[0].getFeatures()[0].getScenarios().length.should.be.exactly(1);
            specs[0].getFeatures()[0].getScenarios()[0].getTitle().should.be.exactly('A Scenario');

            // Check Test Scenarios
            specs[0].getTests()[0].getScenarios().length.should.be.exactly(1);
            specs[0].getTests()[0].getScenarios()[0].getTitle().should.be.exactly('A Scenario');

            // Check ignore function calls
            index.should.be.exactly(8);

        }, done, {

            ignores: function ignoreFunction(object, path, options) {

                // Should pass in the Parser options
                options.should.be.eql({
                    features: {
                        pattern: root + '/test/specs/ignore/custom/features/**/*.feature'
                    },
                    tests: {
                        pattern: root + '/test/specs/ignore/custom/tests/**/*.test.js',
                        framework: 'mocha'
                    },
                    specs: {
                        ignores: ignoreFunction,
                        matching: {}
                    }
                });

                // Should be called with a.feature
                if (index === 0) {

                    // Should pass in a Feature instance
                    object.toJSON().type.should.be.exactly('Feature');

                    // Should pass in a Path Descriptor
                    path.should.be.eql({
                        directory: '',
                        fullpath: root + '/test/specs/ignore/custom/features/a.feature',
                        id: 'a',
                        name: 'a'
                    });

                // Feature A Scenario 1
                } else if (index === 1) {

                    // Should pass in a Scenario instance
                    object.toJSON().type.should.be.exactly('Scenario');

                    // Should pass in a Location Descriptor
                    path.should.be.eql({
                        directory: '',
                        fullpath: root + '/test/specs/ignore/custom/features/a.feature',
                        id: 'a',
                        name: 'a'
                    });

                // Feature A Scenario 2
                } else if (index === 2) {

                    // Should pass in a Scenario instance
                    object.toJSON().type.should.be.exactly('Scenario');

                    // Should pass in a Location Descriptor
                    path.should.be.eql({
                        directory: '',
                        fullpath: root + '/test/specs/ignore/custom/features/a.feature',
                        id: 'a',
                        name: 'a'
                    });

                // Should be called with b.feature
                } else if (index === 3) {

                    // Should pass in a Feature instance
                    object.toJSON().type.should.be.exactly('Feature');

                    // Should pass in a Path Descriptor
                    path.should.be.eql({
                        directory: '',
                        fullpath: root + '/test/specs/ignore/custom/features/b.feature',
                        id: 'b',
                        name: 'b'
                    });

                // Should be called with a.test.js
                } else if (index === 4) {

                    // Should pass in a Test instance
                    object.should.be.instanceof(Test);

                    // Should pass in a Path Descriptor
                    path.should.be.eql({
                        directory: '',
                        fullpath: root + '/test/specs/ignore/custom/tests/a.test.js',
                        id: 'a',
                        name: 'a'
                    });

                // Test A Scenario 1
                } else if (index === 5) {

                    // Should pass in a Scenario instance
                    object.should.be.instanceof(Scenario);

                    // Should pass in a Location Descriptor
                    path.should.be.eql({
                        directory: '',
                        fullpath: root + '/test/specs/ignore/custom/tests/a.test.js',
                        id: 'a',
                        name: 'a'
                    });

                // Test A Scenario 2
                } else if (index === 6) {

                    // Should pass in a Scenario instance
                    object.should.be.instanceof(Scenario);

                    // Should pass in a Location Descriptor
                    path.should.be.eql({
                        directory: '',
                        fullpath: root + '/test/specs/ignore/custom/tests/a.test.js',
                        id: 'a',
                        name: 'a'
                    });

                // Should be called with b.test.js
                } else if (index === 7) {

                    // Should pass in a Test instance
                    object.should.be.instanceof(Test);

                    // Should pass in a Path Descriptor
                    path.should.be.eql({
                        directory: '',
                        fullpath: root + '/test/specs/ignore/custom/tests/b.test.js',
                        id: 'b',
                        name: 'b'
                    });

                }

                index++;

                return object.getTitle().indexOf('ignored') !== -1;

            }

        });

    });

});

