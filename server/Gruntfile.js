/*global module:false*/
module.exports = function (grunt) {
    // These plugins provide necessary tasks.
    //grunt.loadNpmTasks('grunt-contrib-nodeunit');
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-execute');

    // Default task.
    grunt.registerTask('default', ['ts']);
    grunt.registerTask('build', ['ts']);
    grunt.registerTask('exe', ['execute'])

    // Project configuration.
    grunt.initConfig({
        // Task configuration.
        execute: {
            server: {
                src: ['src/app.js']
            }
        },
        ts: {
            build: {
                // The source TypeScript files, http://gruntjs.com/configuring-tasks#files
                src: ["src/**/*.ts"],
                // The source html files, https://github.com/grunt-ts/grunt-ts#html-2-typescript-support
                //html: ["test/work/**/*.tpl.html"],
                // If specified, generate this file that to can use for reference management
                //reference: "./test/reference.ts",
                // If specified, generate an out.js file which is the merged js file
                //out: 'test/out.js',
                // If specified, the generate JavaScript files are placed here. Only works if out is not specified
                //outDir: 'test/outputdirectory',
                // If specified, watches this directory for changes, and re-runs the current target
                //watch: 'test',
                // Use to override the default options, http://gruntjs.com/configuring-tasks#options
                options: {
                    // 'es3' (default) | 'es5'
                    target: 'es5',
                    // 'amd' (default) | 'commonjs'
                    module: 'commonjs',
                    // true (default) | false
                    sourceMap: false,
                    // true | false (default)
                    declaration: false,
                    // true (default) | false
                    removeComments: true
                },
            }
        }
    });
};
