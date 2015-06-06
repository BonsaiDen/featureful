// ### @tagFeature @tagMismatch
describe('A Feature', function() {

    /*
        A
        Feature
        Description
        mismatch.
     */

    // ### @tagScenarioOne @tagScenarioMismatch
    it('Scenario One', function() {

        // ### Given something
        1 + 2;

        // ### When something

        // ### Then something else
        1 + 2;

    });

    // ### @tagScenarioOne
    it('Another Scenario', function() {

        // ### Given something
        1 + 2;

        // ### Then something
        1 + 2;

        // ### When something
        1 + 2;

    });

});

