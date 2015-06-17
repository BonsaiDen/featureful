var exec = require('child_process').exec,
    fs = require('fs'),
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

    it('should parse and print the AST of one or more Feature files when a list of glob patterns is passed (ignoring any duplicate matches)', function(done) {

        var child = exec(root + '/bin/featureful '
                       + ' "' + root + '/test/bin/parser/features/**/*.feature"'
                       + ' "' + root + '/test/bin/parser/features/*.feature"'
                       + ' "' + root + '/test/bin/parser/features/test/*.feature"',

                function(error, stdout, stderr) {

            stdout.should.be.exactly(
                '['
                + '\n  {'
                + '\n    "type": "File",'
                + '\n    "filename": "' + root + '/test/bin/parser/features/a.feature",'
                + '\n    "features": ['
                + '\n      {'
                + '\n        "type": "Feature",'
                + '\n        "tags": [],'
                + '\n        "title": "Feature A",'
                + '\n        "description": "",'
                + '\n        "location": {'
                + '\n          "filename": "' + root + '/test/bin/parser/features/a.feature",'
                + '\n          "line": 1,'
                + '\n          "column": 0'
                + '\n        },'
                + '\n        "scenarios": []'
                + '\n      }'
                + '\n    ]'
                + '\n  },'
                + '\n  {'
                + '\n    "type": "File",'
                + '\n    "filename": "' + root + '/test/bin/parser/features/foo/bar/b.feature",'
                + '\n    "features": ['
                + '\n      {'
                + '\n        "type": "Feature",'
                + '\n        "tags": [],'
                + '\n        "title": "Feature B",'
                + '\n        "description": "",'
                + '\n        "location": {'
                + '\n          "filename": "' + root + '/test/bin/parser/features/foo/bar/b.feature",'
                + '\n          "line": 1,'
                + '\n          "column": 0'
                + '\n        },'
                + '\n        "scenarios": []'
                + '\n      }'
                + '\n    ]'
                + '\n  },'
                + '\n  {'
                + '\n    "type": "File",'
                + '\n    "filename": "' + root + '/test/bin/parser/features/other/c.feature",'
                + '\n    "features": ['
                + '\n      {'
                + '\n        "type": "Feature",'
                + '\n        "tags": [],'
                + '\n        "title": "Feature C",'
                + '\n        "description": "",'
                + '\n        "location": {'
                + '\n          "filename": "' + root + '/test/bin/parser/features/other/c.feature",'
                + '\n          "line": 1,'
                + '\n          "column": 0'
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

    it('should print errors when parsing the AST of one or more Feature files', function(done) {

        var child = exec(root + '/bin/featureful '
                       + ' "' + root + '/test/bin/parser/error/**/*.feature"',

                function(error, stdout, stderr) {

            stdout.should.be.exactly('');
            stderr.should.be.exactly('Error: Parsing error on line 4, column 8: Expected a Given / Then / When before "And" in scenario steps.\n');
            should(error).not.be.exactly(null);
            child.exitCode.should.be.exactly(1);

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
                + '\n      at ' + root + '/test/bin/validator/error/features/a.feature (line 1, column 0)'
                + '\n    '
                + '\n      should be implemented in matching test file.'
            );

            should(error).not.be.exactly(null);
            child.exitCode.should.be.exactly(1);

            done();

        });

    });

    it('should update a existing junit xml report when being passed both a configuration file and a xml file', function(done) {

        fs.writeFileSync(__dirname + '/reporter/junit.xml', [
            '<testsuites name="featureful">',
            '<testsuite name="Feature A" tests="2" failures="0" skipped="0" timestamp="Tue, 16 Jun 2015 13:41:08 GMT" time="0.003">',
            '<testcase classname="Feature A" name="Scenario 1" time="0"/>',
            '<testcase classname="Feature A" name="Scenario 2" time="0"/>',
            '</testsuite>',
            '<testsuite name="Feature B" tests="2" failures="0" skipped="0" timestamp="Tue, 16 Jun 2015 13:41:08 GMT" time="0.001">',
            '<testcase classname="Feature B" name="Scenario 1" time="0"/>',
            '<testcase classname="Feature B" name="Scenario 2" time="0.001"/>',
            '</testsuite>',
            '</testsuites>'

        ].join('\n'));

        var child = exec(
                root + '/bin/featureful '
                + root + '/test/bin/reporter/config.js '
                + root + '/test/bin/reporter/junit.xml',

                function(error, stdout, stderr) {

            stdout.should.be.exactly('');
            stderr.should.be.exactly('');
            should(error).be.exactly(null);
            child.exitCode.should.be.exactly(0);

            // Should write out the updated XML report file
            fs.readFileSync(__dirname + '/reporter/junit.xml').toString().split(/\n/).should.be.eql([
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
                '<testsuites name="featureful">',
                '  <testsuite name="Feature A" tests="2" failures="0" skipped="0" timestamp="Tue, 16 Jun 2015 13:41:08 GMT" time="0.003">',
                '    <testcase classname="Feature A" name="Scenario 1" time="0">',
                '      <tag value="featureAScenario1TagOne"/>',
                '      <tag value="featureAScenario1TagTwo"/>',
                '    </testcase>',
                '    <testcase classname="Feature A" name="Scenario 2" time="0">',
                '      <tag value="featureAScenario2TagOne"/>',
                '      <tag value="featureAScenario2TagTwo"/>',
                '    </testcase>',
                '    <tag value="featureATagOne"/>',
                '    <tag value="featureATagTwo"/>',
                '  </testsuite>',
                '  <testsuite name="Feature B" tests="2" failures="0" skipped="0" timestamp="Tue, 16 Jun 2015 13:41:08 GMT" time="0.001">',
                '    <testcase classname="Feature B" name="Scenario 1" time="0">',
                '      <tag value="featureBScenario1TagOne"/>',
                '      <tag value="featureBScenario1TagTwo"/>',
                '    </testcase>',
                '    <testcase classname="Feature B" name="Scenario 2" time="0.001">',
                '      <tag value="featureBScenario2TagOne"/>',
                '      <tag value="featureBScenario2TagTwo"/>',
                '    </testcase>',
                '    <tag value="featureBTagOne"/>',
                '    <tag value="featureBTagTwo"/>',
                '  </testsuite>',
                '</testsuites>'
            ]);

            done();

        });

    });

});

