// Spec --------------------------------------------------------------------
function Spec(title, loc) {
    this._alias = null;
    this._title = title;
    this._features = [];
    this._tests = [];
    this._location = loc;
}


// Methods --------------------------------------------------------------------
Spec.prototype = {

    getAlias: function() {
        return this._alias;
    },

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
        this._alias = test.getAlias();
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
    },

    filterFeatures: function(ignores, path, options) {

        // Filter each Feature
        this._features.map(function(feature) {
            feature.filter(ignores, path, options);
        });

    },

    filterTests: function(ignores, path, options) {

        // Filter each Test
        this._tests.map(function(test) {
            test.filter(ignores, path, options);
        });

    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Spec;

