// Scenario Node --------------------------------------------------------------
function ScenarioNode(tags, title, steps, examples, loc) {
    this.type = 'SCENARIO';
    this.tags = tags;
    this.title = title.trim();
    this.given = steps.given;
    this.when = steps.when;
    this.then = steps.then;
    this.examples = examples;
    this.loc = loc;
}


// Methods --------------------------------------------------------------------
ScenarioNode.prototype = {

    getRawTitle: function() {
        return this.title;
    },

    getTitle: function() {
        return this.title;
    },

    getExpectations: function() {
        var expectations = [];
        expectations.push.apply(expectations, this.given);
        expectations.push.apply(expectations, this.when);
        expectations.push.apply(expectations, this.then);
        return expectations;
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
            location: this.getLocation(),
            given: this.given.map(function(given) {
                return given.toJSON();
            }),
            when: this.when.map(function(when) {
                return when.toJSON();
            }),
            then: this.then.map(function(then) {
                return then.toJSON();
            }),
            examples: this.examples
        };
    }

};

// Exports --------------------------------------------------------------------
module.exports = ScenarioNode;

