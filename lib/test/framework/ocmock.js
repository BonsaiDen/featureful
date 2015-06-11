// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Test = require('../Test'),
    Scenario = require('../Scenario'),
    Expectation = require('../Expectation'),
    parser = require('./parser/objc');


// Mocha Framework Parser / Generator -----------------------------------------
function Framework() {
}


// Methods --------------------------------------------------------------------
Framework.prototype = {

    parse: function(filename, commentPrefix, methodPrefix) {

        // Default prefix for comments
        commentPrefix = commentPrefix || '###';

        // Default prefix for methods
        methodPrefix = methodPrefix || 'test_';

        var stream = parser.lex(filename),
            tests = [];

        // Find @something blocks
        parseAtBlocks(stream.clone()).forEach(function(block) {

            // Find methods in @implemenation blocks
            if (block.type === '@IMPLEMENTATION') {

                parseMethods(block.stream, methodPrefix).forEach(function(method) {

                    // Parse method block statements
                    parseStatements(method.block.stream).forEach(function(stmt) {

                    });

                });

            }

        });

        return tests;

    }

};

// Helper ---------------------------------------------------------------------
function parseAtBlocks(stream, callback) {

    var token,
        depth = 0,
        comments = [],
        blocks = [],
        block = null;

    while((token = stream.next()) !== 'EOF') {

        // Collect comments
        if (token === 'LINE_COMMENT' || token === 'BLOCK_COMMENT') {
            comments.push({
                type: token,
                text: stream.text
            });
        }

        // Decrease depth
        if (token === '@END') {

            if (depth === 0) {
                throw new Error(
                    'Parsing error on line '
                    + stream.line + ', column ' + stream.col
                    + ': Unexpected @END, no block is currently open'
                );

            } else {
                blocks.push(block);
            }

            depth--;

        // Increase depth
        } else if (token === '@IMPLEMENTATION' || token === '@INTERFACE') {

            block = {
                type: token,
                depth: depth,
                comments: comments.slice(),
                stream: stream.clone(),
                line: stream.line,
                col: stream.col
            };

            comments.length = 0;

            depth++;

        }

    }

    if (depth !== 0) {
        throw new Error(
            'Parsing error on line '
            + stream.line + ', column ' + stream.col
            + ': Missing @END to close open ' + block.type + ' block from line '
            + block.stream.line + ', column ' + block.stream.col
        );
    }

    return blocks;

}

function parseMethods(stream, methodPrefix) {

    var token,
        methods = [],
        method = null,
        comments = [];

    while((token = stream.next()) !== 'EOF') {

        // Collect comments
        if (token === 'LINE_COMMENT' || token === 'BLOCK_COMMENT') {
            comments.push({
                type: token,
                text: stream.text
            });
        }

        if (token === '-') {

            if (stream.next() === '(') {

                method = {
                    type: stream.next(),
                    comments: comments.slice(),
                    name: null,
                    stream: null,
                    block: null,
                    line: stream.line,
                    col: stream.col
                };

                comments.length = 0;

                if (stream.next() === ')') {

                    token = stream.next();

                    if (token === 'IDENTIFIER' && stream.text.substring(0, methodPrefix.length) === methodPrefix) {
                        method.name = stream.text.substring(methodPrefix.length);
                        method.block = parseBlocks(stream.clone())[0];
                        methods.push(method);

                    } else {
                        parseBlocks(stream);
                    }

                } else {
                    throw new Error(
                        'Parsing error on line '
                        + stream.line + ', column ' + stream.col
                        + ': Invalid method return type declaration'
                    );
                }

            }

        }

    }

    return methods;

}

function parseBlocks(stream) {

    var token = '',
        lastToken = '',
        depth = 0,
        block = null,
        blocks = [],
        blockList = [];

    // Find opening curly, skipping comments
    while((token = stream.next()) !== '{') {

        if (token === 'LINE_COMMENT' || token === 'BLOCK_COMMENT') {
            continue;

        } else {
            throw new Error(
                'Parsing error on line '
                + stream.line + ', column ' + stream.col
                + ': Expected { but got ' + token
            );
        }
    }

    do {

        if (token === '}') {

            if (depth === 0) {
                throw new Error(
                    'Parsing error on line '
                    + stream.line + ', column ' + stream.col
                    + ': Unexpected }, no block is currently open'
                );
            }

            depth--;

            // Cut of last block stream at closing }
            var blockStream = blockList[depth].stream,
                length = blockStream.source.length - stream.source.length;

            blockStream.source = blockStream.source.substring(0, length - 1);

        } else if (token === '{') {

            block = {
                depth: depth,
                stream: stream.clone()
            };

            // Ignore dictionary shortcuts
            if (lastToken !== 'AT') {
                blocks.push(block);
            }

            // Internal list
            blockList.push(block);

            depth++;

        }

        // Exit once all blocks are closed
        if (depth === 0) {
            break;
        }

        lastToken = token;

    } while((token = stream.next()) !== 'EOF');

    // Check if all blocks closed
    if (depth !== 0) {
        throw new Error(
            'Parsing error on line '
            + stream.line + ', column ' + stream.col
            + ': Missing } to close open block from line '
            + block.stream.line + ', column ' + block.stream.col
        );
    }

    return blocks;

}

function parseStatements(stream) {

    var token,
        lines = [],
        statements = [],
        comments = [];

    while((token = stream.next()) !== 'EOF') {

        // Collect comments
        if (token === 'LINE_COMMENT' || token === 'BLOCK_COMMENT') {

            // Break up
            if (lines.length) {

                statements.push({
                    comments: comments.slice(),
                    lines: lines.slice()
                });

                comments.length = 0;
                lines.length = 0;

            }

            comments.push({
                type: token,
                text: stream.text,
                line: stream.line,
                col: stream.col
            });

        // Collect lines
        } else {

            // Fully skip the next statement
            while((token = stream.next()) !== ';') {
                continue;
            }

            lines.push({
                line: stream.line,
                col: stream.col
            });

        }

    }

    if (lines.length || comments.length) {

        statements.push({
            comments: comments.slice(),
            lines: lines.slice()
        });

        comments.length = 0;
        lines.length = 0;

    }

    return statements;

}


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Framework;

