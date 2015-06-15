// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var fs = require('fs');


// Custom Lexer ---------------------------------------------------------------
function Lexer(source, column, line) {
    this.source = source;
    this.column = column || 0;
    this.line = line || 1;
}

var newlineExp = /^[\n\r]/,
    whitespaceExp = /^\s+/,
    blockCommentExp = /^\/\*/,
    lineCommentExp = /^\/\/[^\r\n]*/,
    macroExp = /^\#[^\r\n]*/,
    reservedWordExp = /^(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|@interface|@defs|id|in|out|inout|bycopy|byref|oneway|@class|@end|@private|@public|@protected|@property|@implementation)[^a-z_0-9]/,
    nameExp = /^[a-z_]+[a-z_0-9]*/i,
    stringExp = /^(@?"(\\.|[^\\"])*")/,
    constExp = /^(@?'(\\.|[^\\'])+'|0[xX][0-9]+(u|U|l|L)?|0[0-9]+(u|U|l|L)?|[0-9]+(u|U|l|L)?)/;


//{D}+{E}{FS}?            { return(CONSTANT); }
//{D}*"."{D}+({E})?{FS}?  { return(CONSTANT); }
//{D}+"."{D}*({E})?{FS}?  { return(CONSTANT); }

var OperatorList = [
    '...',
    '>>=',
    '<<=',
    '+=',
    '-=',
    '*=',
    '/=',
    '%=',
    '&=',
    '^=',
    '|=',
    '>>',
    '<<',
    '++',
    '--',
    '->',
    '&&',
    '||',
    '<=',
    '>=',
    '==',
    '!=',
    ';',
    '{',
    '<%',
    '}',
    '%>',
    ',',
    ':',
    '=',
    '(',
    ')',
    '[',
    '<:',
    ']',
    ':>',
    '.',
    '&',
    '!',
    '~',
    '-',
    '+',
    '*',
    '/',
    '%',
    '<',
    '>',
    '^',
    '|',
    '?',
    '@'
];

var OperatorMap = {
    '...'   :               'ELLIPSIS',
    '>>='   :               'RIGHT_ASSIGN',
    '<<='   :               'LEFT_ASSIGN',
    '+='    :               'ADD_ASSIGN',
    '-='    :               'SUB_ASSIGN',
    '*='    :               'MUL_ASSIGN',
    '/='    :               'DIV_ASSIGN',
    '%='    :               'MOD_ASSIGN',
    '&='    :               'AND_ASSIGN',
    '^='    :               'XOR_ASSIGN',
    '|='    :               'OR_ASSIGN',
    '>>'    :               'RIGHT_OP',
    '<<'    :               'LEFT_OP',
    '++'    :               'INC_OP',
    '--'    :               'DEC_OP',
    '->'    :               'PTR_OP',
    '&&'    :               'AND_OP',
    '||'    :               'OR_OP',
    '<='    :               'LE_OP',
    '>='    :               'GE_OP',
    '=='    :               'EQ_OP',
    '!='    :               'NE_OP',
    ';'     :               ';',
    '{'     :               '{',
    '<%'    :               '{',
    '}'     :               '}',
    '%>'    :               '}',
    ','     :               ',',
    ':'     :               ':',
    '='     :               '=',
    '('     :               '(',
    ')'     :               ')',
    '['     :               '[',
    '<:'    :               '[',
    ']'     :               ']',
    ':>'    :               ']',
    '.'     :               '.',
    '&'     :               '&',
    '!'     :               '!',
    '~'     :               '~',
    '-'     :               '-',
    '+'     :               '+',
    '*'     :               '*',
    '/'     :               '/',
    '%'     :               '%',
    '<'     :               '<',
    '>'     :               '>',
    '^'     :               '^',
    '|'     :               '|',
    '?'     :               '?',
    '@'     :               'AT'
};

var operatorExp = new RegExp('^(' + OperatorList.map(function(op) {
    return op.replace(/./g, function(m) {
        return '\\' + m;
    });

}).join('|') + ')');

Lexer.prototype = {

    clone: function() {
        return new Lexer(this.source, this.column, this.line);
    },

    next: function() {
        return this._lex();
    },

    _lex: function() {

        var m = null,
            length = 0;

        // Return the EOF token at the end of the source
        if (this.source.length === 0) {
            return 'EOF';
        }

        // Newlines
        if ((m = this.source.match(newlineExp))) {
            this.column = 0;
            this.line++;
            this.source = this.source.substring(m[0].length);
            return this._lex();

        // Whitespace
        } else if ((m = this.source.match(whitespaceExp))) {
            length = m[0].length;
            this.source = this.source.substring(length);
            this.column += length;
            return this._lex();

        // Block Comments
        } else if ((m = this.source.match(blockCommentExp))) {

            length = this.source.indexOf('*/') + 2;
            this.text = this.source.substring(2, length - 2);
            this.source = this.source.substring(length);

            // Update locations
            var lines = this.text.split(/\r|\n/g);
            this.line += lines.length - 1;
            this.column = lines[lines.length - 1].length;

            return 'BLOCK_COMMENT';

        // Line Comments
        } else if ((m = this.source.match(lineCommentExp))) {
            length = m[0].length;
            this.text = this.source.substring(2, length);
            this.source = this.source.substring(length);
            this.column = 0;
            return 'LINE_COMMENT';

        // Macros
        } else if ((m = this.source.match(macroExp))) {
            length = m[0].length;
            this.source = this.source.substring(length);
            this.text = m[0];
            this.column = 0;
            return this._lex();

        // Reserved words
        } else if ((m = this.source.match(reservedWordExp))) {
            length = m[1].length;
            this.source = this.source.substring(length);
            this.text = m[1];
            return this.text.toUpperCase();

        // Names
        } else if ((m = this.source.match(nameExp))) {
            length = m[0].length;
            this.source = this.source.substring(length);
            this.text = m[0];
            return 'IDENTIFIER';

        // Strings
        } else if ((m = this.source.match(stringExp))) {
            length = m[0].length;
            this.source = this.source.substring(length);
            this.text = m[0];
            return 'STRING_LITERAL';

        // Constants
        } else if ((m = this.source.match(constExp))) {
            length = m[0].length;
            this.source = this.source.substring(length);
            this.text = m[0];
            return 'CONSTANT';

        // Operators and Punctuation
        } else if ((m = this.source.match(operatorExp))) {
            length = m[1].length;
            this.source = this.source.substring(length);
            this.text = m[1];
            return OperatorMap[this.text];

        } else {
            throw new Error(
                'Parsing error on line '
                + this.line + ', column ' + this.column
                + ': Unexpected ' + this.source.substring(0, 10)
            );
        }

    }

};


// Objective-C Lexer ----------------------------------------------------------
var lexer = {

    lex: function(filename) {
        return new Lexer(fs.readFileSync(filename).toString());
    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = lexer;

