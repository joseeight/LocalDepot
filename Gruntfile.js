/*jshint node:true*/
module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    
    karma: {
      local: {
        options: {
          configFile: 'karma.conf.js',
          files: ['prototype/localdepot.js', 'specs/localdepot_test.js']
        },
        singleRun: true,
        frameworks: ['jasmine'],
        browsers: ['Chrome', 'Firefox', 'Opera']
      }/*
,
      // Use below 'browsers' if BrowserStack account is enabled in config.
      chrome: {
        options: {
          configFile: 'karma.conf.js',
          files: ['prototype/localdepot.js', 'specs/localdepot_test.js']
        },
        singleRun: true,
        frameworks: ['jasmine'],
        browsers: ['bs_chrome_mac', 'bs_chrome_win']
      },
      firefox: {
        options: {
          configFile: 'karma.conf.js',
          files: ['prototype/localdepot.js', 'specs/localdepot_test.js']
        },
        singleRun: true,
        frameworks: ['jasmine'],
        browsers: ['bs_firefox_mac', 'bs_firefox_win']
      },
      safari: {
        options: {
          configFile: 'karma.conf.js',
          files: ['prototype/localdepot.js', 'specs/localdepot_test.js']
        },
        singleRun: true,
        frameworks: ['jasmine'],
        browsers: ['bs_safari_mac']
      },
      ie_modern: {
        options: {
          configFile: 'karma.conf.js',
          files: ['prototype/localdepot.js', 'specs/localdepot_test.js']
        },
        singleRun: true,
        frameworks: ['jasmine'],
        browsers: ['bs_ie_10', 'bs_ie_11']
      },
      ie_legacy: {
        options: {
          configFile: 'karma.conf.js',
          files: ['prototype/localdepot.js', 'specs/localdepot_test.js']
        },
        singleRun: true,
        frameworks: ['jasmine'],
        browsers: ['bs_ie_9']
      }
*/
    },
    
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
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['shell', 'jshint', 'karma', 'uglify']);
};
