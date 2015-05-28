describe('Parsing Errors', function() {

    it('should fail to parse illegal comments between feature title and description', function() {

        var feature = framework.parseFeature(__dirname + '/features/commentBeforeDescription.feature');

        feature.should.be.instanceof(Error);
        feature.message.should.be.exactly('Lexing error on line 4: \'A\'. See http://wiki.github.com/cucumber/gherkin/lexingerror for more information.');

    });

});

