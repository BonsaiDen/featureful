// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var FeatureValidationError = require('./FeatureValidationError'),
    format = require('./format');


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

    addStepError: function(feature, scenario, step, error) {
        this._getFeature(feature).addStepError(scenario, step, error);
        this._errorCount++;
    },

    format: function() {
        return this.getFeatures().map(function(feature) {
            return format.header('Feature', feature)
                 + '\n\n'
                 + this.getFeature(feature).format(1);

        }, this).join('\n\n\n');
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

