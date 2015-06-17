describe('Title Matching', function() {

    var matcher = require('../../../lib/validator/matcher');

    function match(listA, listB, maxDistance, prefix) {

        var result = {
            matching: [],
            missingA: [],
            missingB: []
        };

        matcher(listA.map(function(title) {
            return {

                getTitle: function() {
                    if (prefix !== false) {
                        return 'Title Prefix: ' + title;

                    } else {
                        return title;
                    }
                },

                getRawTitle: function() {
                    return title;
                }

            };

        }), listB.map(function(title) {
            return {

                getTitle: function() {
                    if (prefix !== false) {
                        return 'Title Prefix: ' + title;

                    } else {
                        return title;
                    }
                },

                getRawTitle: function() {
                    return title;
                }

            };

        }), function(a, b) {
            result.matching.push([a.getRawTitle(), b.getRawTitle()]);

        }, function(b) {
            result.missingB.push(b.getRawTitle());

        }, function(a) {
            result.missingA.push(a.getRawTitle());

        }, maxDistance);

        return result;

    }

    it('should match up titles which are exactly equal', function() {
        match(
            ['A Test Title with some additional Parts'],
            ['A Test Title with some additional Parts'],
            20
        ).should.be.eql({
            matching: [
                [
                    'A Test Title with some additional Parts',
                    'A Test Title with some additional Parts'
                ]
            ],
            missingA: [],
            missingB: []
        });
    });

    it('should report titles without any A side as missing', function() {
        match(
            [],
            ['A Test Title with some additional Parts'],
            20
        ).should.be.eql({
            matching: [],
            missingA: ['A Test Title with some additional Parts'],
            missingB: []
        });
    });

    it('should report titles without any B side as missing', function() {
        match(
            ['A Test Title with some additional Parts'],
            [],
            20
        ).should.be.eql({
            matching: [],
            missingA: [],
            missingB: ['A Test Title with some additional Parts']
        });
    });

    it('should handle empty titles on the A side', function() {

        match(
            [''],
            ['A Test Title with some additional Parts'],
            20,
            false
        ).should.be.eql({
            matching: [],
            missingA: ['A Test Title with some additional Parts'],
            missingB: ['']
        });

    });

    it('should handle empty titles on the B side', function() {
        match(
            ['A Test Title with some additional Parts'],
            [''],
            20,
            false
        ).should.be.eql({
            matching: [],
            missingA: [''],
            missingB: ['A Test Title with some additional Parts']
        });
    });

    it('should match up titles which are nearly equal', function() {

        match(
            ['A Test Title with some additional Parts'],
            ['A Test Title with additional Parts'],
            20
        ).should.be.eql({
            matching: [
                [
                    'A Test Title with some additional Parts',
                    'A Test Title with additional Parts'
                ]
            ],
            missingA: [],
            missingB: []
        });

        match(
            ['A Test Title with some additional Parts'],
            ['A Test Title additional Parts'],
            20
        ).should.be.eql({
            matching: [
                [
                    'A Test Title with some additional Parts',
                    'A Test Title additional Parts'
                ]
            ],
            missingA: [],
            missingB: []
        });

        match(
            ['A Test Title with some additional Parts'],
            ['A Test additional Parts'],
            20
        ).should.be.eql({
            matching: [
                [
                    'A Test Title with some additional Parts',
                    'A Test additional Parts'
                ]
            ],
            missingA: [],
            missingB: []
        });

    });

    it('should not match up titles which are nearly equal but very short', function() {

        match(
            ['Bar'],
            ['Boo'],
            20
        ).should.be.eql({
            matching: [],
            missingA: ['Boo'],
            missingB: ['Bar']
        });

    });

    it('should not match up titles which are too different', function() {

        match(
            ['A Test Title with some additional Parts'],
            ['A additional Parts'],
            20
        ).should.be.eql({
            matching: [],
            missingA: ['A additional Parts'],
            missingB: ['A Test Title with some additional Parts',]
        });

        match(
            ['A Test Title with some additional Parts'],
            ['A Parts'],
            20
        ).should.be.eql({
            matching: [],
            missingA: ['A Parts'],
            missingB: ['A Test Title with some additional Parts',]
        });

    });

    it('should match up multiple titles with both exact and near-exact matches', function() {

        match([
            'A Test Title for the "Foo" Test',
            'A Test Title for the "Bar" Test',
            'A Test Title for the "Other" Test',
            'A Test Title for the "Test" Test'

        ], [
            'A Test Title for the "Foo" Test',
            'A Test Title for the "Bar" Test',
            'A Test Title for the "Some" Test',
            'A Test Title for the "Others" Test'

        ], 20).should.be.eql({
            matching: [
                [
                    'A Test Title for the "Foo" Test',
                    'A Test Title for the "Foo" Test'
                ],
                [
                    'A Test Title for the "Bar" Test',
                    'A Test Title for the "Bar" Test'
                ],
                [
                    'A Test Title for the "Other" Test',
                    'A Test Title for the "Others" Test'
                ],
                [
                    'A Test Title for the "Test" Test',
                    'A Test Title for the "Some" Test'
                ]
            ],
            missingA: [],
            missingB: []
        });

        match([
            'A Test Title of the other "Bar" Test',
            'A Test Title without the "Bar" Test',
            'A Test Title for the "Other" Test',
            'A Test Title without the "Test" Test'

        ], [
            'A Test Title of the "Bar" Test',
            'A Test Title for the "Bar" Test',
            'A Test Title for the "Some" Test',
            'A Test Title for the "Others" Test'

        ], 20).should.be.eql({
            matching: [
                [
                    'A Test Title for the "Other" Test',
                    'A Test Title for the "Others" Test'
                ],
                [
                    'A Test Title of the other "Bar" Test',
                    'A Test Title of the "Bar" Test'
                ],
                [
                    'A Test Title without the "Bar" Test',
                    'A Test Title for the "Bar" Test'
                ],
                [
                    'A Test Title without the "Test" Test',
                    'A Test Title for the "Some" Test'
                ]
            ],
            missingA: [],
            missingB: []
        });

    });

    it('should match long titles with only a few different words by stripping their common prefixes before comparing', function() {

        match([
            'A user requires a navigation bar to be present on all interfaces (Marketingplan)',
            'A user requires a navigation bar to be present on all interfaces (Image Database)'

        ], [
            'A user requires a navigation bar to be present on the "Image Database" interface',
            'A user requires a navigation bar to be present on the "Marketingplan" interface'


        ], 20).should.be.eql({
            matching: [
                [
                    'A user requires a navigation bar to be present on all interfaces (Marketingplan)',
                    'A user requires a navigation bar to be present on the "Marketingplan" interface'
                ],
                [
                    'A user requires a navigation bar to be present on all interfaces (Image Database)',
                    'A user requires a navigation bar to be present on the "Image Database" interface'
                ]
            ],
            missingA: [],
            missingB: []
        });

    });

});

