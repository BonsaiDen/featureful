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
                return tokens[++index];
            },

            expect: function(type) {

                var next = this.peek();

                /* istanbul ignore else: Can only happen if the gherkin lexer breaks */
                if (next.is(type)) {
                    return this.next();

                } else {
                    throw new Error(
                        'Parsing error on line '
                        + (tokens[index].line + 1) + ', column ' + tokens[index].column
                        + ': Expected token ' + type + ', but got ' + next.type
                    );
                }

            },

            peek: function() {
                return tokens[index + 1];
            }

        };

    },

    _push: function(type, offset) {
        return function() {

            var args = Array.prototype.slice.call(arguments),
                line = this._lines[args[args.length - 1] - 1] || '',
                column = line.length - line.replace(/^\s+/, '').length;

            args.push(column);
            this._tokens.push(new Token(type, offset, args, this._filename));

        }.bind(this);
    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Lexer;

