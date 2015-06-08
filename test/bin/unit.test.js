var exec = require('child_process').exec,
    should = require('should'),
    root = process.cwd();

describe('Binary', function() {

    it('should provide a "featureful" binary for command line Feature / Test Validation', function(done) {

        var child = exec(root + '/bin/featureful', function(error, stdout, stderr) {

            child.exitCode.should.be.exactly(0);
            should(error).be.exactly(null);
            stdout.should.be.exactly('Usage: featureful [configfile | pattern...]\n');
            stderr.should.be.exactly('');

            done();

        });

    });

    it('should parse and print the AST of one or more Feature files when a glob patterns is passed as the argument', function(done) {

        var child = exec(root + '/bin/featureful ' + root + '/test/bin/parser/features/**/*.feature', function(error, stdout, stderr) {

            stdout.should.be.exactly(
                '['
                + '\n  {'
                + '\n    "type": "FILE",'
                + '\n    "filename": "' + root + '/test/bin/parser/features/a.feature",'
                + '\n    "features": ['
                + '\n      {'
                + '\n        "type": "FEATURE",'
                + '\n        "tags": [],'
                + '\n        "title": "Feature A",'
                + '\n        "description": "",'
                + '\n        "location": {'
                + '\n          "filename": "' + root + '/test/bin/parser/features/a.feature",'
                + '\n          "line": 1,'
                + '\n          "col": 0'
                + '\n        },'
                + '\n        "scenarios": []'
                + '\n      }'
                + '\n    ]'
                + '\n  },'
                + '\n  {'
                + '\n    "type": "FILE",'
                + '\n    "filename": "' + root + '/test/bin/parser/features/foo/bar/b.feature",'
                + '\n    "features": ['
                + '\n      {'
                + '\n        "type": "FEATURE",'
                + '\n        "tags": [],'
                + '\n        "title": "Feature B",'
                + '\n        "description": "",'
                + '\n        "location": {'
                + '\n          "filename": "' + root + '/test/bin/parser/features/foo/bar/b.feature",'
                + '\n          "line": 1,'
                + '\n          "col": 0'
                + '\n        },'
                + '\n        "scenarios": []'
                + '\n      }'
                + '\n    ]'
                + '\n  }'
                + '\n]'
            );

            stderr.should.be.exactly('');
            should(error).be.exactly(null);
            child.exitCode.should.be.exactly(0);

            done();

        });

    });

    it('should validate Features and Tests with options a specified from a configuration file and exit with code 0 in case Features and Tests match', function(done) {

        var child = exec(root + '/bin/featureful ' + root + '/test/bin/validator/valid/config.js', function(error, stdout, stderr) {

            stdout.should.be.exactly('');
            stderr.should.be.exactly('');
            should(error).be.exactly(null);
            child.exitCode.should.be.exactly(0);

            done();

        });

    });

    it('should validate Features and Tests with options a specified from a configuration file and exit with code 0 in case Features and Tests match', function(done) {

        var child = exec(root + '/bin/featureful ' + root + '/test/bin/validator/error/config.js', function(error, stdout, stderr) {

            stdout.should.be.exactly('');
            stderr.should.be.exactly(
                'Feature: Feature A'
                + '\n'
                + '\n    - Test implementation for feature is missing.'
                + '\n    '
                + '\n          "Feature A"'
                + '\n    '
                + '\n      at /home/ivo/Desktop/featureful/test/bin/validator/error/features/a.feature (line 1, column 0)'
                + '\n    '
                + '\n      should be implemented in matching test file.'
            );

            should(error).not.be.exactly(null);
            child.exitCode.should.be.exactly(1);

            done();

        });

    });

});

