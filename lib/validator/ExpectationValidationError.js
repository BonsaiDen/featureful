// Wrapper for Expectation Validation Errors ----------------------------------
function ExpectationValidationError(feature, scenario, expectation) {
    this._feature = feature;
    this._scenario = scenario;
    this._expectation = expectation;
    this._errors = [];
    this._expectationList = [];
    this._expectationMap = {};
    this._errorCount = 0;
}

// Methods --------------------------------------------------------------------
ExpectationValidationError.prototype = {

    getCount: function() {
        return this._errorCount;
    },

    getErrors: function() {
        return this._errors;
    },

    addError: function(error) {
        this._errors.push(error);
        this._errorCount++;
    }

};


// Exports --------------------------------------------------------------------
module.exports = ExpectationValidationError;


