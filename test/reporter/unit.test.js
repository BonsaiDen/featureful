describe('Report', function() {

    var Reporter = require('../../lib/reporter/Reporter');

    it('should add parsed tags from test files to their matching suites and cases in externally generated junit xml report', function(done) {

        framework.report(__dirname, function(specs) {

            var reporter = new Reporter(),
                report = reporter.run(specs, __dirname + '/junit.xml');

            report.split(/\n/).should.be.eql([
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

        }, done);

    });

    it('should ignore unkown suites and cases in a junit xml report', function(done) {

        framework.report(__dirname, function(specs) {

            var reporter = new Reporter(),
                report = reporter.run(specs, __dirname + '/missing.xml');

            report.split(/\n/).should.be.eql([
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
                '<testsuites name="featureful">',
                '  <testsuite name="Feature A" tests="2" failures="0" skipped="0" timestamp="Tue, 16 Jun 2015 13:41:08 GMT" time="0.003">',
                '    <testcase classname="Feature A" name="Scenario 3" time="0"/>',
                '    <testcase classname="Feature A" name="Scenario 4" time="0"/>',
                '    <tag value="featureATagOne"/>',
                '    <tag value="featureATagTwo"/>',
                '  </testsuite>',
                '  <testsuite name="Feature C" tests="2" failures="0" skipped="0" timestamp="Tue, 16 Jun 2015 13:41:08 GMT" time="0.001">',
                '    <testcase classname="Feature C" name="Scenario 1" time="0"/>',
                '    <testcase classname="Feature C" name="Scenario 2" time="0.001"/>',
                '  </testsuite>',
                '</testsuites>'
            ]);

        }, done);

    });

});

