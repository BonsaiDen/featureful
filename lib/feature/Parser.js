// Dependencies ---------------------------------------------------------------
// ----------------------------------------------------------------------------
var FileNode = require('./node/File'),
    FeatureNode = require('./node/Feature'),
    BackgroundNode = require('./node/Background'),
    ScenarioNode = require('./node/Scenario'),
    StepNode = require('./node/Step'),
    DocString = require('./argument/DocString'),
    DataTable = require('./argument/DataTable');


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
                        + token.line + ', column ' + token.column
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

        var node,
            example = null,
            scenarios = [],
            steps = null;

        // Background
        if (stream.is('BACKGROUND')) {

            node = stream.expect('BACKGROUND');

            if (background.length !== 0) {
                throw new Error(
                    'Parsing error on line '
                    + node.line + ', column ' + node.column
                    + ': Only one background is allowed per feature.'
                );

            } else {

                steps = this.parseScenarioSteps(stream);

                if (steps.when.length) {
                    throw new Error(
                        'Parsing error on line '
                        + node.line + ', column ' + node.column
                        + ': "When" step is not allowed in scenario background definition.'
                    );

                } else if (steps.then.length) {
                    throw new Error(
                        'Parsing error on line '
                        + node.line + ', column ' + node.column
                        + ': "Then" step is not allowed in scenario background definition.'
                    );

                } else {
                    background.push(new BackgroundNode(steps.given));

                }

            }

        // Scenario
        } else if (stream.is('SCENARIO')) {
            node = stream.expect('SCENARIO');
            scenarios.push(new ScenarioNode(
                tags,
                node.values[0],
                node.values[1],
                this.parseScenarioSteps(stream),
                null,
                node.getLocation()
            ));

        // Scenario Outlines
        } else {

            node = stream.expect('OUTLINE');
            steps = this.parseScenarioSteps(stream);

            // Generate one Scenario from each Example / Row
            if (this._scenarioTemplates) {

                while(stream.is('EXAMPLES')) {

                    example = this.parseScenarioExamples(stream);

                    example.table.getRows().forEach(function(row, index) {

                        scenarios.push(this.scenarioFromTemplate(
                            index, example.table,
                            node.values[0] + (example.title ? ' ( ' + example.title + ' )' : ''),
                            node.values[1],
                            tags,
                            steps,
                            node.getLocation()
                        ));

                    }, this);

                }

            // Generate one Scenario with Example Data
            } else {

                var examples = [];
                while(stream.is('EXAMPLES')) {
                    example = this.parseScenarioExamples(stream);
                    examples.push(example);
                }

                scenarios.push(new ScenarioNode(
                    tags,
                    node.values[0],
                    node.values[1],
                    steps, examples,
                    node.getLocation()
                ));

            }

            // Require at least one table of example data
            if (example === null) {
                throw new Error(
                    'Parsing error on line '
                    + node.line + ', column ' + node.column
                    + ': Expected at least one table of example data for scenario outline.'
                );
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
                    + step.line + ', column ' + step.column
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
                data = new DocString(stream.expect('DOC').values[0]);

            // Step Data Tables
            } else if (stream.is('ROW')) {
                data = this.parseDataTable(step, stream);
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

    parseScenarioExamples: function(stream) {

        var example = stream.expect('EXAMPLES');
        return {
            title: example.values[0],
            table: this.parseDataTable(example, stream)
        };

    },

    parseDataTable: function(base, stream) {

        var columns = null,
            rows = [];

        while(stream.is('ROW')) {

            var data = stream.expect('ROW').values[0];
            if (columns === null) {
                columns = data;

            } else {
                rows.push(data);
            }

        }

        if (rows.length === 0) {
            throw new Error(
                'Parsing error on line '
                + base.line + ', column ' + base.column
                + ': DataTable must have at least one row of data.'
            );

        } else {
            return new DataTable(columns, rows);
        }

    },

    scenarioFromTemplate: function(index, table, title, description, tags, templateSteps, location) {

        var steps = {};

        for(var i in templateSteps) {
            /* istanbul ignore else */
            if (templateSteps.hasOwnProperty(i)) {
                steps[i] = templateSteps[i].map(function(node) {
                    return node.clone(
                        interpolateTitle(node.getRawTitle(), table, index)
                    );
                });
            }
        }

        return new ScenarioNode(
            tags,
            interpolateTitle(title, table, index),
            description,
            steps, null, location
        );

    }

};


// Helpers --------------------------------------------------------------------
function interpolateTitle(title, table, rowIndex) {

    var row = table.getRows()[rowIndex];
    table.getColumns().forEach(function(key, index) {
        title = title.replace(new RegExp('\\<' + key + '\\>', 'g'), row[index]);
    });

    return title;

}


// Exports --------------------------------------------------------------------
module.exports = Parser;

