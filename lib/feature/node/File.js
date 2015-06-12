// File Node ------------------------------------------------------------------
function FileNode(filename, features) {
    this._type = 'FILE';
    this._filename =  filename;
    this._features = features;
}

// Methods --------------------------------------------------------------------
FileNode.prototype = {

    getFeatures: function() {
        return this._features;
    },

    toJSON: function() {
        return {
            type: this._type,
            filename: this._filename,
            features: this._features.map(function(feature) {
                return feature.toJSON();
            })
        };
    }

};

// Exports --------------------------------------------------------------------
module.exports = FileNode;

