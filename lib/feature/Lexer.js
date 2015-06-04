// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var gherkin = require('gherkin'),
    Token = require('./Token');

// Lexer Implementation -------------------------------------------------------
// ----------------------------------------------------------------------------
function Lexer(lang) {

    this._filename = '';
    this._lines = [];
    this._tokens = [];

    this._lexer = new (gherkin.Lexer(lang))({
        comment: this._push('COMMENT', 0),
        tag: this._push('TAG', 0),
        feature: this._push('FEATURE', 1),
        background: this._push('BACKGROUND', 1),
        scenario: this._push('SCENARIO', 1),
        scenario_outline: this._push('OUTLINE', 1),
        examples: this._push('EXAMPLES', 1),
        step: this._push('STEP', 0),
        doc_string: this._push('DOC', 1),
        row: this._push('ROW', 0),
        eof: this._push('EOF')
    });

}


// Statics --------------------------------------------------------------------
Lexer.EOF = new Token('EOF', 0, []);


// Methods --------------------------------------------------------------------
Lexer.prototype = {

    tokenize: function(filename, source) {

        this._filename = filename;
        this._lines = source.split(/[\n|\r]/g);

        try {
            this._lexer.scan(source);
            return this._createStream();

        } catch(err) {
            return err;
        }

    },

    _createStream: function() {

        var index = -1,
            tokens = this._tokens.filter(function(token) {
                return !token.is('COMMENT');
            });

        return {

            is: function(type) {
                return this.peek().is(type);
            },

            next: function() {
                return tokens[++index] || Lexer.EOF;
            },

            expect: function(type) {

                var next = this.peek();
                if (next.is(type)) {
                    return this.next();

                } else {
                    throw new Error(
                        'Parsing error on line '
                        + (tokens[index].line + 1) + ', column ' + tokens[index].col
                        + ': Expected token ' + type + ', but got ' + next.type
                    );
                }

            },

            peek: function() {
                return tokens[index + 1] || Lexer.EOF;
            }

        };

    },

    _push: function(type, offset) {

        var that = this;
        return function() {

            var args = Array.prototype.slice.call(arguments),
                line = that._lines[args[args.length - 1] - 1] || '',
                col = line.length - line.replace(/^\s+/, '').length;

            args.push(col);
            that._tokens.push(new Token(type, offset, args, that._filename));

        };
    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Lexer;

