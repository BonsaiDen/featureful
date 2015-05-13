// Spec --------------------------------------------------------------------
function Spec(title, loc) {
    this._title = title;
    this._features = null;
    this._tests = null;
    this._location = loc;
}


// Methods --------------------------------------------------------------------
Spec.prototype = {

    getTitle: function() {
        return this._title;
    },

    setFeatures: function(path) {
        this._features = path;
    },

    getFeatures: function() {
        return this._features;
    },

    hasFeatures: function() {
        return this._features !== null;
    },

    setTests: function(path) {
        this._tests = path;
    },

    getTests: function() {
        return this._tests;
    },

    hasTests: function() {
        return this._tests !== null;
    },

    getLocation: function() {
        return this._location;
    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Spec;

