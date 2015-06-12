// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Test = require('../Test'),
    Scenario = require('../Scenario'),
    Step = require('../Step'),
    ast = require('./parser/js');



// Mocha Framework Parser / Generator -----------------------------------------
function Framework() {
}


// Methods --------------------------------------------------------------------
Framework.prototype = {

    parse: function(filename, commentPrefix) {

        // Default prefix for comments
        // TODO make configurable
        commentPrefix = commentPrefix || '###';

        var tree = ast.parse(filename),
            tests = [];

        // Find describes (Tests)
        ast.traverse(tree.program.body, function(node) {
            return node.type === 'ExpressionStatement'
                && node.expression.type === 'CallExpression'
                && node.expression.callee.type === 'Identifier'
                && node.expression.callee.name === 'describe'
                && node.expression.arguments.length === 2;

        }, function(describeNode) {

            // Find description comment from first expression in body
            var descriptionNode = null;

            describeNode.expression.arguments[1].body.body.filter(function(expr) {
                return expr.comments && expr.comments.length;

            }).forEach(function(expr) {
                expr.comments.filter(function(comment) {
                    return comment.type === 'Block';

                }).forEach(function(comment) {
                    /* istanbul ignore else */
                    if (descriptionNode === null) {
                        descriptionNode = comment;
                    }
                });
            });

            // In case of empty callback bodies the comment is on the body node
            if (descriptionNode === null) {
                (describeNode.expression.arguments[1].body.comments || []).filter(function(comment) {
                    return comment.type === 'Block';

                }).forEach(function(comment) {
                    /* istanbul ignore else */
                    if (descriptionNode === null) {
                        descriptionNode = comment;
                    }
                });
            }


            // Create a Test
            var test = new Test(
                tree,
                describeNode.expression.arguments[0],
                descriptionNode,
                getTags(describeNode, commentPrefix), {
                    filename: filename,
                    line: describeNode.expression.loc.start.line,
                    col: describeNode.expression.loc.start.column
                });

            // Find Its (Scenarios)
            ast.traverse(describeNode.expression.arguments[1].body, function(node) {
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


                // Comment index in source
                var index = 0;

                // Check for comments directly on itNode
                // (this is the case when the function body has no statements at all)
                if (itNode.expression.arguments[1].body.body.length === 0) {

                    (itNode.expression.arguments[1].body.comments || []).filter(function(comment) {
                        return comment.type === 'Line'
                            && comment.value.trim().substring(0, commentPrefix.length) === commentPrefix;

                    }).forEach(function(comment) {

                        comment.index = index++;

                        scenario.addStep(new Step(comment, null, commentPrefix, {
                            filename: filename,
                            line: comment.loc.start.line,
                            col: comment.loc.start.column

                        }, comment.index));

                    });

                } else {

                    // Find all comments in the function body
                    ast.traverse(itNode.expression.arguments[1].body, function(node) {
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

                        /* istanbul ignore else: TODO actually test? */
                        if (lineComment) {
                            scenario.addStep(new Step(lineComment, commentedNode, commentPrefix, {
                                filename: filename,
                                line: lineComment.loc.start.line,
                                col: lineComment.loc.start.column

                            }, lineComment.index));
                        }

                        // Comments without steps
                        comments.forEach(function(comment) {
                            scenario.addStep(new Step(comment, null, commentPrefix, {
                                filename: filename,
                                line: comment.loc.start.line,
                                col: comment.loc.start.column

                            }, comment.index));
                        });

                    });

                }

                // Sort steps based on line in file
                scenario.getSteps().sort(function(a, b) {
                    return a.getLocation().line - b.getLocation().line;
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

    return (comment.match(tagExp) || []).map(function(tag) {
        return tag.substring(1);
    });

}

// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = Framework;

