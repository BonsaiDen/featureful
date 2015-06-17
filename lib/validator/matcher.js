// Levenshtein Title Matcher Logic --------------------------------------------
// ----------------------------------------------------------------------------

// Match up items from two lists based on how common their titles are
function matchItemsByTitle(a, b, maxDistance) {


    var leftToMatch = a.slice(),
        others = b.slice(),
        matching = [];

    // While there are items in list A ...
    while(leftToMatch.length) {

        var min = 100000000000,
            matched = {
                a: null,
                b: null,
                distance: 0
            };

        // ... go trough all items in list A ...
        for(var i = 0, l = leftToMatch.length; i < l; i++) {

            // ... and find the closest a matching item in list B based on their title.
            var left = leftToMatch[i],
                c = findByClosestTitle(left.getTitle(), others);

            // If there is a match, and the difference is smaller than the
            // currently best matching item...
            if (c.value && c.distance < min) {

                // ... get both their titles...
                var at = left.getTitle(),
                    ot = c.value.getTitle(),
                    range = findCommonRange(at, ot);

                // ... and compare the raw titles (without prefixes) for matching words.
                var common = findCommonWords(left.getRawTitle(), ot);

                // Then always take the item with the lowest levenshtein
                // distance in case it falls under our maximum distances
                if (c.distance < maxDistance && common !== 0) {
                    matched.a = left;
                    matched.b = c.value;
                    matched.distance = c.distance;
                    matched.range = range;
                    min = c.distance;
                }

            }

            // If we found a item with 0 difference (titles are identically)
            // immediately exit the search
            if (min === 0) {
                break;
            }

        }

        // In case we didn't find any further matches, break out
        if (matched.a === null && matched.b === null) {
            break;
        }

        // Push the matches we found to the results
        matching.push([matched.a, matched.b, matched.distance]);

        // And removed matched items from the lists
        leftToMatch.splice(leftToMatch.indexOf(matched.a), 1);
        others.splice(others.indexOf(matched.b), 1);

    }

    // Push the rest of the non-matching a into into the results (without right-hand side)
    leftToMatch.forEach(function(a) {
        matching.push([a, null, 0]);
    });

    // Push the rest of the non matching b into into the results (without left-hand side)
    others.forEach(function(b) {
        matching.push([null, b, 0]);
    });

    return matching;

}

function findByClosestTitle(title, items) {

    var min = 1000000000,
        ml = 1,
        value = null;

    items.forEach(function(item) {

        var distance = levenshtein(title, item.getTitle());
        if (distance < min) {

            // Titles longer than 65 characters may have bigger distances
            ml = Math.max(1, Math.min(title.length, item.getTitle().length) / 65);

            value = item;
            min = distance;

        }

    });

    return {
        distance: Math.floor(min / ml),
        value: value
    };

}

function findCommonRange(a, b) {

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

}

function findCommonWords(a, b) {

    a = a.toLowerCase().split(/\s/);
    b = b.toLowerCase().split(/\s/);

    var common = 0;
    for(var i = 0, l = a.length; i < l; i++) {
        if (b.indexOf(a[i]) !== -1) {
            common += a[i].length;
        }
    }

    return common;

}


// Optimized Levenshtein Distance for a maximum length of 255 characters ------
// ----------------------------------------------------------------------------

// Pre-computed base matrix (top and left most rows contain index data)
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

    // A and B are equal, skip the expensive comparison
    if (a === b) {
        return 0;
    }

    var al = Math.min(a.length, 255),
        bl = Math.min(b.length, 255);

    // A is a zero length string, return B's length as the distance
    if (al === 0) {
        return bl;

    // B is a zero length string, return A's length as the distance
    } else if (bl === 0) {
        return al;

    } else {
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

}


// Exports --------------------------------------------------------------------
module.exports = function(a, b, both, missingB, missingA, maxDistance) {

    // Match up two lists of Features / Tests / Scenarios / Steps
    matchItemsByTitle(a, b, maxDistance).forEach(function(pair) {

        // Match found
        if (pair[0] && pair[1]) {
            both(pair[0], pair[1], pair[2]);

        // Test implementation is missing
        } else if (!pair[1]) {
            missingB(pair[0]);

        // Feature specification is missing
        } else {
            missingA(pair[1]);
        }

    });

};

