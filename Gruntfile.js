/*jshint node:true*/
module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    
    // JSHint with options.
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      all: [
        '.'
      ]
    },
    
    // Command-line tasks.
    shell: {
      fixjsstyle: {
        options: {
          stdout: true
        },
        // Closure tools styling.
        command: 'fixjsstyle --strict prototype/localdepot.js specs/localdepot_test.js'
      },
      gjslint: {
        options: {
          stdout: true
        },
        // Closure tools linting.
        command: 'gjslint --strict prototype/localdepot.js specs/localdepot_test.js'
      }
    },
    
    // Minification.
    uglify: {
      my_target: {
        // Adding license to minified file.
        options: {
          banner: '<%= grunt.file.read("header.txt") %>',
          footer: '\n'
        },
        files: {
          'prototype/localdepot.min.js': ['prototype/localdepot.js']
        }
      }
    },
    
    // Unit tests.
    jasmine: {
      src: 'prototype/localdepot.js',
      options: {
        specs: 'specs/localdepot_test.js'
      }
    },
    
    // Git hooks with Grunt.
    githooks: {
      all: {
        'pre-commit': 'default'
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-githooks');

  grunt.registerTask('default', ['shell', 'jshint', 'jasmine', 'uglify']);
};
