// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var ScenarioValidationError = require('./ScenarioValidationError'),
    format = require('./format');


// Wrapper for Feature Validation Errors --------------------------------------
function FeatureValidationError(feature) {
    this._feature = feature;
    this._errors = [];
    this._scenarioList = [];
    this._scenarioMap = {};
    this._errorCount = 0;
}

// Methods --------------------------------------------------------------------
FeatureValidationError.prototype = {

    getCount: function() {
        return this._errorCount;
    },

    getErrors: function() {
        return this._errors;
    },

    getScenarios: function() {
        return this._scenarioList;
    },

    getScenario: function(title) {
        return this._scenarioMap[title];
    },

    addError: function(error) {
        this._errors.push(error);
        this._errorCount++;
    },

    addScenarioError: function(scenario, error) {
        this._getScenario(scenario).addError(error);
        this._errorCount++;
    },

    addStepError: function(scenario, step, error) {
        this._getScenario(scenario).addStepError(step, error);
        this._errorCount++;
    },

    format: function(indent) {

        var errors = [];
        if (this.getErrors().length) {
            errors.push(this.getErrors().map(function(error) {
                return format(error, this._scenario, indent);

            }, this).join('\n\n'));
        }

        if (this.getScenarios().length) {
            errors.push(this.getScenarios().map(function(scenario) {
                return format.header('Scenario', scenario, indent)
                     + '\n\n'
                     + this.getScenario(scenario).format(indent + 1);

            }, this).join('\n\n\n'));
        }

        return errors.join('\n\n\n');

    },

    _getScenario: function(scenario) {

        var title = scenario.getTitle();

        /* istanbul ignore else */
        if (!this._scenarioMap.hasOwnProperty(title)) {
            this._scenarioList.push(title);
            this._scenarioMap[title] = new ScenarioValidationError(this._feature, scenario);
        }

        return this._scenarioMap[title];

    }

};

// Exports --------------------------------------------------------------------
module.exports = FeatureValidationError;

