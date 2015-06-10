// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var fs = require('fs');


// Custom Lexer ---------------------------------------------------------------
function Lexer(source) {
    this.source = source;
    this.col = 0;
    this.line = 0;
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
    '?'
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
    '?'     :               '?'
};

var operatorExp = new RegExp('^(' + OperatorList.map(function(op) {
    return op.replace(/./g, function(m) {
        return '\\' + m;
    });

}).join('|') + ')');

Lexer.prototype = {

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
            this.col = 0;
            this.line++;
            this.source = this.source.substring(m[0].length);
            return this._lex();

        // Whitespace
        } else if ((m = this.source.match(whitespaceExp))) {
            length = m[0].length;
            this.source = this.source.substring(length);
            this.col += length;
            return this._lex();

        // Block Comments
        } else if ((m = this.source.match(blockCommentExp))) {

            length = this.source.indexOf('*/') + 2;
            this.text = this.source.substring(0, length);
            this.source = this.source.substring(length);

            // Update locations
            var lines = this.text.split(/\r|\n/g);
            this.line += lines.length - 1;
            this.col = lines[lines.length - 1].length;

            return 'BLOCK_COMMENT';

        // Line Comments
        } else if ((m = this.source.match(lineCommentExp))) {
            length = m[0].length;
            this.text = this.source.substring(0, length);
            this.source = this.source.substring(length);
            this.col = 0;
            return 'LINE_COMMENT';

        // Macros
        } else if ((m = this.source.match(macroExp))) {
            length = m[0].length;
            this.source = this.source.substring(length);
            this.text = m[0];
            this.col = 0;
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
            return 'NIL';
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

/*
// Test -----------------------------------------------------------------------
// ----------------------------------------------------------------------------
var source = fs.readFileSync('test.m').toString(),
    lexer = new Lexer(source);

var token,
    state = 0,
    implemenationDepth = -1,
    depth = 0;

while((token = lexer.next()) !== 'EOF') {

    // Decrease depth
    if (token === '@END') {
        if (depth === implemenationDepth) {
            state = 0;
        }
        depth--;

    // Increase depth
    } else if (token === '@INTERFACE' || token === '@IMPLEMENTATION') {
        depth++;
    }

    // Search for implemenation
    if (state === 0) {

        if (token === '@IMPLEMENTATION') {
            state = 1;
            implemenationDepth = depth;
        }

    // Search for tests
    } else if (state === 1) {

        // Find Test Methods
        if (token === '-') {

            if (lexer.next() === '(' && lexer.next() === 'VOID' && lexer.next() === ')') {

                token = lexer.next();

                if (token === 'IDENTIFIER' && lexer.text.substring(0, 5) === 'test_') {
                    console.log('method start?', lexer.text);

                    // Find start of block
                    while((token = lexer.next()) !== '{') { continue; }
                    token = lexer.next();

                    // TODO sip sub blocks
                    while(token !== '}') {

                        // Log comments
                        if (token === 'LINE_COMMENT') {
                            console.log('comment', lexer.text);
                            token = lexer.next();

                        // Skip Statements
                        } else {
                            console.log('skipped statement');
                            while((token = lexer.next()) !== ';') { continue; }
                            token = lexer.next();
                        }

                    }

                }

            }

        }

    }

    //console.log(token);
}
*/

