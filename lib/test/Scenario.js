// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var util = require('../util');


// Scenario -------------------------------------------------------------------
function Scenario(titleNode, descriptionNode, tags, loc) {
    this._title = titleNode;
    this._description = descriptionNode;
    this._tags = tags;
    this._steps = [];
    this._location = loc;
}


// Methods --------------------------------------------------------------------
Scenario.prototype = {

    getTitle: function() {
        return this._title ? this._title.value.trim() : null;
    },

    getDescription: function() {
        return util.extractDescription(this._description ? this._description.value : '');
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

