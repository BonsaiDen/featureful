// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var util = require('../../util');


// Scenario Node --------------------------------------------------------------
function ScenarioNode(tags, title, description, steps, examples, loc) {
    this._type = 'Scenario';
    this._tags = tags;
    this._title = title.trim();
    this._description = description;
    this._given = steps.given;
    this._when = steps.when;
    this._then = steps.then;
    this._examples = examples;
    this._loc = loc;
}


// Methods --------------------------------------------------------------------
ScenarioNode.prototype = {

    getRawTitle: function() {
        return this._title;
    },

    getTitle: function() {
        return this._title;
    },

    getDescription: function() {
        return util.extractDescription(this._description);
    },

    getSteps: function() {
        var steps = [];
        steps.push.apply(steps, this._given);
        steps.push.apply(steps, this._when);
        steps.push.apply(steps, this._then);
        return steps;
    },

    getLocation: function() {
        return this._loc;
    },

    getTags: function() {
        return this._tags;
    },

    getExamples: function() {
        return this._examples || [];
    },

    toJSON: function() {
        return {
            type: this._type,
            tags: this.getTags(),
            title: this.getTitle(),
            description: this.getDescription(),
            location: this.getLocation(),
            steps: this.getSteps().map(function(step) {
                return step.toJSON();
            }),
            examples: this.getExamples().map(function(example) {
                return {
                    title: example.title,
                    columns: example.table.getColumns(),
                    rows: example.table.getRows()
                };
            })
        };
    }

};

// Exports --------------------------------------------------------------------
module.exports = ScenarioNode;

