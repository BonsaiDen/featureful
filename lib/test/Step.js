// Scenario -------------------------------------------------------------------
function Step(titleNode, expressionNode, commentPrefix, loc, index) {
    this._title = titleNode;
    this._expression = expressionNode;
    this._commentPrefix = commentPrefix;
    this._location = loc;
    this._index = index;
}


// Methods --------------------------------------------------------------------
Step.prototype = {

    getTitle: function() {
        return this._title ? this._title.value.trim().substring(this._commentPrefix.length).trim() : null;
    },

    hasExpression: function() {
        return this._expression !== null;
    },

    getLocation: function() {
        return this._location;
    },

    getIndex: function() {
        return this._index;
    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Step;

