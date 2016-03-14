// npm install -S grunt time-grunt load-grunt-tasks grunt-contrib-copy grunt-contrib-clean grunt-contrib-jshint grunt-contrib-less grunt-autoprefixer grunt-contrib-watch grunt-newer
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    /* tree .
    .
    ├── Gruntfile.js
    ├── demo
    │   ├── demo.html
    │   └── fe
    │       ├── css
    │       │   └── demo.less
    │       └── js
    │           └── demo.js
    ├── jquery.pluginx.js
    └── package.json
     */
    var config = {
        tmp: './demo/fe/tmp',
        lessed: './demo/fe/tmp/lessed',
        prefixed: './demo/fe/tmp/prefixed',
        uglified: './demo/fe/tmp/uglified',
        src: './demo/fe',
        src_js: './demo/fe/js',
        src_css: './demo/fe/css',
        dev: './demo/public',
        dev_js: './demo/public/javascripts',
        dev_css: './demo/public/stylesheets',
        vendor: './bower_components'
    };
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: config,
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                undef: true,
                unused: true,
                debug: true,
                predef: ['$', 'console'],
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true,
                    nodejs: true,
                    require: true,
                    Map: true,
                },
                ignores: [],
                force: true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: {
                src: ['<%= config.src_js %>/**/*.js']
            }
        },
        less: {
            target: {
                options: {
                    compress: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.src_css %>',
                    src: '**/*.less',
                    dest: '<%= config.dev_css %>',
                    ext: '.css',
                    extDot: 'last'
                }]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 1% in US', 'last 5 versions', 'IE 9', 'IE 10']
            },
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= config.lessed %>',
                    src: '**/*.css',
                    dest: '<%= config.prefixed %>',
                    ext: '.css',
                    extDot: 'last'
                }]
            }
        },
        copy: {
            dev_css: {
                files: [{
                    expand: true,
                    cwd: '<%= config.prefixed %>',
                    src: '**/*.css',
                    dest: '<%= config.dev_css %>',
                    ext: '.css',
                    extDot: 'last'
                }]
            },
            dev_js: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src_js %>',
                    src: '**/*.js',
                    dest: '<%= config.dev_js %>',
                    ext: '.js',
                    extDot: 'last'
                }]
            }
        },
        clean:{
            dev_js:{
                files:[{
                    expand: true,
                    cwd: '<%= config.dev_js %>',
                    src: '**/*.js',
                }]
            },
            dev_css:{
                files:[{
                    expand: true,
                    cwd: '<%= config.dev_css %>',
                    src: '**/*.css',
                }]
            }
        },
        watch: {
            options: {
                reload: false,
                livereload: 35801,
                /* add this line into your .html file
                    <script>
                        document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35801/livereload.js?snipver=2"></' + 'script>')
                    </script>
                */
                spawn: true
            },
            gruntfile: {
                options: {
                    reload: true
                },
                files: ['Gruntfile.js'],
                tasks: ['jshint:gruntfile']
            },
            html: {
                files: '**/*.html',
            },
            js: {
                files: '<%= config.src_js %>/**/*.js',
                tasks: ['newer:jshint:src', 'newer:copy:dev_js']
            },
            css: {
                files: '<%= config.src_css %>/**/*.less',
                tasks: ['newer:less:', 'newer:autoprefixer', 'newer:copy:dev_css']
            }
        }
    });


    grunt.registerTask('dev', ['jshint', 'less', 'autoprefixer', 'copy', 'watch']);

    grunt.registerTask('default', ['dev']);

};
