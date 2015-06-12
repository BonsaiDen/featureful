// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var format = require('./format');


// Wrapper for Step Validation Errors -----------------------------------------
function StepValidationError(feature, scenario, step) {
    this._feature = feature;
    this._scenario = scenario;
    this._step = step;
    this._errors = [];
    this._errorCount = 0;
}

// Methods --------------------------------------------------------------------
StepValidationError.prototype = {

    getCount: function() {
        return this._errorCount;
    },

    getErrors: function() {
        return this._errors;
    },

    addError: function(error) {
        this._errors.push(error);
        this._errorCount++;
    },

    format: function(indent) {
        return this.getErrors().map(function(error) {
            return format(error, this._step, indent);

        }, this).join('\n\n');
    }

};


// Exports --------------------------------------------------------------------
module.exports = StepValidationError;

