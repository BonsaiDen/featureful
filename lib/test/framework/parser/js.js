// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var fs = require('fs'),
    recast = require('recast');


// JavaScript AST Parser ------------------------------------------------------
var ast = {

    parse: function(filename) {
        return recast.parse(fs.readFileSync(filename).toString());
    },

    traverse: function(node, validator, callback, parent) {
        ast._traverse(node, validator, callback, parent || { type: 'File' });
    },

    _traverse: function(node, validator, callback, parent) {

        if (node instanceof Array) {
            for(var i = 0, l = node.length; i < l; i++) {
                ast._traverse(node[i], validator, callback, parent);
            }

        /* istanbul ignore else */
        } else if (node !== null) {

            // Run the validator function on the node if it exists
            var valid = validator(node, parent);

            /* istanbul ignore else: Skip sub tree and node if requested */
            if (valid !== null) {

                for(var key in node) {

                    // Skip parent references or mia properties (prefixed with $)
                    if (key[0] !== '$'
                        && key !== 'type'
                        && key !== 'range'
                        && key !== 'loc'
                        && key !== 'tokens'
                        && key !== 'comments'
                        && key !== 'kind'
                        && key !== 'operator'
                        && key !== 'arguments'
                        && typeof node[key] === 'object') {

                        ast._traverse(node[key], validator, callback, node);

                    }

                }

                // Invoke callback bottom up
                if (valid) {
                    callback(node, parent);
                }

            }

        }

    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = ast;

