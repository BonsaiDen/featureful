// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var util = require('../util');


// Test -----------------------------------------------------------------------
function Test(alias, title, description, tags, loc) {
    this._alias = alias;
    this._title = title;
    this._description = description;
    this._tags = tags;
    this._scenarios = [];
    this._location = loc;
}


// Methods --------------------------------------------------------------------
Test.prototype = {

    getAlias: function() {
        return this._alias;
    },

    getTitle: function() {
        return this._title;
    },

    getDescription: function() {
        return util.extractDescription(this._description);
    },

    getTags: function() {
        return this._tags;
    },

    addScenario: function(scenario) {
        this._scenarios.push(scenario);
    },

    getScenarios: function() {
        return this._scenarios;
    },

    getLocation: function() {
        return this._location;
    },

    filter: function(ignores, path, options) {
        this._scenarios = this._scenarios.filter(function(scenario) {
            return ignores(scenario, path, options) !== true;
        });
    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Test;

