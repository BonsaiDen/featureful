module.exports = {

    features: {
        pattern: __dirname + '/features/**/*.feature'
    },

    tests: {
        pattern: __dirname + '/tests/**/*.test.js'
    },

    framework: 'mocha',

    match: 'path'

};

