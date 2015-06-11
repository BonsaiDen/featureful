var frameworks = [{
    name: 'mocha',
    ext: '.test.js'

}/*, {
    name: 'ocmock',
    ext: '.m'
}, {
    name: 'junit',
    ext: '.java'

}, */];

// Generic Framework Testing --------------------------------------------------
frameworks.forEach(function(f) {

    var root = process.cwd();

    describe('Framework Parser: ' + f.name, function() {

        var name = f.name,
            ext = f.ext;

        function parse(test) {
            return framework.parseTest(name, __dirname + '/' + name + '/' + test + ext)[0];
        }

        it('should find the Test Description, even in case there are expressions in the describe() body', function() {
            parse('featureDescriptionWithExpr').getDescription().should.be.exactly('A\nTest\nDescription.');
        });

        it('should automatically strip * from description doc comments', function() {
            parse('descriptionDocCommentWithStars').getDescription().should.be.exactly('A\nTest\nDescription.');
        });

        it('should parse Tests, Scenarios and Expectations', function() {

            var test = parse('base'),
                scenario = test.getScenarios()[0],
                expectations = scenario.getExpectations();

            // Counts ---------------------------------------------------------

            // Scenario Count
            test.getScenarios().length.should.be.exactly(1);

            // Expectation Count
            scenario.getExpectations().length.should.be.exactly(6);


            // Titles ---------------------------------------------------------

            // Test Title
            test.getTitle().should.be.exactly('A Feature');

            // Scenario Title
            scenario.getTitle().should.be.exactly('A Scenario');

            // Expectation Titles
            expectations[0].getTitle().should.be.exactly('Given some condition');
            expectations[1].getTitle().should.be.exactly('And given another condition');
            expectations[2].getTitle().should.be.exactly('When something is done');
            expectations[3].getTitle().should.be.exactly('And when some other thing is done');
            expectations[4].getTitle().should.be.exactly('Then something happens');
            expectations[5].getTitle().should.be.exactly('And then some other thing happens');


            // Check Locations ------------------------------------------------

            // Test Location
            test.getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            test.getLocation().line.should.be.of.type('number');
            test.getLocation().col.should.be.of.type('number');

            // Scenario Location
            scenario.getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            scenario.getLocation().line.should.be.of.type('number');
            scenario.getLocation().col.should.be.of.type('number');

            // Expectation Locations
            expectations[0].getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            expectations[0].getLocation().line.should.be.of.type('number');
            expectations[0].getLocation().col.should.be.of.type('number');

            expectations[1].getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            expectations[1].getLocation().line.should.be.of.type('number');
            expectations[1].getLocation().col.should.be.of.type('number');

            expectations[2].getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            expectations[2].getLocation().line.should.be.of.type('number');
            expectations[2].getLocation().col.should.be.of.type('number');

            expectations[3].getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            expectations[3].getLocation().line.should.be.of.type('number');
            expectations[3].getLocation().col.should.be.of.type('number');

            expectations[4].getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            expectations[4].getLocation().line.should.be.of.type('number');
            expectations[4].getLocation().col.should.be.of.type('number');

            expectations[5].getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            expectations[5].getLocation().line.should.be.of.type('number');
            expectations[5].getLocation().col.should.be.of.type('number');


            // Descriptions ---------------------------------------------------

            // Test Description
            test.getDescription().should.be.exactly('A\nFeature\nDescription.');


            // Tags -----------------------------------------------------------

            // Test Tags
            test.getTags().should.be.eql(['featureTagOne', 'featureTagTwo']);

            // Scenario Tags
            scenario.getTags().should.be.eql(['scenarioTagOne', 'scenarioTagTwo']);


            // Expressions ----------------------------------------------------

            // Expectation Expressions
            expectations[0].hasExpression().should.be.exactly(true);
            expectations[1].hasExpression().should.be.exactly(false);
            expectations[2].hasExpression().should.be.exactly(true);
            expectations[3].hasExpression().should.be.exactly(false);
            expectations[4].hasExpression().should.be.exactly(true);
            expectations[5].hasExpression().should.be.exactly(false);

        });

    });

});

