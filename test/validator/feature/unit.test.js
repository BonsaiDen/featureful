describe('Feature Validation', function() {

    it('should validate matching Features from Features and Tests', function(done) {

        framework.validate(__dirname, 'a', function(result) {
            result.should.be.exactly(false);

        }, done);

    });

    /*
    it('should error out on mismatch between Feature -> Test Title', function(done) {

        framework.validate(__dirname, 'featureTestTitle', function(result) {
            result.should.be.exactly(false);

        }, done);

    });
    */

});

