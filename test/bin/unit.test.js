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

    it('should parse and print the AST of one or more Feature files when one or more glob patterns are passed as the arguments', function(done) {

        var child = exec(root + '/bin/featureful ' + root + '/test/bin/parser/features/**/*.feature', function(error, stdout, stderr) {

            child.exitCode.should.be.exactly(0);
            should(error).be.exactly(null);
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

            done();

        });

    });

    it('should validate Features and Tests with options a specified from a configuration file and exit with code 0 in case Features and Tests match', function() {

    });

    it('should validate Features and Tests with options a specified from a configuration file and exit with code 0 in case Features and Tests match', function() {

    });

});

