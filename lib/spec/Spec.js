// Spec --------------------------------------------------------------------
function Spec(title, loc) {
    this._title = title;
    this._features = [];
    this._tests = [];
    this._location = loc;
}


// Methods --------------------------------------------------------------------
Spec.prototype = {

    getTitle: function() {
        return this._title;
    },

    addFeature: function(feature) {
        this._features.push(feature);
    },

    getFeatures: function() {
        return this._features;
    },

    hasFeatures: function() {
        return this._features.length !== 0;
    },

    addTest: function(test) {
        this._tests.push(test);
    },

    getTests: function() {
        return this._tests;
    },

    hasTests: function() {
        return this._tests.length !== 0;
    },

    getLocation: function() {
        return this._location;
    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Spec;

