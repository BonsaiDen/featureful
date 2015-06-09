describe('Parser Framework Custom', function() {

    var Parser = require('../../../../lib/spec/Parser');

    it('should allow to use and load custom test parser frameworks from node modules', function() {

        var parser = new Parser({
            tests: {
                framework: __dirname + '/unit.test.js'
            }
        });

        parser.getFramework().should.be.instanceof(CustomFramework);

    });

    it('should throw in case a custom test parser framework cannot be loaded from a node module', function() {

        var parser;
        try {
            parser = new Parser({
                tests: {
                    framework: __dirname + '/missingModule.js'
                }
            });

        } catch(err) {
            err.should.be.instanceof(Error);
            err.message.should.be.exactly(
                'Unable to load test Framework for "'
                + __dirname
                + '/missingModule.js", Error: Cannot find module \''
                + __dirname
                + '/missingModule.js\''
            );
        }

    });

});

// Custom Test Framework Export
function CustomFramework() {

}

module.exports = CustomFramework;

