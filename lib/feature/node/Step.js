// Step Node ------------------------------------------------------------------
function StepNode(type, keywords, title, data, and, but, loc, index) {
    this._type = type;
    this._keywords = keywords;
    this._title = dedupeTitlePrefix(title.trim(), this._keywords[this._type]);
    this._data = data;
    this._and = and;
    this._but = but;
    this._loc = loc;
    this._index = index;
}


// Methods --------------------------------------------------------------------
StepNode.prototype = {

    getRawTitle: function() {
        return this._title;
    },

    getTitle: function() {
        if (this._and) {
            return this._keywords['And' + this._type] + ' ' + this._title;

        } else if (this._but) {
            return this._keywords['But' + this._type] + ' ' + this._title;

        } else {
            return this._keywords[this._type] + ' ' + this._title;
        }
    },

    getLocation: function() {
        return this._loc;
    },

    getIndex: function() {
        return this._index;
    },

    getArgument: function() {
        return this._data;
    },

    clone: function(title) {
        return new StepNode(
            this._type,
            this._keywords, title, this._data,
            this._and, this._but,
            this._loc, this._index
        );
    },

    toJSON: function() {
        return {
            type: this._type,
            title: this.getTitle(),
            argument: this.getArgument() ? this.getArgument().toJSON() : null,
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

