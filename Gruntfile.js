module.exports = function(grunt) {

    // Helpers ----------------------------------------------------------------
    function jshintrc(path) {
        return JSON.parse(grunt.file.read(path).replace(/\/\/.*/g, ''));
    }

    grunt.initConfig({

        // Configuration ------------------------------------------------------
        pkg: grunt.file.readJSON('package.json'),

        // Environment --------------------------------------------------------
        env: {
            test: {
                NO_COLOR: false
            }
        },

        // Tests --------------------------------------------------------------
        mochaTest: {

            test: {
                options: {
                    reporter: 'spec',
                    clearRequireCache: true,
                    slow: 250,
                    require: [
                        './test/framework'
                    ]
                },
                src: ['test/**/unit.test.js']
            }

        },

        mocha_istanbul: {
            coverage: {
                src: ['test/**/unit.test.js'],
                options: {
                    coverage: !!process.env.COVERALLS_REPO_TOKEN,
                    clearRequireCache: true,
                    slow: 250,
                    require: [
                        './test/framework'
                    ],
                    reportFormats: ['text-summary', 'html', 'lcovonly'],
                    check: {
                        statements: 100,
                        branches: 100,
                        functions: 100,
                        lines: 100
                    }
                }
            }
        },

        // JSHint -------------------------------------------------------------
        jshint: {

            lib: {
                src: ['lib/**/*.js', 'tasks/**/*.js', 'bin/**/*.js'],
                options: jshintrc('.jshintrc')
            },

            test: {
                src: ['test/**/*.js', '!test/coverage/**/*.js'],
                options: jshintrc('test/.jshintrc')
            }

        }

    });


    // Coveralls Integration --------------------------------------------------
    grunt.event.on('coverage', function(lcov, done){
        require('coveralls').handleInput(lcov, function(err){

            if (err) {
                return done(err);

            } else {
                done();
            }

        });
    });


    // NPM Tasks --------------------------------------------------------------
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-env');


    // Public Tasks -----------------------------------------------------------
    grunt.registerTask('test', ['env:test', 'mochaTest:test']);
    grunt.registerTask('coverage', ['env:test', 'mocha_istanbul:coverage']);
    grunt.registerTask('default', ['jshint']);

};

