// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var Bluebird = require('bluebird'),
    path = require('path'),
    glob = Bluebird.promisify(require('glob'));


// Utilities ------------------------------------------------------------------
// ----------------------------------------------------------------------------
var util = {

    getFilesFromPattern: function(pattern) {

        var exp = util.getPatternExp(pattern);
        return glob(pattern).then(function(paths) {
            return paths.map(function(p) {

                var m = p.match(exp);

                m[2] = m[2] || '';
                m[3] = m[3] || path.basename(m).split('.')[0];

                return {
                    fullpath: p,
                    id: (m[2] ? m[2] + '/' : '' ) + m[3],
                    directory: m[2],
                    name: m[3]
                };

            });
        });

    },

    replaceFilenameFromPatterns: function(filename, from, to) {

        var fromExp = util.getPatternExp(from),
            match = filename.match(fromExp),
            parts = match.slice(-2);

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

            for(var i = 0, l = leftToMatch.length; i < l; i++) {

                var left = leftToMatch[i],
                    c = util.findByClosestTitle(left.getTitle(), others);

                if (c.distance < min && c.value) {

                    var at = left.getTitle(),
                        ot = c.value.getTitle(),
                        range = util.findCommonEnds(at, ot);

                    // Compare the raw title value for matching words
                    var common = util.findCommonWords(left.getRawTitle(), ot);

                    // Always take the lowest levenshtein distance in case it
                    // falls under our maximum distances
                    if (c.distance < maxDistance && common !== 0) {

                        matched.a = left;
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
                            matched.a = left;
                            matched.b = c.value;
                            matched.distance = c.distance;
                            min = c.distance;
                        }

                    }

                }

                // Break out on the first exact match
                if (min === 0) {
                    break;
                }

            }

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

            var distance = levenshtein(title, item.getTitle());
            if (distance < min) {
                value = item;
                min = distance;
            }

        });

        return {
            distance: min,
            value: value
        };

    },

    extractDescription: function(desc) {

        var lines = desc.split(/[\n\r]/g),
            first = 0,
            emptyStart = false,
            last = lines.length,
            emptyEnd = false,
            isDocComment = desc[0] === '*';

        // Strip doc comment star prefixes
        if (isDocComment) {
            lines = lines.map(function(line) {
                return line.substring(line.indexOf('*') + 1);
            });
        }

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

    }

};

// Optimized Levenshtein Distance for Strings with a maximum length of 255 characters
var lMatrix = new Array(256 * 256);

for(var x = 0; x <= 255; x++){

    // Initialize first row to 0..i
    lMatrix[x] = x;

    // Initialize first column to 0..j
    for(var y = 0; y <= 255; y++) {
        lMatrix[x * 256 + y] = y;
    }

}

function levenshtein(a, b) {

    if (a === b) {
        return 0;
    }

    var al = Math.min(a.length, 255),
        bl = Math.min(b.length, 255);

    if (al === 0) {
        return bl;

    } else if (bl === 0) {
        return al;
    }

    for(var i = 1; i <= bl; i++) {

        for(var j = 1; j <= al; j++) {

            if (b.charCodeAt(i - 1) === a.charCodeAt(j - 1)) {
                lMatrix[i * 256 + j] = lMatrix[(i - 1) * 256 + (j - 1)];

            } else {
                lMatrix[i * 256 + j] = Math.min(
                    // substitution
                    lMatrix[(i - 1) * 256 + (j - 1)] + 1,
                    Math.min(
                        // insertion
                        lMatrix[i * 256 + (j - 1)] + 1,
                        lMatrix[(i - 1) * 256 + j] + 1
                    )
                ); // deletion
            }

        }
    }

    return lMatrix[b.length * 256 + a.length];

}


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = util;

