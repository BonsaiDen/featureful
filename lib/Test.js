// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var util = require('./util');


// Test -----------------------------------------------------------------------
function Test(rootNode, titleNode, descriptionNode, tags, loc) {
    this._root = rootNode;
    this._title = titleNode;
    this._description = descriptionNode;
    this._tags = tags;
    this._scenarios = [];
    this._location = loc;
}


// Methods --------------------------------------------------------------------
Test.prototype = {

    getTitle: function() {
        return this._title ? this._title.value : null;
    },

    getDescription: function() {
        return util.description(this._description ? this._description.value : '');
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
    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Test;

