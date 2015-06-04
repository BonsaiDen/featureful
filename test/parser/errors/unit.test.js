describe('Parsing Errors', function() {

    it('should fail parsing on illegal comments between feature title and description', function() {

        var feature = framework.parseFeature(__dirname + '/features/commentBeforeDescription.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Lexing error on line 4: \'A\'. See http://wiki.github.com/cucumber/gherkin/lexingerror for more information.');

    });

    it('should fail when parsing empty example table data for Scenario Outlines', function() {

        var feature = framework.parseFeature(__dirname + '/features/invalidExamples.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Parsing error on line 7, column 8: Expected at least one row of example data for scenario outline.');

    });

    it('should fail when parsing multiple background definitions for a single Feature', function() {

        var feature = framework.parseFeature(__dirname + '/features/multipleBackgrounds.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Parsing error on line 6, column 4: Only one background is allowed per feature.');

    });

    it('should fail when parsing AND before given/when/then steps in scenario', function() {

        var feature = framework.parseFeature(__dirname + '/features/invalidSteps.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Parsing error on line 4, column 8: Expected a Given/Then/When before AND in scenario steps.');

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

});

