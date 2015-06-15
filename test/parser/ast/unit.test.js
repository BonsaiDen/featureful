describe('AST Extraction', function() {

    var root = process.cwd();

    var expectedFiles = [
        {
            "type": "File",
            "filename": root + "/test/parser/ast/features/valid/a.feature",
            "features": [
                {
                    "type": "Feature",
                    "tags": [
                        "tagOne",
                        "tagTwo"
                    ],
                    "title": "A Feature",
                    "description": "A\ndescription\nof\nthe\nfeature.",
                    "location": {
                        "filename": root + "/test/parser/ast/features/valid/a.feature",
                        "line": 2,
                        "column": 0
                    },
                    "scenarios": [
                        {
                            "type": "Scenario",
                            "tags": [
                                "tagOne",
                                "tagTwo"
                            ],
                            "title": "A Scenario",
                            "description": "A\nScenario\nDescription.",
                            "location": {
                                "filename": root + "/test/parser/ast/features/valid/a.feature",
                                "line": 11,
                                "column": 4
                            },
                            "steps": [
                                {
                                    "type": "Given",
                                    "title": "Given some condition",
                                    "argument": null,
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/valid/a.feature",
                                        "line": 17,
                                        "column": 8
                                    }
                                },
                                {
                                    "type": "Given",
                                    "title": "And given a doc string",
                                    "argument": {
                                        "type": "DocString",
                                        "value": "A doc string text.\n\nWith multiple lines.\n\nOf text.",
                                    },
                                    "location": {
                                        "column": 12,
                                        "filename": root + "/test/parser/ast/features/valid/a.feature",
                                        "line": 18
                                    }
                                },
                                {
                                    "type": "When",
                                    "title": "When something happens",
                                    "argument": null,
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/valid/a.feature",
                                        "line": 27,
                                        "column": 8
                                    }
                                },
                                {
                                    "type": "Then",
                                    "title": "Then some action is performed",
                                    "argument": null,
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/valid/a.feature",
                                        "line": 28,
                                        "column": 8
                                    },
                                },
                                {
                                   "type": "Then",
                                   "title": "And then a data table is parsed",
                                    "argument": {
                                        "type": "DataTable",
                                        "columns": ["color", "hex", "index"],
                                        "rows": [
                                            ["red", "#ff0000", "0"],
                                            ["green", "#00ff00", "1"],
                                            ["blue", "#0000ff", "2"]
                                        ]
                                    },
                                    "location": {
                                        "column": 12,
                                        "filename": root + "/test/parser/ast/features/valid/a.feature",
                                        "line": 29
                                    }
                                }
                            ],
                            "examples": []
                        }
                    ]
                }
            ]
        },
        {
            "type": "File",
            "filename": root + "/test/parser/ast/features/valid/foo/b.feature",
            "features": [
                {
                    "type": "Feature",
                    "tags": [],
                    "title": "A Feature",
                    "description": "",
                    "location": {
                        "filename": root + "/test/parser/ast/features/valid/foo/b.feature",
                        "line": 1,
                        "column": 0
                    },
                    "scenarios": [
                        {
                            "type": "Scenario",
                            "tags": [
                                "tagOne",
                                "tagTwo"
                            ],
                            "title": "A Scenario Outline",
                            "description": "",
                            "location": {
                                "filename": root + "/test/parser/ast/features/valid/foo/b.feature",
                                "line": 4,
                                "column": 4
                            },
                            "steps": [
                                {
                                    "type": "Given",
                                    "title": "Given some condition",
                                    "argument": null,
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/valid/foo/b.feature",
                                        "line": 5,
                                        "column": 8
                                    }
                                },
                                {
                                    "type": "When",
                                    "title": "When something happens",
                                    "argument": null,
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/valid/foo/b.feature",
                                        "line": 6,
                                        "column": 8
                                    }
                                },
                                {
                                    "type": "Then",
                                    "title": "Then some action is performed",
                                    "argument": null,
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/valid/foo/b.feature",
                                        "line": 7,
                                        "column": 8
                                    }
                                }
                            ],
                            "examples": [{
                                "title": "A List of Examples",
                                "columns": ["title", "value", "other"],
                                "rows": [
                                    ["foo", "123", "cat"],
                                    ["bar", "456", "dog"]
                                ]
                            }, {
                                "title": "A List of additional Examples",
                                "columns": ["title", "value", "other"],
                                "rows": [
                                    ["foo", "123", "cat"],
                                    ["bar", "456", "dog"]
                                ]
                            }]
                        }
                    ]
                }
            ]
        }
    ];

    it('should provide a method for extracting the AST of features from files specified by a glob pattern', function() {

        var Parser = require('../../..').Parser,
            files = Parser.parseFeatureFromPatterns([
                __dirname + '/features/valid/**/*.feature'
            ]);

        console.log(files.stack);
        files.should.be.eql(expectedFiles);

    });

    it('should ignore duplicate matches when extracting AST features from files via glob patterns', function() {

        var Parser = require('../../..').Parser,
            files = Parser.parseFeatureFromPatterns([
                __dirname + '/features/valid/**/*.feature',
                __dirname + '/features/valid/*.feature'
            ]);

        files.should.be.eql(expectedFiles);

    });


    it('should provide a method for extracting the AST of features from files specified by a glob pattern (handling parsing errors)', function() {

        var Parser = require('../../..').Parser,
            error = Parser.parseFeatureFromPatterns([
                __dirname + '/features/error/**/*.feature'
            ]);

        error.should.be.instanceof(Error);
        error.message.should.be.exactly('Parsing error on line 1, column 0: Unexpected token \'SCENARIO\'.');

    });

});

