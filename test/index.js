var assert = require('assert');
var http = require('http');
var path = require('path');

var express = require('express');

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
  describe('use with Express', function() {
    it('should response rendered HTML', function(done) {
      var app = express();
      var port = 3939;
      var server;

      app.engine('ftl', expressFreemarker.engine);
      app.set('view engine', 'ftl');
      app.set('views', path.join(__dirname, 'engine/templates'));

      app.get('/', function(req, res) {
        res.render('main/index.ftl');
      });

      server = app.listen(port, function() {
        var url = 'http://127.0.0.1:' + port + '/';

        http
          .request(url, function(res) {
            var buffer = '';

            if (res.statusCode < 200 || res.statusCode > 300) {
              return done(new Error('response code is not 2xx'));
            }

            res.setEncoding('utf8');
            res.on('data', function(chunk) {
              buffer += chunk;
            });
            res.on('end', function() {
              assert(buffer === '<header>It Works!</header>\n<p>Hello!</p>\n');

              server.close();

              done();
            });
          })
          .on('error', function(err) {
            server.close();

            done(err);
          })
          .end();
      });
    });
  });
});
