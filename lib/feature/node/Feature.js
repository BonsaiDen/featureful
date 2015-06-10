// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var util = require('../../util');


// Feature Node ---------------------------------------------------------------
function FeatureNode(tags, title, description, scenarios, background, loc) {
    this.type = 'FEATURE';
    this.tags = tags;
    this.title = title;
    this.description = description;
    this.scenarios = scenarios;
    this.background = background;
    this.loc = loc;
}

FeatureNode.prototype = {

    getRawTitle: function() {
        return this.title;
    },

    getTitle: function() {
        return this.title;
    },

    getDescription: function() {
        return util.extractDescription(this.description);
    },

    getScenarios: function() {
        return this.scenarios;
    },

    getLocation: function() {
        return this.loc;
    },

    getTags: function() {
        return this.tags;
    },

    toJSON: function() {
        return {
            type: this.type,
            tags: this.tags,
            title: this.getTitle(),
            description: this.getDescription(),
            location: this.getLocation(),
            scenarios: this.scenarios.map(function(scenario) {
                return scenario.toJSON();
            })
        };
    }

};

// Exports --------------------------------------------------------------------
module.exports = FeatureNode;

