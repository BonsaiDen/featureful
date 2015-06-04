// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var FeatureValidationError = require('./FeatureValidationError');


// Wrapper for Spec Validation Errors -----------------------------------------
function ValidationError() {
    this._featureList = [];
    this._featureMap = {};
    this._errorCount = 0;
}

// Methods --------------------------------------------------------------------
ValidationError.prototype = {

    getFeatures: function() {
        return this._featureList;
    },

    getFeature: function(title) {
        return this._featureMap[title];
    },

    getCount: function() {
        return this._errorCount;
    },

    addFeatureError: function(feature, error) {
        this._getFeature(feature).addError(error);
        this._errorCount++;
    },

    addScenarioError: function(feature, scenario, error) {
        this._getFeature(feature).addScenarioError(scenario, error);
        this._errorCount++;
    },

    addExpecationError: function(feature, scenario, expectation, error) {
        this._getFeature(feature).addExpecationError(scenario, expectation, error);
        this._errorCount++;
    },

    _getFeature: function(feature) {

        var title = feature.getTitle();

        /* istanbul ignore else */
        if (!this._featureMap.hasOwnProperty(title)) {
            this._featureList.push(title);
            this._featureMap[title] = new FeatureValidationError(feature);
        }

        return this._featureMap[title];

    }

};

// Exports --------------------------------------------------------------------
module.exports = ValidationError;

