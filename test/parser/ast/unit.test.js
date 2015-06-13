describe('AST Extraction', function() {

    var root = process.cwd();

    var expectedFiles = [
        {
            "type": "FILE",
            "filename": root + "/test/parser/ast/features/valid/a.feature",
            "features": [
                {
                    "type": "FEATURE",
                    "tags": [
                        "tagOne",
                        "tagTwo"
                    ],
                    "title": "A Feature",
                    "description": "A \ndescription \nof \nthe \nfeature.",
                    "location": {
                        "filename": root + "/test/parser/ast/features/valid/a.feature",
                        "line": 2,
                        "col": 0
                    },
                    "scenarios": [
                        {
                            "type": "SCENARIO",
                            "tags": [
                                "tagOne",
                                "tagTwo"
                            ],
                            "title": "A Scenario",
                            "location": {
                                "filename": root + "/test/parser/ast/features/valid/a.feature",
                                "line": 11,
                                "col": 4
                            },
                            "given": [
                                {
                                    "type": "GIVEN",
                                    "title": "Given some condition",
                                    "data": null,
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/valid/a.feature",
                                        "line": 12,
                                        "col": 8
                                    }
                                },
                                {
                                    "type": "GIVEN",
                                    "title": "And given a doc string",
                                    "data": "A doc string text.\n\nWith multiple lines.\n\nOf text.",
                                    "location": {
                                        "col": 12,
                                        "filename": root + "/test/parser/ast/features/valid/a.feature",
                                        "line": 13
                                    }
                                }
                            ],
                            "when": [
                                {
                                    "type": "WHEN",
                                    "title": "When something happens",
                                    "data": null,
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/valid/a.feature",
                                        "line": 22,
                                        "col": 8
                                    }
                                }
                            ],
                            "then": [
                                {
                                    "type": "THEN",
                                    "title": "Then some action is performed",
                                    "data": null,
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/valid/a.feature",
                                        "line": 23,
                                        "col": 8
                                    },
                                },
                                {
                                   "type": "THEN",
                                   "title": "And then a data table is parsed",
                                    "data": {
                                        "color": [
                                            "red",
                                            "green",
                                            "blue",
                                        ],
                                        "hex": [
                                            "#ff0000",
                                            "#00ff00",
                                            "#0000ff"
                                        ],
                                        "index": [
                                            "0",
                                            "1",
                                            "2"
                                        ]
                                    },
                                    "location": {
                                        "col": 12,
                                        "filename": root + "/test/parser/ast/features/valid/a.feature",
                                        "line": 24
                                    }
                                }
                            ],
                            "examples": null
                        }
                    ]
                }
            ]
        },
        {
            "type": "FILE",
            "filename": root + "/test/parser/ast/features/valid/foo/b.feature",
            "features": [
                {
                    "type": "FEATURE",
                    "tags": [],
                    "title": "A Feature",
                    "description": "",
                    "location": {
                        "filename": root + "/test/parser/ast/features/valid/foo/b.feature",
                        "line": 1,
                        "col": 0
                    },
                    "scenarios": [
                        {
                            "type": "SCENARIO",
                            "tags": [
                                "tagOne",
                                "tagTwo"
                            ],
                            "title": "A Scenario Outline",
                            "location": {
                                "filename": root + "/test/parser/ast/features/valid/foo/b.feature",
                                "line": 4,
                                "col": 4
                            },
                            "given": [
                                {
                                    "type": "GIVEN",
                                    "title": "Given some condition",
                                    "data": null,
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/valid/foo/b.feature",
                                        "line": 5,
                                        "col": 8
                                    }
                                }
                            ],
                            "when": [
                                {
                                    "type": "WHEN",
                                    "title": "When something happens",
                                    "data": null,
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/valid/foo/b.feature",
                                        "line": 6,
                                        "col": 8
                                    }
                                }
                            ],
                            "then": [
                                {
                                    "type": "THEN",
                                    "title": "Then some action is performed",
                                    "data": null,
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/valid/foo/b.feature",
                                        "line": 7,
                                        "col": 8
                                    }
                                }
                            ],
                            "examples": [
                                {
                                    "title": "foo",
                                    "value": "123",
                                    "other": "cat"
                                },
                                {
                                    "title": "bar",
                                    "value": "456",
                                    "other": "dog"
                                }
                            ]
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

