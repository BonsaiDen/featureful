describe('Language Parsing', function() {

    it('should parse Features specified in German', function(done) {

        framework.match(__dirname, function(specs) {

            var features = specs[0].getFeatures(),
                featureScenarios = features[0].getScenarios();

            // Check Features
            features.length.should.be.exactly(1);

            // Check Feature Title
            features[0].getTitle().should.be.exactly('Eine Funktionalität');

            // Check Feature Scenarios
            featureScenarios.length.should.be.exactly(1);

            // Check Feature Scenario Titles
            featureScenarios[0].getTitle().should.be.exactly('Ein Szenario');

            // Check Features Scenario Steps
            featureScenarios[0].getSteps().length.should.be.exactly(6);

            // Check Features Scenario Step Titles
            featureScenarios[0].getSteps()[0].getTitle().should.be.exactly('Angenommen eine Bedingung');
            featureScenarios[0].getSteps()[1].getTitle().should.be.exactly('Und angenommen eine weitere Bedingung');
            featureScenarios[0].getSteps()[2].getTitle().should.be.exactly('Wenn etwas geschieht');
            featureScenarios[0].getSteps()[3].getTitle().should.be.exactly('Und wenn etwas anderes geschieht');
            featureScenarios[0].getSteps()[4].getTitle().should.be.exactly('Dann gibt es ein Ergebnis');
            featureScenarios[0].getSteps()[5].getTitle().should.be.exactly('Und dann es gibt ein weiteres Ergebnis');


        }, done);

    });

});

