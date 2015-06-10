// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var fs = require('fs'),
    Parser = require('./Parser'),
    Lexer = require('./Lexer'),
    Keywords = require('./keywords');

// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = function(filename, generateScenariosFromOutlines, asJson) {

    // Try to match language from file otherwise fallback to english
    var buffer = fs.readFileSync(filename).toString(),
        m = buffer.match(/^\# language\: ([a-z]{2,2})/),
        language = m ? m[1] : (language || 'en');

    var l = new Lexer(language),
        p = new Parser(Keywords[language], generateScenariosFromOutlines),
        tokens = l.tokenize(filename, buffer);

    if (tokens instanceof Error) {
        return tokens;

    } else if (asJson) {
        return p.parse(filename, tokens).toJSON();

    } else {
        return p.parse(filename, tokens);
    }

};

