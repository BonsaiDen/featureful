// Lexer Implementation -------------------------------------------------------
// ----------------------------------------------------------------------------
function Token(type, offset, args, filename) {
    this.type = type;
    this.values = args.slice(offset, -2);
    this.column = args[args.length - 1] || 0;
    this.line = args[args.length - 2] || 0;
    this.filename = filename;
}

Token.prototype = {

    is: function(type) {
        return this.type === type;
    },

    getLocation: function() {
        return {
            filename: this.filename,
            line: this.line,
            column: this.column
        };
    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Token;

