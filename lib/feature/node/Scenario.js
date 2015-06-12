// Scenario Node --------------------------------------------------------------
function ScenarioNode(tags, title, steps, examples, loc) {
    this._type = 'SCENARIO';
    this._tags = tags;
    this._title = title.trim();
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
        return this._examples;
    },

    toJSON: function() {
        return {
            type: this._type,
            tags: this.getTags(),
            title: this.getTitle(),
            location: this.getLocation(),
            given: this._given.map(function(given) {
                return given.toJSON();
            }),
            when: this._when.map(function(when) {
                return when.toJSON();
            }),
            then: this._then.map(function(then) {
                return then.toJSON();
            }),
            examples: this.getExamples()
        };
    }

};

// Exports --------------------------------------------------------------------
module.exports = ScenarioNode;

