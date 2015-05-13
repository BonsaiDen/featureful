module.exports = function(grunt) {

    grunt.initConfig({
        featured: {

            ui: {
                options: {

                    features: {
                        pattern: process.cwd() + '/feature/**/*.feature',
                    },

                    tests: {
                        pattern: process.cwd() + '/test/**/*.test.js',
                    },

                    framework: 'mocha'

                }
            }

        }
    });

    grunt.loadTasks('../tasks');

};

