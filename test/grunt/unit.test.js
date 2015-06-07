var should = require('should');

describe('Grunt', function() {

    function MockGrunt() {

        var logs = [],
            tasks = [],
            failure = null;

        return {

            // Mocked API
            registerMultiTask: function(name, description, callback) {
                tasks.push({
                    name: name,
                    description: description,
                    callback: callback
                });
            },

            log: {

                ok: function(message) {
                    logs.push(message);
                },

                writeln: function(message) {
                    logs.push.apply(logs, message.split(/\n/));
                }
            },

            fail: {
                fatal: function(err) {
                    failure = err;
                }
            },


            // Test API
            run: function(options, done) {
                tasks[0].callback.call({

                    async: function() {
                        return done;
                    },

                    options: function() {
                        return options;
                    }

                });
            },

            getLogs: function() {
                return logs;
            },

            getTasks: function() {
                return tasks;
            },

            getFailure: function() {
                return failure;
            }

        };

    }

    it('should provide a Grunt Task for Feature / Test Validation', function() {

        var grunt = MockGrunt(),
            mod = require('../../tasks/featureful.js');

        // Should export a function that takes one argument
        mod.should.be.instanceof(Function);
        mod.length.should.be.exactly(1);

        mod(grunt);

        // Should define a multi task
        grunt.getTasks().length.should.be.exactly(1);
        grunt.getTasks()[0].name.should.be.exactly('featureful');
        grunt.getTasks()[0].description.should.be.exactly('Automatically verifies tests implementations against cucumber feature specs.');
        grunt.getTasks()[0].callback.should.be.instanceof(Function);

    });

    it('should parse and validate specs with no errors via the Grunt Task and exit cleanly', function(done) {

        var grunt = MockGrunt(),
            mod = require('../../tasks/featureful.js');

        mod(grunt);

        grunt.run({

            features: {
                pattern: __dirname + '/valid/features/**/*.feature'
            },

            tests: {
                pattern: __dirname + '/valid/tests/**/*.test.js'
            },

            framework: 'mocha'

        }, function() {

            // Should log
            grunt.getLogs().should.be.eql([
                'Comparing Test and Features...',
                'Tests and Features are up to date.'
            ]);

            // Should not fail hard
            should(grunt.getFailure()).be.exactly(null);

            // Should call done() without arguments
            arguments.length.should.be.exactly(0);


            done();

        });

    });

    it('should parse and validate specs with errors via the Grunt Task, report them and fail the task', function(done) {

        var grunt = MockGrunt(),
            mod = require('../../tasks/featureful.js');

        mod(grunt);

        grunt.run({

            features: {
                pattern: __dirname + '/error/features/**/*.feature'
            },

            tests: {
                pattern: __dirname + '/error/tests/**/*.test.js'
            },

            framework: 'mocha'

        }, function(error) {

            // Should log
            grunt.getLogs().should.be.eql([
                'Comparing Test and Features...',
                'Feature: A Feature',
                '',
                '    - Test implementation for feature is missing.',
                '    ',
                '          "A Feature"',
                '    ',
                '      at /home/ivo/Desktop/featureful/test/grunt/error/features/a.feature (line 1, column 0)',
                '    ',
                '      should be implemented in matching test file.'
            ]);

            // Should not fail hard
            should(grunt.getFailure()).be.exactly(null);

            // Should call done() with an error
            arguments.length.should.be.exactly(1);
            error.should.be.instanceof(Error);
            error.message.should.be.exactly('Tests and Features do not match!');

            done();

        });

    });

});

