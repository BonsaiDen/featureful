// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var util = require('../util');


// Scenario -------------------------------------------------------------------
function Scenario(alias, title, description, tags, loc) {
    this._alias = alias;
    this._title = title;
    this._description = description;
    this._tags = tags;
    this._steps = [];
    this._location = loc;
}


// Methods --------------------------------------------------------------------
Scenario.prototype = {

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

    addStep: function(step) {
        this._steps.push(step);
    },

    getSteps: function() {
        return this._steps;
    },

    getLocation: function() {
        return this._location;
    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Scenario;

