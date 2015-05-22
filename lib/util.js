// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Bluebird = require('bluebird'),
    Levenshtein = require('levenshtein'),
    glob = Bluebird.promisify(require('glob')),
    Spec = require('./Spec');

require('colors');


// Utilities ------------------------------------------------------------------
// ----------------------------------------------------------------------------
var util = {

    getFilesFromPattern: function(pattern) {

        var exp = util.getPatternExp(pattern);
        return glob(pattern).then(function(paths) {
            return paths.map(function(path) {
                var m = path.match(exp);
                return {
                    path: path,
                    id: m[2] + '#' + m[3],
                    directory: m[2],
                    name: m[3]
                };
            });
        });

    },

    replaceFilenameFromPatterns: function(filename, from, to) {

        var fromExp = util.getPatternExp(from),
            parts = filename.match(fromExp).slice(2);

        to = to.replace(/\/\*\*/g, function() {
            return parts[0] ? '/' + parts[0] : '';
        });

        to = to.replace(/\*/, function() {
            return parts[parts.length - 1];
        });

        return to;

    },

    getPatternExp: function(pattern) {

        pattern = pattern.replace(/\/\*\*/g, '###');
        pattern = pattern.replace(/\//g, '\\/');
        pattern = pattern.replace(/\./g, '.').replace('*', '([^\\/]*?)') + '$';
        pattern = pattern.replace(/\#\#\#/g, '(\/(.*?))?');

        return new RegExp(pattern);

    },

    getSpecsFromFiles: function(files) {

        // Create mapping
        var map = {
            features: {},
            tests: {},
            all: {}
        };

        files.features.forEach(function(path) {
            map.features[path.id] = path;
            map.all[path.id] = new Spec(path.name, {
                filename: path.path,
                col: -1,
                line: -1
            });
        });

        files.tests.forEach(function(path) {
            map.tests[path.id] = path;
            map.all[path.id] = new Spec(path.name, {
                filename: path.path,
                col: -1,
                line: -1
            });
        });

        var specs = [];
        for(var i in map.all) {
            if (map.all.hasOwnProperty(i)) {

                var spec = map.all[i];
                if (map.features.hasOwnProperty(i)) {
                    spec.setFeatures(map.features[i].path);
                }

                if (map.tests.hasOwnProperty(i)) {
                    spec.setTests(map.tests[i].path);
                }

                specs.push(spec);

            }
        }

        specs.sort(function(a, b) {
            return a.getTitle().localeCompare(b.getTitle());
        });

        return specs;

    },

    matchUp: function(a, b, both, missingB, missingA, maxDistance) {

        util.matchItemsByTitle(a, b, maxDistance).forEach(function(pair) {

            if (pair[0] && pair[1]) {
                both(pair[0], pair[1], pair[2]);

            } else if (!pair[1]) {
                missingB(pair[0]);

            } else {
                missingA(pair[1]);
            }

        });

    },

    matchItemsByTitle: function(a, b, maxDistance) {

        // Default maximum levenshtein distance
        maxDistance = maxDistance || 50;

        var leftToMatch = a.slice(),
            others = b.slice(),
            matching = [];

        // Go through all As and find the one with the lowest matching distance
        while(leftToMatch.length) {

            var min = 100000000000,
                matched = {
                    a: null,
                    b: null,
                    distance: 0
                };

            leftToMatch.forEach(function(a) {

                var c = util.findByClosestTitle(a.getTitle(), others);

                if (c.distance < min && c.value) {

                    var at = a.getTitle(),
                        ot = c.value.getTitle(),
                        range = util.findCommonEnds(at, ot);

                    // Compare the raw title value for matching words
                    var common = util.findCommonWords(a.getRawTitle(), ot);

                    // Always take the lowest levenshtein distance in case it
                    // falls under our maximum distances
                    if (c.distance < maxDistance && common !== 0) {

                        matched.a = a;
                        matched.b = c.value;
                        matched.distance = c.distance;
                        matched.range = range;
                        min = c.distance;

                    // Otherwise do a second compare for matching subtext
                    } else {

                        // First remove common start and end strings
                        at = at.slice(range[0], at.length - range[1]);
                        ot = ot.slice(range[0], ot.length - range[1]);

                        // Now split the words and find common parts
                        common = util.findCommonWords(at, ot);


                        // If the distance divided by the common subtext length
                        // is smaller than our max distance, we still match up
                        if (c.distance / common < maxDistance) {
                            matched.a = a;
                            matched.b = c.value;
                            matched.distance = c.distance;
                            min = c.distance;
                        }

                    }

                }

            });

            // No matches
            if (matched.a === null && matched.b === null) {
                break;
            }

            // Push the matches
            matching.push([matched.a, matched.b, matched.distance]);

            // Removed matched items
            leftToMatch.splice(leftToMatch.indexOf(matched.a), 1);
            others.splice(others.indexOf(matched.b), 1);

        }

        // Push the rest of the non matching a into into the results
        leftToMatch.forEach(function(a) {
            matching.push([a, null, 0]);
        });

        // Push the rest of the non matching b into into the results
        others.forEach(function(b) {
            matching.push([null, b, 0]);
        });

        return matching;

    },

    findCommonEnds: function(a, b) {

        var length = Math.min(a.length, b.length),
            startIsConsequtive = true,
            start = 0,
            endIsConsequtive = true,
            end = 0;

        for(var i = 0; i < length; i++) {

            if (a[i] === b[i] && startIsConsequtive) {
                start++;

            } else {
                startIsConsequtive = false;
            }

            if (a[a.length - i - 1] === b[b.length - i - 1] && endIsConsequtive) {
                end++;

            } else {
                endIsConsequtive = false;
            }

        }

        return [start, end];

    },

    findCommonWords: function(a, b) {

        a = a.toLowerCase().split(/\s/);
        b = b.toLowerCase().split(/\s/);

        var common = 0;
        for(var i = 0, l = a.length; i < l; i++) {
            if (b.indexOf(a[i]) !== -1) {
                common += a[i].length;
            }
        }

        return common;

    },



    findByClosestTitle: function(title, items) {

        var min = 1000000000,
            value = null;

        items.forEach(function(item) {

            var l = new Levenshtein(title, item.getTitle());
            if (l.distance < min) {
                value = item;
                min = l.distance;
            }

        });

        return {
            distance: min,
            value: value
        };

    },

    traverse: function(node, validator, callback, parent, results) {
        results = results || [];
        validator = typeof validator === 'function' ? validator : function() { return true; };
        util.traverseSub(node, validator, callback, parent || { type: 'File' }, results);
        return results;
    },

    traverseSub: function(node, validator, callback, parent, results) {

        if (node instanceof Array) {
            for(var i = 0, l = node.length; i < l; i++) {
                util.traverseSub(node[i], validator, callback, parent, results);
            }

        } else if (node !== null) {

            // Run the validator function on the node if it exists
            var valid = validator(node, parent);

            // Skip sub tree and node if requested
            if (valid !== null) {

                for(var key in node) {

                    // Skip parent references or mia properties (prefixed with $)
                    if (key[0] !== '$'
                        && key !== 'type'
                        && key !== 'range'
                        && key !== 'tokens'
                        && key !== 'comments'
                        && key !== 'leadingComments'
                        && key !== 'trailingComments'
                        && key !== 'extendedRange'
                        && key !== 'kind'
                        && key !== 'operator'
                        && typeof node[key] === 'object') {

                        util.traverseSub(node[key], validator, callback, node, results);
                    }

                }

                // Invoke callback bottom up
                if (valid) {
                    var result = callback(node, parent);
                    if (result) {
                        results.push(result);
                    }
                }

            }

        }

    },

    description: function(desc) {

        var lines = desc.split(/[\n\r]/g),
            first = 0,
            emptyStart = false,
            last = lines.length,
            emptyEnd = false;

        // Ignore leading and trailing empty lines
        var minLeading = 1000;
        for(var i = 0, l = lines.length; i < l; i++) {

            if (lines[i].trim() === '' && emptyStart === false) {
                first = i + 1;

            } else {
                emptyStart = true;
            }

            if (lines[lines.length - i -1 ].trim() === '' && emptyEnd === false) {
                last = i - 1;

            } else {
                emptyEnd = true;
            }

        }

        lines = lines.slice(first, last);

        for(i = 0, l = lines.length; i < l; i++) {
            var leading = lines[i].length - lines[i].replace(/^\s+/, '').length;
            minLeading = Math.min(minLeading, leading);
        }

        for(i = 0, l = lines.length; i < l; i++) {
            lines[i] = lines[i].substring(minLeading);
        }

        return lines.join('\n');

    },


    // Colors -----------------------------------------------------------------
    _noColor: !process.stdout.isTTY || process.env.JUNIT_REPORT_PATH,

    color: function(string, value) {

        if (util._noColor) {
            return string;

        } else if (string !== undefined) {
            return string.toString()[value || 'white'];

        } else {
            return '';
        }

    }

};

// Color Codes
util.color.Path = 'blue';
util.color.Value = 'cyan';
util.color.Key = 'green';
util.color.Message = 'yellow';
util.color.Error = 'red';
util.color.Location = 'grey';
util.color.White = 'white';


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = util;

