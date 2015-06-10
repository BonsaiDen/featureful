// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var FileNode = require('./node/File'),
    FeatureNode = require('./node/Feature'),
    BackgroundNode = require('./node/Background'),
    ScenarioNode = require('./node/Scenario'),
    StepNode = require('./node/Step'),
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
                    tags.push(stream.expect('TAG').values[0].substring(1));
                    break;

                case 'FEATURE':
                    features.push(this.parseFeature(stream, tags));
                    tags = [];
                    break;

                default:
                    throw new Error(
                        'Parsing error on line '
                        + token.line + ', column ' + token.col
                        + ': Unexpected token \'' + token.type + '\'.'
                    );
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
                tags.push(stream.expect('TAG').values[0].substring(1));

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
            example = null,
            scenarios = [],
            steps = null;

        if (stream.is('BACKGROUND')) {

            description = stream.expect('BACKGROUND');

            if (background.length !== 0) {

                throw new Error(
                    'Parsing error on line '
                    + description.line + ', column ' + description.col
                    + ': Only one background is allowed per feature.'
                );

            } else {

                steps = this.parseScenarioSteps(stream);

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

            example = stream.expect('EXAMPLES');

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
                throw new Error(
                    'Parsing error on line '
                    + example.line + ', column ' + example.col
                    + ': Expected at least one row of example data for scenario outline.'
                );

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
                            /* istanbul ignore else */
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

        function buildConditions(keyword) {

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

        function appendCondition(step, and, but) {

            if (conditions.length === 0) {
                throw new Error(
                    'Parsing error on line '
                    + step.line + ', column ' + step.col
                    + ': Expected a Given / Then / When before "'
                    + (and ? 'And' : 'But')
                    + '" in scenario steps.'
                );
            }

            switch(lastKeyword) {
                case keywords.Given:
                    conditions.push(new StepNode(
                        'Given', keywords, action, data,
                        and, but, step.getLocation(), index
                    ));
                    break;

                case keywords.When:
                    conditions.push(new StepNode(
                        'When', keywords, action, data,
                        and, but, step.getLocation(), index
                    ));
                    break;

                case keywords.Then:
                    conditions.push(new StepNode(
                        'Then', keywords, action, data,
                        and, but, step.getLocation(), index
                    ));
                    break;

            }

        }

        while(stream.is('STEP')) {

            var step = stream.expect('STEP'),
                keyword = step.values[0].trim(),
                action = step.values[1],
                data = null;

            buildConditions(keyword);

            // Step Doc String
            if (stream.is('DOC')) {
                data = stream.expect('DOC').values[0];

            // Step Data Tables
            } else if (stream.is('ROW')) {
                data = this.parseStepTable(step, stream);
            }

            switch(keyword) {

                // Initial steps
                case keywords.Given:
                    conditions.push(new StepNode(
                        'Given', keywords, action, data,
                        false, false, step.getLocation(), index
                    ));
                    lastKeyword = keyword;
                    break;

                case keywords.When:
                    conditions.push(new StepNode(
                        'When', keywords, action, data,
                        false, false, step.getLocation(), index
                    ));
                    lastKeyword = keyword;
                    break;

                case keywords.Then:
                    conditions.push(new StepNode(
                        'Then', keywords, action, data,
                        false, false, step.getLocation(), index
                    ));
                    lastKeyword = keyword;
                    break;

                // Follow ups
                case keywords.And:
                    appendCondition(step, true, false);
                    break;

                case keywords.But:
                    appendCondition(step, false, true);
                    break;

            }

            index++;

        }

        buildConditions(null);

        return {
            given: given,
            when: when,
            then: then
        };

    },

    parseStepTable: function(step, stream) {

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
            throw new Error(
                'Parsing error on line '
                + step.line + ', column ' + step.col
                + ': Expected at least one row of table data for step.'
            );

        } else {
            return table;
        }

    },

    scenarioFromTemplate: function(index, tags, description, templateSteps, headers, map, cols, location) {

        var steps = {};

        for(var i in templateSteps) {
            /* istanbul ignore else */
            if (templateSteps.hasOwnProperty(i)) {
                steps[i] = templateSteps[i].map(function(node) {
                    return node.clone().replaceTitle(headers, map, cols);
                });
            }
        }

        return new ScenarioNode(
            tags, util.interpolateStep(description, headers, map, cols) + ' (' + cols.join(', ') + ')',
            steps, null, location
        );

    }

};

// Exports --------------------------------------------------------------------
module.exports = Parser;

