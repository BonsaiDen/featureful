describe('Validation Error Formatting', function() {

    var Validator = require('../../../lib/validator/Validator'),
        root = process.cwd();

    it('should deep format validation errors', function(done) {

        framework.match(__dirname, function(specs) {

            var validator = new Validator(),
                result = validator.compare(specs);

            // Check error count
            result.getCount().should.be.exactly(11);

            // Check Feature Errors
            result.getFeatures().should.be.eql(['A Feature', 'Another Feature']);

            // Check Feature Error Count
            result.getFeature('A Feature').getCount().should.be.exactly(10);
            result.getFeature('Another Feature').getCount().should.be.exactly(1);

            // Check Scenario Errors
            result.getFeature('A Feature').getScenarios().should.be.eql(['Scenario One', 'Another Scenario Two', 'The third Scenario']);

            // Check Scenario Error Count
            result.getFeature('A Feature').getScenario('Scenario One').getCount().should.be.exactly(3);
            result.getFeature('A Feature').getScenario('Another Scenario Two').getCount().should.be.exactly(4);
            result.getFeature('A Feature').getScenario('The third Scenario').getCount().should.be.exactly(1);

            // TODO Check Expectation Errors


            // Check formatted Error
            result.format().split(/\n/).should.be.eql([
                "Feature: A Feature",
                "",
                "    - Incorrect Feature tags in test:",
                "    ",
                "          @tagFeature @tagMismatch",
                "    ",
                "      at " + root + "/test/validator/format/tests/a.test.js (line 2, column 0)",
                "    ",
                "      does not match the tags from the feature file:",
                "    ",
                "          @tagFeature",
                "    ",
                "      in " + root + "/test/validator/format/features/a.feature (line 2, column 0)",
                "",
                "    - Incorrect Feature description in test:",
                "    ",
                "          \"",
                "          A",
                "          Feature",
                "          Description",
                "          mismatch.",
                "          \"",
                "    ",
                "      at " + root + "/test/validator/format/tests/a.test.js (line 2, column 0)",
                "    ",
                "      does not match the description from the feature file:",
                "    ",
                "          \"",
                "          A",
                "          Feature",
                "          Description.",
                "          \"",
                "    ",
                "      in " + root + "/test/validator/format/features/a.feature (line 2, column 0)",
                "",
                "",
                "    Scenario: Scenario One",
                "",
                "        - Incorrect Scenario tags in test:",
                "        ",
                "              @tagScenarioOne @tagScenarioMismatch",
                "        ",
                "          at " + root + "/test/validator/format/tests/a.test.js (line 12, column 4)",
                "        ",
                "          does not match the tags from the feature file:",
                "        ",
                "              @tagScenarioOne",
                "        ",
                "          in " + root + "/test/validator/format/features/a.feature (line 9, column 4)",
                "",
                "",
                "        Expectation: When something",
                "",
                "            - Missing code expression for Expectation in test:",
                "            ",
                "                  \"When something\"",
                "            ",
                "              at " + root + "/test/validator/format/tests/a.test.js (line 17, column 8)",
                "",
                "",
                "        Expectation: Then something",
                "",
                "            - Incorrect Expectation title in test:",
                "            ",
                "                  \"Then something else\"",
                "            ",
                "              at " + root + "/test/validator/format/tests/a.test.js (line 19, column 8)",
                "            ",
                "              does not match the title from the feature file:",
                "            ",
                "                  \"Then something\"",
                "            ",
                "              in " + root + "/test/validator/format/features/a.feature (line 12, column 8)",
                "",
                "",
                "    Scenario: Another Scenario Two",
                "",
                "        - Incorrect Scenario tags in test:",
                "        ",
                "              @tagScenarioTwotagScenarioOne",
                "        ",
                "          at " + root + "/test/validator/format/tests/a.test.js (line 25, column 4)",
                "        ",
                "          does not match the tags from the feature file:",
                "        ",
                "              @tagScenarioTwo",
                "        ",
                "          in " + root + "/test/validator/format/features/a.feature (line 15, column 4)",
                "",
                "        - Incorrect Scenario title in test:",
                "        ",
                "              \"Another Scenario Two\"",
                "        ",
                "          at " + root + "/test/validator/format/tests/a.test.js (line 25, column 4)",
                "        ",
                "          does not match the title from the feature file:",
                "        ",
                "              \"Another Scenario Two\"",
                "        ",
                "          in " + root + "/test/validator/format/features/a.feature (line 15, column 4)",
                "",
                "",
                "        Expectation: When something",
                "",
                "            - Incorrect Expectation order in test:",
                "            ",
                "                  \"When something\" is currently implemented as expectation #2",
                "            ",
                "              at " + root + "/test/validator/format/tests/a.test.js (line 33, column 8)",
                "            ",
                "              but should be implemented as #1 as defined in the feature file.",
                "            ",
                "              in " + root + "/test/validator/format/features/a.feature (line 17, column 8)",
                "",
                "",
                "        Expectation: Then something",
                "",
                "            - Incorrect Expectation order in test:",
                "            ",
                "                  \"Then something\" is currently implemented as expectation #1",
                "            ",
                "              at " + root + "/test/validator/format/tests/a.test.js (line 30, column 8)",
                "            ",
                "              but should be implemented as #2 as defined in the feature file.",
                "            ",
                "              in " + root + "/test/validator/format/features/a.feature (line 18, column 8)",
                "",
                "",
                "    Scenario: The third Scenario",
                "",
                "        - No test for Scenario:",
                "        ",
                "              \"The third Scenario\"",
                "        ",
                "          at " + root + "/test/validator/format/features/a.feature (line 21, column 4)",
                "        ",
                "          should be implemented under existing parent test.",
                "        ",
                "          in " + root + "/test/validator/format/tests/a.test.js (line 2, column 0)",
                "",
                "",
                "Feature: Another Feature",
                "",
                "    - Test implementation for feature is missing.",
                "    ",
                "          \"Another Feature\"",
                "    ",
                "      at " + root + "/test/validator/format/features/b.feature (line 1, column 0)",
                "    ",
                "      should be implemented in matching test file."
            ]);

        }, done);

    });

});


