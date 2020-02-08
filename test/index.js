var assert = require('assert');
var path = require('path');

var expressFreemarker = require('../');

var metadata = require('../package');

describe(metadata.name, function() {
  describe('getTemplatesDir', function() {
    var getTemplatesDir = expressFreemarker.getTemplatesDir;

    it('should be return `templates` dir', function() {
      var template = path.resolve(
        __dirname,
        'getTemplatesDir/templates/index.ftl'
      );

      assert(
        getTemplatesDir(template) ===
          path.resolve(__dirname, 'getTemplatesDir/templates')
      );
    });
    it("should be return file's dir", function() {
      var template = path.resolve(__dirname, 'getTemplatesDir/index.ftl');

      assert(
        getTemplatesDir(template) === path.resolve(__dirname, 'getTemplatesDir')
      );
    });
  });
  describe('engine', function() {
    var engine = expressFreemarker.engine;

    it('should render FreeMarker', function(done) {
      var template = path.resolve(__dirname, 'engine/index.ftl');

      engine(template, {}, function(err, html) {
        if (err) {
          return done(err);
        }

        assert(html === '<p>Hello, World!</p>\n');

        done();
      });
    });
    it('should render FreeMarker within include', function(done) {
      var template = path.resolve(__dirname, 'engine/templates/main/index.ftl');

      engine(template, {}, function(err, html) {
        if (err) {
          return done(err);
        }

        assert(html === '<header>It Works!</header>\n<p>Hello!</p>\n');

        done();
      });
    });
  });
  describe('bindConfigs', function() {
    var bindConfigs = expressFreemarker.bindConfigs;

    it('should return render function', function() {
      var renderer = bindConfigs({ suffix: 'ftl' });

      assert(typeof renderer === 'function');
      assert(renderer.length === 3);
    });
  });
});
