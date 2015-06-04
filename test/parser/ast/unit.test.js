describe('AST Extraction', function() {

    var root = process.cwd();

    var expectedFiles = [
        {
            "type": "FILE",
            "filename": root + "/test/parser/ast/features/a.feature",
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
                        "filename": root + "/test/parser/ast/features/a.feature",
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
                                "filename": root + "/test/parser/ast/features/a.feature",
                                "line": 11,
                                "col": 4
                            },
                            "given": [
                                {
                                    "type": "GIVEN",
                                    "title": "Given some condition",
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/a.feature",
                                        "line": 12,
                                        "col": 8
                                    }
                                }
                            ],
                            "when": [
                                {
                                    "type": "WHEN",
                                    "title": "When something happens",
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/a.feature",
                                        "line": 13,
                                        "col": 8
                                    }
                                }
                            ],
                            "then": [
                                {
                                    "type": "THEN",
                                    "title": "Then some action is performed",
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/a.feature",
                                        "line": 14,
                                        "col": 8
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
            "filename": root + "/test/parser/ast/features/foo/b.feature",
            "features": [
                {
                    "type": "FEATURE",
                    "tags": [],
                    "title": "A Feature",
                    "description": "",
                    "location": {
                        "filename": root + "/test/parser/ast/features/foo/b.feature",
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
                                "filename": root + "/test/parser/ast/features/foo/b.feature",
                                "line": 4,
                                "col": 4
                            },
                            "given": [
                                {
                                    "type": "GIVEN",
                                    "title": "Given some condition",
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/foo/b.feature",
                                        "line": 5,
                                        "col": 8
                                    }
                                }
                            ],
                            "when": [
                                {
                                    "type": "WHEN",
                                    "title": "When something happens",
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/foo/b.feature",
                                        "line": 6,
                                        "col": 8
                                    }
                                }
                            ],
                            "then": [
                                {
                                    "type": "THEN",
                                    "title": "Then some action is performed",
                                    "location": {
                                        "filename": root + "/test/parser/ast/features/foo/b.feature",
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
                __dirname + '/features/**/*.feature'
            ]);


        files.should.be.eql(expectedFiles);

    });

});

