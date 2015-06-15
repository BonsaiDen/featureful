// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var util = require('../../util');


// Feature Node ---------------------------------------------------------------
function FeatureNode(tags, title, description, scenarios, background, loc) {
    this._type = 'Feature';
    this._tags = tags;
    this._title = title;
    this._description = description;
    this._scenarios = scenarios;
    this._background = background;
    this._loc = loc;
}

FeatureNode.prototype = {

    getRawTitle: function() {
        return this._title;
    },

    getTitle: function() {
        return this._title;
    },

    getDescription: function() {
        return util.extractDescription(this._description);
    },

    getScenarios: function() {
        return this._scenarios;
    },

    getLocation: function() {
        return this._loc;
    },

    getTags: function() {
        return this._tags;
    },

    filter: function(ignores, path, options) {
        this._scenarios = this._scenarios.filter(function(scenario) {
            return ignores(scenario, path, options) !== true;
        });
    },

    toJSON: function() {
        return {
            type: this._type,
            tags: this.getTags(),
            title: this.getTitle(),
            description: this.getDescription(),
            location: this.getLocation(),
            scenarios: this.getScenarios().map(function(scenario) {
                return scenario.toJSON();
            })
        };
    }

};

// Exports --------------------------------------------------------------------
module.exports = FeatureNode;

