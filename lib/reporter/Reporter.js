// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var fs = require('fs'),
    glob = require('glob'),
    xml2js = require('xml2js');


// Reporter Implementation ----------------------------------------------------
// ----------------------------------------------------------------------------
var Reporter = {

    rewrite: function(specs, pattern) {

        glob.sync(pattern).forEach(function(file) {
            fs.writeFileSync(
                file,
                Reporter._run(specs, file)
            );
        });

    },

    _run: function(specs, xmlFile) {

        // Load JUnit XML
        var xmlData = fs.readFileSync(xmlFile).toString(),
            xmlReport = null;

        // Parse and Traverse XML
        xml2js.parseString(xmlData, function(err, xml) {

            // Go over all testsuites in the XML
            xml.testsuites.testsuite.forEach(function(xmlSuite) {

                // Find matching Spec and its Test
                var test = getTestFromAlias(specs, xmlSuite.$.name);

                if (test !== null) {

                    // Update Test Suite with Spec Tags
                    xmlSuite.tag = test.getTags().map(function(tag) {
                        return {
                            $: {
                                value: tag
                            }
                        };
                    });

                    // Go over all testcases in the XML suite
                    xmlSuite.testcase.forEach(function(xmlCase) {

                        // Find matching Scenario in the Spec
                        var scenario = getScenarioFromAlias(test, xmlCase.$.name);

                        if (scenario) {

                            // Update Test Case with Scenario Tags
                            xmlCase.tag = scenario.getTags().map(function(tag) {
                                return {
                                    $: {
                                        value: tag
                                    }
                                };
                            });

                        }

                    });

                }

            });

            xmlReport = new xml2js.Builder().buildObject(xml);

        });

        return xmlReport;

    }

};


// Helpers --------------------------------------------------------------------
function getTestFromAlias(specs, alias) {

    var spec = null;
    for(var i = 0, l = specs.length; i < l; i++) {

        if (specs[i].getAlias() === alias) {
            spec = specs[i];
            break;

        }

    }

    if (spec && spec.getAlias() !== null) {
        return spec.getTests()[0];

    } else {
        return null;
    }

}

function getScenarioFromAlias(test, alias) {

    var scenarios = test.getScenarios(),
        scenario = null;

    for(var i = 0, l = scenarios.length; i < l; i++) {

        if (scenarios[i].getAlias() === alias) {
            scenario = scenarios[i];
            break;
        }

    }

    return scenario;

}


// Exports --------------------------------------------------------------------
module.exports = Reporter;

