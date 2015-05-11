// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var fs = require('fs'),
    recast = require('recast'),
    Test = require('../Test'),
    Scenario = require('../Scenario'),
    Expectation = require('../Expectation'),
    util = require('../util');



// Mocha Framework Parser / Generator -----------------------------------------
function Framework() {
}


// Methods --------------------------------------------------------------------
Framework.prototype = {

    parse: function(filename, commentPrefix) {

        var source = fs.readFileSync(filename).toString(),
            ast = recast.parse(source),
            tests = [];

        // Find describes (Tests)
        util.traverse(ast.program.body, function(node) {
            return node.type === 'ExpressionStatement'
                && node.expression.type === 'CallExpression'
                && node.expression.callee.type === 'Identifier'
                && node.expression.callee.name === 'describe'
                && node.expression.arguments.length === 2;

        }, function(describeNode) {

            // Find description comment
            var descriptionNode = null;
            describeNode.expression.arguments[1].body.body.filter(function(expr) {
                return expr.comments && expr.comments.length;

            }).forEach(function(expr) {
                expr.comments.filter(function(comment) {
                    return comment.type === 'Block';

                }).forEach(function(comment) {
                    if (descriptionNode === null) {
                        descriptionNode = comment;
                    }
                });
            });

            var test = new Test(
                ast,
                describeNode.expression.arguments[0],
                descriptionNode,
                getTags(describeNode, commentPrefix), {
                    filename: filename,
                    line: describeNode.expression.loc.start.line,
                    col: describeNode.expression.loc.start.column
                });

            // Find Its (Scenarios)
            util.traverse(describeNode.expression.arguments[1].body, function(node) {
                return node.type === 'ExpressionStatement'
                    && node.expression.type === 'CallExpression'
                    && node.expression.callee.type === 'Identifier'
                    && node.expression.callee.name === 'it'
                    && node.expression.arguments.length === 2;

            }, function(itNode) {

                // Find tag annotations
                var scenario = new Scenario(
                    itNode.expression.arguments[0],
                    getTags(itNode, commentPrefix), {
                        filename: filename,
                        line: itNode.expression.loc.start.line,
                        col: itNode.expression.loc.start.column
                    });

                var index = 0;
                util.traverse(itNode.expression.arguments[1].body, function(node) {
                    return node.comments && node.comments.length;

                }, function(commentedNode) {

                    var nodeLine = commentedNode.loc.start.line,
                        comments = commentedNode.comments.filter(function(comment) {
                            return comment.type === 'Line'
                                && comment.value.trim().substring(0, commentPrefix.length) === commentPrefix;

                        }).map(function(node) {
                            node.index = index++;
                            return node;
                        });

                    // In case of multiple comments, find the comment
                    // right above the the expression line
                    var lineComment = null;
                    for(var i = 0; i < comments.length; i++) {

                        if (comments[i].loc.start.line >= nodeLine) {
                            break;
                        }

                        lineComment = comments[i];

                    }

                    // Remove line comment
                    comments.splice(comments.indexOf(lineComment), 1);

                    scenario.addExpectation(new Expectation(lineComment, commentedNode, commentPrefix, {
                        filename: filename,
                        line: lineComment.loc.start.line,
                        col: lineComment.loc.start.column

                    }, lineComment.index));

                    // Comments without expectations
                    comments.forEach(function(comment) {
                        scenario.addExpectation(new Expectation(comment, null, commentPrefix, {
                            filename: filename,
                            line: comment.loc.start.line,
                            col: comment.loc.start.column

                        }, comment.index));
                    });

                });

                test.addScenario(scenario);

            });

            tests.push(test);

        });

        return tests;

    }

};

// Helper ---------------------------------------------------------------------
var tagExp = /@[^\s]+/g;

function getTags(node, commentPrefix) {

    // Get text of the last prefixed line comment above the target node
    var comment = (node.comments || []).filter(function(comment) {
        return comment.type === 'Line'
            && comment.value.trim().substring(0, commentPrefix.length) === commentPrefix;

    }).map(function(comment) {
        return comment.value.trim().substring(commentPrefix.length).trim();

    }).slice(-1)[0] || '';

    return (comment.match(tagExp) || []);

}

// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Framework;

