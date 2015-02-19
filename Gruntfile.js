module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/**\n' +
            ' * <%= pkg.description %>\n' +
            ' * @version v<%= pkg.version %><%= buildtag %>\n' +
            ' * @link <%= pkg.homepage %>\n' +
            ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
            ' */'
        },
        jshint: {
            files: ['Gruntfile.js', 'src/*.js'],
            options: {
                // ignore eval
                evil: true,
                globals: {
                    angular: true,
                    FileReader: true
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>\n'
            },
            dist: {
                files: {
                    '<%= pkg.name %>.min.js': ['<%= pkg.name %>.js']
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/*.js'],
                dest: '<%= pkg.name %>.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['jshint', 'build']);
    grunt.registerTask('build', ['concat', 'uglify']);
    grunt.registerTask('validate', ['jshint']);
};