module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    uglify: {
      target: {
        files: {
          'autogrow-textarea.min.js': 'autogrow-textarea.js'
        }
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['uglify']);

};
