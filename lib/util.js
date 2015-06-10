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

    },

    interpolateStep: function(text, headers, map, cols) {

        var exprs = headers.map(function(key) {
            return new RegExp('\\<' + key + '\\>', 'g');
        });

        headers.forEach(function(key, index) {
            text = text.replace(exprs[index], cols[map[key]]);
        });

        return text;

    }

};


// Exports --------------------------------------------------------------------
// ----------------------------------------------------------------------------
module.exports = util;

