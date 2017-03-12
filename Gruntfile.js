module.exports = function(grunt) {


    // By default just display a message
    grunt.registerTask('default', ['tasks']);

    // Instead of building all files we prompt the user on which build they want
    grunt.registerTask('tasks', function() {
        grunt.log.subhead('Please choose a grunt build:');
        grunt.log.ok('grunt build		builds everything');
        grunt.log.ok('grunt css		build css');
        grunt.log.ok('grunt js		build js');
    });
    // Build all
    grunt.registerTask('build', ['clean', 'copy:html', 'sass', 'cssmin', 'jshint', 'uglify', 'manifest', 'copy:manifest', ]);
    // Build CSS
    grunt.registerTask('css', ['clean', 'sass', 'cssmin']);
    // Build JS
    grunt.registerTask('js', ['clean', 'jshint', 'uglify']);

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // File Path Setup
        dirBuild: 'build',
        dirDist: 'dist',
        dirJsPath: 'js',
        dirCssPath: 'css',
        // Build Tasks
        clean: {
            all: ['dist', 'build']
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none'
                },
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.scss'],
                    dest: '<%= dirBuild %>/<%= dirCssPath %>',
                    ext: '.css'
                }]
            }
        },
        manifest: {
            generate: {
                options: {
                    basePath: '<%= dirDist %>/',
                    timestamp: true,
                    hash: true
                },
                dest: 'manifest.appcache',
                src: [
                	'index.html',
                    '<%= dirCssPath %>/*.css',
                    '<%= dirJsPath %>/*.js',
                    '<%= dirImgPath %>/*.jpg',
                ],
                exclude: [
                    '<%= dirJsPath %>/lib/*.js'
                ],
                timestamp: true,
                hash: true,
                master: ['index.html'],
                process: function(path) {
                    return path.substring('<%= dirBuild %>/'.length);
                },
            }
        },
        copy: {
            manifest: {
                files: [{
                    src: '*.appcache',
                    dest: '<%= dirBuild %>/'
                }, {
                    src: '*.appcache',
                    dest: '<%= dirDist %>/'
                }]
            },
            html: {
                files: [{
                    src: '*.html',
                    dest: '<%= dirBuild %>/'
                }, {
                    src: '*.html',
                    dest: '<%= dirDist %>/'
                }]
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= dirBuild %>',
                    src: ['<%= dirCssPath %>/*.css'],
                    dest: '<%= dirDist %>'
                }]
            }
        },
        jshint: {
            options: {
                reporterOutput: ""
            },
            all: [
                'Gruntfile.js',
                '<%= dirJsPath %>/*.js'
            ]
        },
        uglify: {
            build: {
                options: {
                    preserveComments: true, // set to true to keep comments in the code
                    beautify: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= dirJsPath %>',
                    src: ['*.js'],
                    dest: '<%= dirBuild %>/<%= dirJsPath %>/'
                }]
            },
            dist: {
                options: {
                    preserveComments: false, // set to true to keep comments in the code
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    compress: {
                        drop_console: true, // removes all console.log incase there left in the code
                        unused: true, // drop unreferenced functions and variables
                        booleans: true, //various optimizations for boolean context
                        comparisons: true, // apply certain optimizations to binary nodes
                        conditionals: true, // apply optimizations for if-s and conditional expressions
                        properties: true, // rewrite property access using the dot notation
                        sequences: true // join consecutive simple statements using the comma operator
                    },
                    //wrap: true
                },
                files: [{
                    '<%= dirDist %>/<%= dirJsPath %>/clock.js': ['<%= dirBuild %>/<%= dirJsPath %>/clock.js']
                }]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            dist: {
                files: [
                    '<%= dirCssPath %>/*.scss',
                    '<%= dirJsPath %>/*.js',
                ],
                tasks: ['build'],
                options: {
                    spawn: false
                },
            }
        }
    });

};