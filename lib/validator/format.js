// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var diff = require('diff');


// Color Descriptions ---------------------------------------------------------
var Path = 'blue',
    Value = 'cyan',
    Key = 'green',
    Message = 'yellow',
    Default = 'red',
    Location = 'grey',
    White = 'white';

var color = (function() {

    /* istanbul ignore else */
    if (!process.stdout.isTTY || process.env.NO_COLOR) {
        return function(string) {
            return string;
        };

    } else {

        require('colors');

        return function(string, value) {

            if (string !== undefined) {
                return string.toString()[value || 'white'];

            } else {
                return '';
            }

        };
    }

})();


// Generic Error Formatting ---------------------------------------------------
module.exports = function(error, context, level) {

    var prefix = '  ',
        message = keywords(color('- ', Default)
                + color(error.message, Message))
                + '\n\n';

    switch(error.type)  {
        case 'missing':
            message += prefix + indent(value(error.actual), 1);
            message += '\n\n';
            message += prefix + location(error.from, 'at');
            message += '\n\n';
            message += prefix + color(error.expected, Message);

            if (error.location) {
                message += '\n\n';
                message += prefix + location(error.location, 'in');
            }

            break;

        case 'title':
            message += prefix + indent(value(error.actual, error.expected), 1);
            message += '\n\n';
            message += prefix + location(error.location, 'at');
            message += '\n\n';
            message += prefix + color('does not match the title from the feature file:', Message);
            message += '\n\n';
            message += prefix + indent(color(value(error.expected)), 1);
            message += '\n\n';
            message += prefix + location(error.from, 'in');
            break;

        case 'description':
            message += prefix + indent(value(description(error.actual), description(error.expected)), 1);
            message += '\n\n';
            message += prefix + location(error.location, 'at');
            message += '\n\n';
            message += prefix + color('does not match the description from the feature file:', Message);
            message += '\n\n';
            message += prefix + indent(color(value(description(error.expected))), 1);
            message += '\n\n';
            message += prefix + location(error.from, 'in');
            break;

        case 'tags':
            message += prefix + indent(value(tags(error.actual), tags(error.expected), false), 1);
            message += '\n\n';
            message += prefix + location(error.location, 'at');
            message += '\n\n';
            message += prefix + color('does not match the tags from the feature file:', Message);
            message += '\n\n';
            message += prefix + indent(color(value(tags(error.expected), null, false)), 1);
            message += '\n\n';
            message += prefix + location(error.from, 'in');
            break;

        case 'order':
            message += prefix + indent(value(context.getTitle()), 1)
                    + color(' is currently implemented as expectation ')
                    + color('#' + error.actual, Value);

            message += '\n\n';
            message += prefix + location(error.location, 'at');
            message += '\n\n';
            message += prefix + color('but should be implemented as ', Message)
                    + color('#' + error.expected, Value)
                    + color(' as defined in the feature file.', Message);

            message += '\n\n';
            message += prefix + location(error.from, 'in');
            break;

        case 'expression':
            message += prefix + indent(value(error.actual, error.expected), 1);
            message += '\n\n';
            message += prefix + location(error.location, 'at');
            break;

    }

    return message.split('\n').map(function(line) {
        return indent(line, level || 0);

    }).join('\n');

};

module.exports.header = function(title, level) {
    return indent(color(title, Default), level || 0);
};


// Helpers --------------------------------------------------------------------
var mPrefix = color('', Message).slice(0, 5);
function keywords(string) {
    return string.replace(/(Test|Scenario|Feature|Expectation)/g, function(val) {
        return color(val, Value) + mPrefix;
    });
}

function value(actual, expected, quote) {

    if (expected)  {
        var parts = diff.diffWordsWithSpace(expected, actual);
        actual = parts.map(function(p) {
            return color(p.value, p.added ? 'green' : p.removed ? 'red' : 'grey');

        }).join('');

    }  else {
        actual = color(actual, White);
    }

    if (quote === false) {
        return actual;

    } else {
        return color('"', White) + actual + color('"', White);
    }

}

function tags(tags) {
    return tags.map(function(tag) {
        return '@' + tag;

    }).join(' ');
}

function description(description) {
    return '\n' + description.split(/\n/).map(function(line) {
        return '  ' + indent(line, 1);

    }).join('\n') + '\n' + indent('  ', 1);
}

function location(loc, prefix) {

    var msg = prefix + ' ' + loc.filename;

    if (loc.line !== -1 && loc.col !== -1) {
        return color(msg + ' (line ' + loc.line + ', column ' + loc.col + ')', Location);

    } else {
        return color(msg, Location);
    }

}

function indent(string, level) {
    return new Array(level + 1).join('    ') + string;
}

