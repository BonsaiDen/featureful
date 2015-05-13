// Scenario -------------------------------------------------------------------
function Scenario(titleNode, tags, loc) {
    this._title = titleNode;
    this._tags = tags;
    this._expectations = [];
    this._location = loc;
}


// Methods --------------------------------------------------------------------
Scenario.prototype = {

    getTitle: function() {
        return this._title ? this._title.value.trim() : null;
    },

    getTags: function() {
        return this._tags;
    },

    addExpectation: function(expectation) {
        this._expectations.push(expectation);
    },

    getExpectations: function() {
        return this._expectations;
    },

    getLocation: function() {
        return this._location;
    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Scenario;

