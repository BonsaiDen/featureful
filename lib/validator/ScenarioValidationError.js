// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var ExpectationValidationError = require('./ExpectationValidationError');


// Wrapper for Scenario Validation Errors -------------------------------------
function ScenarioValidationError(feature, scenario) {
    this._feature = feature;
    this._scenario = scenario;
    this._errors = [];
    this._expectationList = [];
    this._expectationMap = {};
    this._errorCount = 0;
}

// Methods --------------------------------------------------------------------
ScenarioValidationError.prototype = {

    getCount: function() {
        return this._errorCount;
    },

    getErrors: function() {
        return this._errors;
    },

    getExpectations: function() {
        return this._expectationList;
    },

    getExpectation: function(title) {
        return this._expectationMap[title];
    },

    addError: function(error) {
        this._errors.push(error);
        this._errorCount++;
    },

    addExpecationError: function(expectation, error) {
        this._getExpecation(expectation).addError(error);
        this._errorCount++;
    },

    _getExpecation: function(expectation) {

        var title = expectation.getTitle();

        /* istanbul ignore else */
        if (!this._expectationMap.hasOwnProperty(title)) {
            this._expectationList.push(title);
            this._expectationMap[title] = new ExpectationValidationError(this._feature, this._scenario, expectation);
        }

        return this._expectationMap[title];

    }

};


// Exports --------------------------------------------------------------------
module.exports = ScenarioValidationError;

