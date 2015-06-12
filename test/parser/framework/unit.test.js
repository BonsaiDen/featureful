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

        it('should parse Tests, Scenarios and Steps', function() {

            var test = parse('base'),
                scenario = test.getScenarios()[0],
                steps = scenario.getSteps();

            // Counts ---------------------------------------------------------

            // Scenario Count
            test.getScenarios().length.should.be.exactly(1);

            // Step Count
            scenario.getSteps().length.should.be.exactly(6);


            // Titles ---------------------------------------------------------

            // Test Title
            test.getTitle().should.be.exactly('A Feature');

            // Scenario Title
            scenario.getTitle().should.be.exactly('A Scenario');

            // Step Titles
            steps[0].getTitle().should.be.exactly('Given some condition');
            steps[1].getTitle().should.be.exactly('And given another condition');
            steps[2].getTitle().should.be.exactly('When something is done');
            steps[3].getTitle().should.be.exactly('And when some other thing is done');
            steps[4].getTitle().should.be.exactly('Then something happens');
            steps[5].getTitle().should.be.exactly('And then some other thing happens');


            // Check Locations ------------------------------------------------

            // Test Location
            test.getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            test.getLocation().line.should.be.of.type('number');
            test.getLocation().col.should.be.of.type('number');

            // Scenario Location
            scenario.getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            scenario.getLocation().line.should.be.of.type('number');
            scenario.getLocation().col.should.be.of.type('number');

            // Step Locations
            steps[0].getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            steps[0].getLocation().line.should.be.of.type('number');
            steps[0].getLocation().col.should.be.of.type('number');

            steps[1].getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            steps[1].getLocation().line.should.be.of.type('number');
            steps[1].getLocation().col.should.be.of.type('number');

            steps[2].getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            steps[2].getLocation().line.should.be.of.type('number');
            steps[2].getLocation().col.should.be.of.type('number');

            steps[3].getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            steps[3].getLocation().line.should.be.of.type('number');
            steps[3].getLocation().col.should.be.of.type('number');

            steps[4].getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            steps[4].getLocation().line.should.be.of.type('number');
            steps[4].getLocation().col.should.be.of.type('number');

            steps[5].getLocation().filename.should.be.exactly(root + '/test/parser/framework/' + name + '/base' + ext);
            steps[5].getLocation().line.should.be.of.type('number');
            steps[5].getLocation().col.should.be.of.type('number');


            // Descriptions ---------------------------------------------------

            // Test Description
            test.getDescription().should.be.exactly('A\nFeature\nDescription.');


            // Tags -----------------------------------------------------------

            // Test Tags
            test.getTags().should.be.eql(['featureTagOne', 'featureTagTwo']);

            // Scenario Tags
            scenario.getTags().should.be.eql(['scenarioTagOne', 'scenarioTagTwo']);


            // Expressions ----------------------------------------------------

            // Step Expressions
            steps[0].hasExpression().should.be.exactly(true);
            steps[1].hasExpression().should.be.exactly(false);
            steps[2].hasExpression().should.be.exactly(true);
            steps[3].hasExpression().should.be.exactly(false);
            steps[4].hasExpression().should.be.exactly(true);
            steps[5].hasExpression().should.be.exactly(false);

        });

    });

});

