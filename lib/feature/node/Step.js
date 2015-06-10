// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var util = require('../../util');


// Step Node ------------------------------------------------------------------
function StepNode(type, keywords, title, data, and, but, loc, index) {
    this._type = type;
    this.type = type.toUpperCase();
    this.keywords = keywords;
    this.title = dedupeTitlePrefix(title.trim(), this.keywords[this._type]);
    this.data = data;
    this.and = and;
    this.but = but;
    this.loc = loc;
    this.index = index;
}

StepNode.prototype = {

    getRawTitle: function() {
        return this.title;
    },

    getTitle: function() {
        if (this.and) {
            return this.keywords['And' + this._type] + ' ' + this.title;

        } else if (this.but) {
            return this.keywords['But' + this._type] + ' ' + this.title;

        } else {
            return this.keywords[this._type] + ' ' + this.title;
        }
    },

    getLocation: function() {
        return this.loc;
    },

    getIndex: function() {
        return this.index;
    },

    getData: function() {
        return this.data;
    },

    clone: function() {
        return new StepNode(
            this._type,
            this.keywords, this.title, this.data,
            this.and, this.but,
            this.loc, this.index
        );
    },

    replaceTitle: function(headers, map, cols) {
        this.title = util.interpolateStep(this.title, headers, map, cols);
        return this;
    },

    toJSON: function() {
        return {
            type: this.type,
            title: this.getTitle(),
            data: this.getData(),
            location: this.getLocation()
        };
    }

};


// Helpers --------------------------------------------------------------------
function dedupeTitlePrefix(title, keyword) {

    if (title.substring(0, keyword.length + 1).toLowerCase() === (keyword + ' ').toLowerCase()) {
        return title.substring(keyword.length).trim();

    } else {
        return title;
    }

}


// Exports --------------------------------------------------------------------
module.exports = StepNode;

