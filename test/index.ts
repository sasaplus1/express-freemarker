import assert = require('assert');

import * as http from 'http';
import * as path from 'path';

import * as express from 'express';

import { engine } from '../';

describe('express-freemarker', function () {
  describe('engine', function () {
    it('should render FreeMarker', function (done) {
      engine(
        'engine/index.ftl',
        { viewRoot: path.resolve(__dirname) },
        { message: 'Works!' },
        function (err, html, output) {
          if (err) {
            err.message += '\n';
            err.message += output;

            return done(err);
          }

          assert(html === '<p>Hello, World!</p>\n<h1>It, Works!</h1>\n');

          done();
        }
      );
    });
    it('should render FreeMarker with include', function (done) {
      engine(
        'engine/templates/main/with_include.ftl',
        {
          viewRoot: path.resolve(__dirname),
          options: {
            // HACK: convert to TDD syntax
            // http://fmpp.sourceforge.net/tdd.html
            freemarkerLinks: JSON.stringify({
              root: [path.resolve(__dirname, 'engine/templates')]
            })
          }
        },
        {},
        function (err, html, output) {
          if (err) {
            err.message += '\n';
            err.message += output;

            return done(err);
          }

          assert(html === '<header>It Works!</header>\n<p>Hello!</p>\n');

          done();
        }
      );
    });
    it('should render FreeMarker with macro', function (done) {
      engine(
        'engine/templates/main/with_macro.ftl',
        {
          viewRoot: path.resolve(__dirname),
          options: {
            borders: `[
              header("<#import '/@root/macros/common.ftl' as common>", **/*.ftl)
            ]`,
            freemarkerLinks: JSON.stringify({
              root: [path.resolve(__dirname, 'engine/templates')]
            })
          }
        },
        {},
        function (err, html, output) {
          if (err) {
            err.message += '\n';
            err.message += output;

            return done(err);
          }

          assert(html === '<header>It Works!</header>\n<p>Hello!</p>\n');

          done();
        }
      );
    });
  });
  describe('use with Express', function () {
    it('should response rendered HTML', function (done) {
      const app = express();
      const port = 3939;

      const renderer = function (
        filePath: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: Record<string, any>,
        callback: (err: Error | null, content: string) => void
      ) {
        const viewRoot = app.get('views');

        engine(
          filePath.replace(viewRoot, ''),
          {
            viewRoot,
            options: {
              freemarkerLinks: JSON.stringify({
                root: [path.resolve(__dirname, 'engine/templates')]
              })
            }
          },
          data,
          callback
        );
      };

      app.engine('ftl', renderer);
      app.set('view engine', 'ftl');
      app.set('views', path.resolve(__dirname, 'engine/templates'));

      app.get('/', function (req, res) {
        res.render('main/index.ftl', {});
      });

      const server = app.listen(port, function () {
        const url = 'http://127.0.0.1:' + port + '/';

        http
          .request(url, function (res) {
            let buffer = '';

            if (res.statusCode < 200 || res.statusCode > 300) {
              return done(new Error('response code is not 2xx'));
            }

            res.setEncoding('utf8');
            res.on('data', function (chunk) {
              buffer += chunk;
            });
            res.on('end', function () {
              try {
                assert(
                  buffer === '<header>It Works!</header>\n<p>Hello!</p>\n'
                );
                done();
              } finally {
                server.close();
              }
            });
          })
          .on('error', function (err) {
            server.close();
            done(err);
          })
          .end();
      });
    });
  });
});
