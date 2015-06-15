// DocString ------------------------------------------------------------------
function DocString(value) {
    this._type = 'DocString';
    this._value = value;
}


// Methods --------------------------------------------------------------------
DocString.prototype = {

    getValue: function() {
        return this._value;
    },

    toJSON: function() {
        return {
            type: this._type,
            value: this.getValue(),
        };
    }

};


// Exports --------------------------------------------------------------------
module.exports = DocString;

