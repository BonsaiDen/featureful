describe('Parsing Errors', function() {

    it('should fail parsing on illegal comments between feature title and description', function() {

        var feature = framework.parseFeature(__dirname + '/features/commentBeforeDescription.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Lexing error on line 4: \'A\'. See http://wiki.github.com/cucumber/gherkin/lexingerror for more information.');

    });

    it('should fail when example table data for Scenario Outlines is missing', function() {

        var feature = framework.parseFeature(__dirname + '/features/missingExamples.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Parsing error on line 3, column 4: Expected at least one table of example data for scenario outline.');

    });

    it('should fail when parsing empty example table data for Scenario Outlines', function() {

        var feature = framework.parseFeature(__dirname + '/features/invalidExamples.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Parsing error on line 7, column 8: DataTable must have at least one row of data.');

    });

    it('should fail when parsing empty example table data for Steps', function() {

        var feature = framework.parseFeature(__dirname + '/features/invalidStepTable.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Parsing error on line 5, column 8: DataTable must have at least one row of data.');

    });

    it('should fail when parsing multiple background definitions for a single Feature', function() {

        var feature = framework.parseFeature(__dirname + '/features/multipleBackgrounds.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Parsing error on line 6, column 4: Only one background is allowed per feature.');

    });

    it('should fail when parsing "And" before Given / When / Then steps in scenario', function() {

        var feature = framework.parseFeature(__dirname + '/features/invalidStepsAnd.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Parsing error on line 4, column 8: Expected a Given / Then / When before "And" in scenario steps.');

    });

    it('should fail when parsing "But" before Given / When / Then steps in scenario', function() {

        var feature = framework.parseFeature(__dirname + '/features/invalidStepsBut.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Parsing error on line 4, column 8: Expected a Given / Then / When before "But" in scenario steps.');

    });

    it('should fail when parsing illegal syntax (lexer)', function() {

        var feature = framework.parseFeature(__dirname + '/features/invalidSyntaxLexer.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Lexing error on line 1: \'Foobar\'. See http://wiki.github.com/cucumber/gherkin/lexingerror for more information.');

    });

    it('should fail when parsing illegal syntax (parser)', function() {

        var feature = framework.parseFeature(__dirname + '/features/invalidSyntaxParser.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Parsing error on line 1, column 0: Unexpected token \'SCENARIO\'.');

    });

    it('should fail when parsing a "When" step in a Background Definition', function() {

        var feature = framework.parseFeature(__dirname + '/features/invalidBackgroundWhen.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Parsing error on line 2, column 4: "When" step is not allowed in scenario background definition.');

    });

    it('should fail when parsing a "Then step in a Background Definition', function() {

        var feature = framework.parseFeature(__dirname + '/features/invalidBackgroundThen.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Parsing error on line 2, column 4: "Then" step is not allowed in scenario background definition.');

    });

});

