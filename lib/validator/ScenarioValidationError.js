// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var StepValidationError = require('./StepValidationError'),
    format = require('./format');


// Wrapper for Scenario Validation Errors -------------------------------------
function ScenarioValidationError(feature, scenario) {
    this._feature = feature;
    this._scenario = scenario;
    this._errors = [];
    this._stepList = [];
    this._stepMap = {};
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

    getSteps: function() {
        return this._stepList;
    },

    getStep: function(title) {
        return this._stepMap[title];
    },

    addError: function(error) {
        this._errors.push(error);
        this._errorCount++;
    },

    addStepError: function(step, error) {
        this._getStep(step).addError(error);
        this._errorCount++;
    },

    format: function(indent) {

        var errors = [];
        if (this.getErrors().length) {
            errors.push(this.getErrors().map(function(error) {
                return format(error, this._scenario, indent);

            }, this).join('\n\n'));
        }

        if (this.getSteps().length) {
            errors.push(this.getSteps().map(function(step) {
                return format.header('Step', step, indent)
                     + '\n\n'
                     + this.getStep(step).format(indent + 1);

            }, this).join('\n\n\n'));
        }

        return errors.join('\n\n\n');

    },

    _getStep: function(step) {

        var title = step.getTitle();

        /* istanbul ignore else */
        if (!this._stepMap.hasOwnProperty(title)) {
            this._stepList.push(title);
            this._stepMap[title] = new StepValidationError(this._feature, this._scenario, step);
        }

        return this._stepMap[title];

    }

};


// Exports --------------------------------------------------------------------
module.exports = ScenarioValidationError;

