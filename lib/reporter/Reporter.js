// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var fs = require('fs'),
    xml2js = require('xml2js');


// Reporter Implementation ----------------------------------------------------
// ----------------------------------------------------------------------------
function Reporter() {
}


// Methods --------------------------------------------------------------------
Reporter.prototype = {

    run: function(specs, reportPath) {

        // Load JUnit XML
        var xmlData = fs.readFileSync(reportPath).toString(),
            xmlReport = null;

        // Parse and Traverse XML
        xml2js.parseString(xmlData, function(err, xml) {

            // Go over all testsuites in the XML
            xml.testsuites.testsuite.forEach(function(xmlSuite) {

                // Find matching Spec and its Test
                var test = getTestFromAlias(specs, xmlSuite.$.name);

                if (test !== null) {

                    // Update Test Suite with Spec Tags
                    xmlSuite.tag = xmlSuite.tag || [];

                    // Push new tags (to allow tags from multiple files)
                    test.getTags().forEach(function(tag) {
                        xmlSuite.tag.push({
                            $: {
                                value: tag
                            }
                        });
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

        // TODO use alias instead and parse it from the test files
        if (specs[i].getTitle() === alias) {
            spec = specs[i];
            // Remove each matched spec
            specs.splice(i, 1);
            break;

        }

    }

    if (spec && spec.getTests().length) {
        return spec.getTests()[0];

    } else {
        return null;
    }

}

function getScenarioFromAlias(test, alias) {

    var scenarios = test.getScenarios(),
        scenario = null;

    for(var i = 0, l = scenarios.length; i < l; i++) {

        // TODO use alias instead and parse it from the test files
        if (scenarios[i].getTitle() === alias) {
            scenario = scenarios[i];
            break;
        }

    }

    return scenario;

}


// Exports --------------------------------------------------------------------
module.exports = Reporter;

