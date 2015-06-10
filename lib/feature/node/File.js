// File Node ------------------------------------------------------------------
function FileNode(filename, features) {
    this.type = 'FILE';
    this.filename =  filename;
    this.features = features;
}

// Methods --------------------------------------------------------------------
FileNode.prototype = {

    toJSON: function() {
        return {
            type: this.type,
            filename: this.filename,
            features: this.features.map(function(feature) {
                return feature.toJSON();
            })
        };
    }

};

// Exports --------------------------------------------------------------------
module.exports = FileNode;

