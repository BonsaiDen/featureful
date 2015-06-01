// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var fs = require('fs'),
    Lexer = require('./Lexer'),
    Keywords = require('./keywords'),
    util = require('../util');


// Parser Implementation ------------------------------------------------------
// ----------------------------------------------------------------------------
function Parser(keywords, scenarioTemplates) {
    this._keywords = keywords;
    this._scenarioTemplates = scenarioTemplates;
}

Parser.prototype = {

    parse: function(filename, stream) {

        var features = [],
            tags = [];

        while(!stream.peek().is('EOF')) {

            var token = stream.peek();
            switch(token.type) {
                case 'TAG':
                    tags.push(stream.expect('TAG').values[0]);
                    break;

                case 'FEATURE':
                    features.push(this.parseFeature(stream, tags));
                    tags = [];
                    break;

                default:
                    throw new Error('Unexpected token ' + token.type);
            }


        }

        return new FileNode(filename, features);

    },

    parseFeature: function(stream, featureTags) {

        var title = stream.expect('FEATURE'),
            tags = [],
            scenarios = [],
            background = [];

        while(stream.is('SCENARIO') || stream.is('OUTLINE') || stream.is('TAG') || stream.is('BACKGROUND')) {
            if (stream.is('TAG')) {
                tags.push(stream.expect('TAG').values[0]);

            } else {
                scenarios.push.apply(scenarios,
                    this.parseScenarioOrBackground(stream, tags, background)
                );
                tags = [];
            }
        }

        return new FeatureNode(
            featureTags, title.values[0], title.values[1],
            scenarios, background[0] || null, title.getLocation()
        );

    },

    parseScenarioOrBackground: function(stream, tags, background) {

        var description,
            scenarios = [],
            steps = null;

        if (stream.is('BACKGROUND')) {
            description = stream.expect('BACKGROUND').values[0],
            steps = this.parseScenarioSteps(stream);

            if (background.length !== 0) {
                throw new Error('Feature can have only one background for its scenarios');

            } else {
                // TODO error when steps with when / then are present
                background.push(new BackgroundNode(steps.given));
            }

        } else if (stream.is('SCENARIO')) {
            description = stream.expect('SCENARIO');
            steps = this.parseScenarioSteps(stream);
            scenarios.push(new ScenarioNode(
                tags, description.values[0], steps,
                null, description.getLocation()
            ));

        } else {

            description = stream.expect('OUTLINE');
            steps = this.parseScenarioSteps(stream);

            stream.expect('EXAMPLES');

            var map = {},
                header = null,
                rows = [];

            while(stream.is('ROW')) {

                var data = stream.expect('ROW').values[0];
                if (header === null) {

                    header = data,

                    data.forEach(function(key, index) {
                        map[key] = index;
                    });

                } else {
                    rows.push(data);
                }

            }

            if (rows.length === 0) {
                throw new Error('Expected at least one row of example data for scenario outline.');

            } else if (this._scenarioTemplates) {
                for(var i = 0, l = rows.length; i < l; i++) {
                    scenarios.push(this.scenarioFromTemplate(
                        i + 1,
                        tags, description.values[0], steps, header, map, rows[i],
                        description.getLocation()
                    ));
                }

            } else {

                scenarios.push(new ScenarioNode(
                    tags, description.values[0], steps,
                    rows.map(function(row) {

                        var example = {};
                        for(var i in map) {
                            if (map.hasOwnProperty(i)) {
                                example[i] = row[map[i]];
                            }
                        }

                        return example;

                    }),
                    description.getLocation()
                ));

            }

        }

        return scenarios;

    },

    parseScenarioSteps: function(stream) {

        var lastKeyword = null,
            keywords = this._keywords,
            index = 0,
            given = [],
            when = [],
            then = [],
            conditions = [];

        function append(keyword) {

            if (keyword !== keywords.And && keyword !== keywords.But
                && keyword !== lastKeyword && conditions.length) {

                switch(lastKeyword) {
                    case keywords.Given:
                        given = conditions;
                        break;

                    case keywords.When:
                        when = conditions;
                        break;

                    case keywords.Then:
                        then = conditions;
                        break;
                }

                conditions = [];

            }

        }

        while(stream.is('STEP')) {

            var step = stream.expect('STEP'),
                keyword = step.values[0].trim(),
                action = step.values[1],
                data = null;

            append(keyword);

            if (stream.is('DOC')) {
                data = stream.expect('DOC').values[0];

            } else if (stream.is('ROW')) {
                data = this.parseStepTable(stream);
            }

            switch(keyword) {
                case keywords.Given:
                    conditions.push(new GivenNode(this._keywords, action, data, false, false, step.getLocation(), index));
                    lastKeyword = keyword;
                    break;

                case keywords.When:
                    conditions.push(new WhenNode(this._keywords, action, data, false, false, step.getLocation(), index));
                    lastKeyword = keyword;
                    break;

                case keywords.Then:
                    conditions.push(new ThenNode(this._keywords, action, data, false, false, step.getLocation(), index));
                    lastKeyword = keyword;
                    break;

                case keywords.And:
                    if (conditions.length === 0) {
                        throw new Error('Expect Given/Then/When before AND in step');
                    }

                    switch(lastKeyword) {
                        case keywords.Given:
                            conditions.push(new GivenNode(this._keywords, action, data, true, false, step.getLocation(), index));
                            break;

                        case keywords.When:
                            conditions.push(new WhenNode(this._keywords, action, data, true, false, step.getLocation(), index));
                            break;

                        case keywords.Then:
                            conditions.push(new ThenNode(this._keywords, action, data, true, false, step.getLocation(), index));
                            break;

                    }
                    break;

                case keywords.But:
                    if (conditions.length === 0) {
                        throw new Error('Expect Given/Then/When before BUT in step');
                    }

                    switch(lastKeyword) {
                        case keywords.Given:
                            conditions.push(new GivenNode(this._keywords, action, data, false, true, step.getLocation(), index));
                            break;

                        case keywords.When:
                            conditions.push(new WhenNode(this._keywords, action, data, false, true, step.getLocation(), index));
                            break;

                        case keywords.Then:
                            conditions.push(new ThenNode(this._keywords, action, data, false, true, step.getLocation(), index));
                            break;

                    }
                    break;

                default:
                    throw new Error('Unexpected keyword in scenario step: ' + keyword);

            }

            index++;

        }

        append(null);

        return {
            given: given,
            when: when,
            then: then
        };

    },

    parseStepTable: function(stream) {

        var table = {},
            header = null,
            rows = 0;

        while(stream.is('ROW')) {

            var data = stream.expect('ROW').values[0];
            if (header === null) {

                header = data,

                data.forEach(function(key) {
                    table[key] = [];
                });

            } else {
                rows++;
                data.forEach(function(value, index) {
                    table[header[index]].push(value);
                });
            }

        }

        if (rows === 0) {
            throw new Error('Expected at least one row of example data for scenario outline.');

        } else {
            return table;
        }

    },

    scenarioFromTemplate: function(index, tags, description, templateSteps, headers, map, cols, location) {

        var that = this,
            steps = {};

        for(var i in templateSteps) {
            if (templateSteps.hasOwnProperty(i)) {
                steps[i] = templateSteps[i].map(function(node) {
                    return that.replaceNode(node, headers, map, cols);
                });
            }
        }

        return new ScenarioNode(
            tags, replaceText(description, headers, map, cols) + ' (' + cols.join(', ') + ')',
            steps, null, location
        );

    },

    replaceNode: function(node, headers, map, cols) {

        if (node instanceof NotNode) {
            return new NotNode(this.replaceNode(node.node));

        } else {
            return node.clone().replaceTitle(headers, map, cols);
        }

    }

};


// Nodes ----------------------------------------------------------------------
function FileNode(filename, features) {
    this.type = 'FILE';
    this.filename =  filename;
    this.features = features;
}

FileNode.prototype = {

    toJSON: function() {
        return {
            type: this.type,
            filename: this.filename,
            features: this.features.map(function(feature) {
                return feature.toJSON();
            })
        };
    }

};

function FeatureNode(tags, title, description, scenarios, background, loc) {
    this.type = 'FEATURE';
    this.tags = tags;
    this.title = title;
    this.description = description;
    this.scenarios = scenarios;
    this.background = background;
    this.loc = loc;
}

FeatureNode.prototype = {

    getRawTitle: function() {
        return this.title;
    },

    getTitle: function() {
        return this.title;
    },

    getDescription: function() {
        return util.description(this.description);
    },

    getScenarios: function() {
        return this.scenarios;
    },

    getLocation: function() {
        return this.loc;
    },

    getTags: function() {
        return this.tags;
    },

    toJSON: function() {
        return {
            type: this.type,
            tags: this.tags,
            title: this.title,
            description: this.getDescription(),
            location: this.loc,
            scenarios: this.scenarios.map(function(scenario) {
                return scenario.toJSON();
            })
        };
    }

};

function BackgroundNode(given) {
    this.type = 'BACKGROUND';
    this.given = given;
}

function ScenarioNode(tags, title, steps, examples, loc) {
    this.type = 'SCENARIO';
    this.tags = tags;
    this.title = title.trim();
    this.given = steps.given;
    this.when = steps.when;
    this.then = steps.then;
    this.examples = examples;
    this.loc = loc;
}

ScenarioNode.prototype = {

    getRawTitle: function() {
        return this.title;
    },

    getTitle: function() {
        return this.title;
    },

    getExpectations: function() {
        var expectations = [];
        expectations.push.apply(expectations, this.given);
        expectations.push.apply(expectations, this.when);
        expectations.push.apply(expectations, this.then);
        return expectations;
    },

    getLocation: function() {
        return this.loc;
    },

    getTags: function() {
        return this.tags;
    },

    toJSON: function() {
        return {
            type: this.type,
            tags: this.tags,
            title: this.title,
            location: this.loc,
            given: this.given.map(function(given) {
                return given.toJSON();
            }),
            when: this.when.map(function(when) {
                return when.toJSON();
            }),
            then: this.then.map(function(then) {
                return then.toJSON();
            }),
            examples: this.examples
        };
    }

};

function GivenNode(keywords, title, data, and, but, loc, index) {

    this.type = 'GIVEN';
    this.keywords = keywords;
    this.title = dedupeTitle(title.trim(), this.keywords.Given);
    this.data = data;
    this.and = and;
    this.but = but;
    this.loc = loc;
    this.index = index;

}

GivenNode.prototype = {

    getRawTitle: function() {
        return this.title;
    },

    getTitle: function() {
        if (this.and) {
            return this.keywords.AndGiven + ' ' + this.title;

        } else {
            return this.keywords.Given + ' ' + this.title;
        }
    },

    getLocation: function() {
        return this.loc;
    },

    getIndex: function() {
        return this.index;
    },

    clone: function() {
        return new GivenNode(this.keywords, this.title, this.data, this.and, this.but, this.loc, this.index);
    },

    replaceTitle: function(headers, map, cols) {
        this.title = replaceText(this.title, headers, map, cols);
        return this;
    },

    toJSON: function() {
        return {
            type: this.type,
            tags: this.tags,
            title: this.getTitle(),
            location: this.loc
        };
    }

};

function WhenNode(keywords, title, data, and, but, loc, index) {
    this.type = 'WHEN';
    this.keywords = keywords;
    this.title = dedupeTitle(title.trim(), this.keywords.When);
    this.data = data;
    this.and = and;
    this.but = but;
    this.loc = loc;
    this.index = index;
}

WhenNode.prototype = {

    getRawTitle: function() {
        return this.title;
    },

    getTitle: function() {
        if (this.and) {
            return this.keywords.AndWhen + ' ' + this.title;

        } else {
            return this.keywords.When + ' ' + this.title;
        }
    },

    getLocation: function() {
        return this.loc;
    },

    getIndex: function() {
        return this.index;
    },

    clone: function() {
        return new WhenNode(this.keywords, this.title, this.data, this.and, this.but, this.loc, this.index);
    },

    replaceTitle: function(headers, map, cols) {
        this.title = replaceText(this.title, headers, map, cols);
        return this;
    },

    toJSON: function() {
        return {
            type: this.type,
            tags: this.tags,
            title: this.getTitle(),
            location: this.loc
        };
    }

};

function ThenNode(keywords, title, data, and, but, loc, index) {
    this.type = 'THEN';
    this.keywords = keywords;
    this.title = dedupeTitle(title.trim(), this.keywords.Then);
    this.data = data;
    this.and = and;
    this.but = but;
    this.loc = loc;
    this.index = index;
}

ThenNode.prototype = {

    getRawTitle: function() {
        return this.title;
    },

    getTitle: function() {
        if (this.and) {
            return this.keywords.AndThen + ' ' + this.title;

        } else {
            return this.keywords.Then + ' ' + this.title;
        }
    },

    getLocation: function() {
        return this.loc;
    },

    getIndex: function() {
        return this.index;
    },

    clone: function() {
        return new ThenNode(this.keywords, this.title, this.data, this.and, this.but, this.loc, this.index);
    },

    replaceTitle: function(headers, map, cols) {
        this.title = replaceText(this.title, headers, map, cols);
        return this;
    },

    toJSON: function() {
        return {
            type: this.type,
            tags: this.tags,
            title: this.getTitle(),
            location: this.loc
        };
    }

};

function NotNode(node) {
    this.type = 'NOT';
    this.node = node;
}


// Helpers --------------------------------------------------------------------
function replaceText(text, headers, map, cols) {

    var exprs = headers.map(function(key) {
        return new RegExp('\\<' + key + '\\>', 'g');
    });

    headers.forEach(function(key, index) {
        text = text.replace(exprs[index], cols[map[key]]);
    });

    return text;

}

function dedupeTitle(title, keyword) {

    if (title.substring(0, keyword.length + 1).toLowerCase() === (keyword + ' ').toLowerCase()) {
        return title.substring(keyword.length).trim();

    } else {
        return title;
    }

}


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

