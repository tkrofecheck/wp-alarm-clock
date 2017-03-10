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
    grunt.registerTask('build', ['clean', 'copy:html', 'copy:json', 'minjson', 'sass', 'imagemin', 'copy:images', 'cssmin', 'jshint', 'uglify', 'manifest', 'copy:manifest', ]);
    // Build CSS
    grunt.registerTask('css', ['clean', 'sass', 'cssmin']);
    // Build JS
    grunt.registerTask('js', ['clean', 'copy:json', 'jshint', 'uglify']);

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // File Path Setup
        dirBuild: 'build',
        dirDist: 'dist',
        dirDataPath: 'data',
        dirJsPath: 'js',
        dirCssPath: 'css',
        dirImgPath: 'images',
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
        imagemin: { // Task
            dynamic: { // Another target
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: '<%= dirImgPath %>', // Src matches are relative to this path
                    src: [
                        '*.{png,jpg,gif}',
                        '**/*.{png,jpg,gif}',
                        '**/**/*.{png,jpg,gif}'
                    ], // Actual patterns to match
                    dest: '<%= dirBuild %>/<%= dirImgPath %>' // Destination path prefix
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
            },
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= dirBuild %>/<%= dirImgPath %>/',
                    src: '**',
                    dest: '<%= dirDist %>/<%= dirImgPath %>/',
                }]
            },
            json: {
                expand: true,
                cwd: '<%= dirDataPath %>/',
                src: '**',
                dest: '<%= dirBuild %>/<%= dirDataPath %>/'
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
        minjson: {
            compile: {
                files: {
                    '<%= dirDist %>/data/data.min.json': [
                        '<%= dirBuild %>/data/clock.json'
                    ]
                }
            }
        },
        uglify: {
            build: {
                options: {
                    preserveComments: false, // set to true to keep comments in the code
                    compress: {
                        drop_console: false, // removes all console.log incase there left in the code
                        hoist_funs: true, // hoist function declarations
                        unused: true, // drop unreferenced functions and variables
                        if_return: true, // optimizations for if/return and if/continue
                        booleans: true, //various optimizations for boolean context
                        comparisons: true, // apply certain optimizations to binary nodes
                        conditionals: true, // apply optimizations for if-s and conditional expressions
                        properties: true, // rewrite property access using the dot notation
                        sequences: true // join consecutive simple statements using the comma operator
                    },
                    sourceMap: true,
                    sourceMapIncludeSources: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= dirJsPath %>',
                    src: ['*.js', 'app/*.js'],
                    dest: '<%= dirBuild %>/<%= dirJsPath %>/'
                }]
            },
            dist: {
                options: {
                    preserveComments: false, // set to true to keep comments in the code
                    compress: {
                        drop_console: true, // removes all console.log incase there left in the code
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
                    '<%= dirSrc %>/data/*.json',
                    '<%= dirSrc %>/scss/*.scss',
                    '<%= dirSrc %>/<%= dirJsPath %>/*.js',
                    '<%= dirSrc %>/<%= dirJsPath %>/app/*.js'
                ],
                tasks: ['build'],
                options: {
                    spawn: false
                },
            }
        }
    });

};