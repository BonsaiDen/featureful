describe('Parser Framework Mocha', function() {

    it('should find the Test Description, even in case there are expressions in the describe() body', function() {
        var test = framework.parseTest('mocha', __dirname + '/tests/featureDescriptionWithExpr.test.js')[0];
        test.getDescription().should.be.exactly('A\nTest\nDescription.');
    });

    it('should automatically strip * from description doc comments', function() {
        var test = framework.parseTest('mocha', __dirname + '/tests/descriptionDocCommentWithStars.test.js')[0];
        test.getDescription().should.be.exactly('A\nTest\nDescription.');
    });

});

