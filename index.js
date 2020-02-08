/**
 * NOTE: This script written in old-style JavaScript,
 * because it will use in legacy environment.
 */

var fs = require('fs');
var path = require('path');

var FreeMarker = require('freemarker');

/**
 * get templates directory path from file
 *
 * @param {string} filePath
 * @return {string}
 */
function getTemplatesDir(filePath) {
  var dirPath = path.resolve(filePath);
  var root = path.parse(filePath).root;

  // break if dirPath is `templates` or root
  while (path.basename(dirPath) !== 'templates' && dirPath !== root) {
    dirPath = path.resolve(dirPath, '..');
  }

  return path.basename(dirPath) === 'templates' ? dirPath : path.dirname(filePath);
}

/**
 * render function for FreeMarker
 *
 * @param {string} filePath
 * @param {Object} options
 * @param {Function} callback
 */
function engine(filePath, options, callback) {
  var renderer = this.renderer || new FreeMarker({
    root: getTemplatesDir(filePath)
  });

  // NOTE: render function is throw `The source file is not inside the souce root` error,
  // because create file in temp dir.
  renderer.renderFile(filePath, options, function(err, result) {
    if (err) {
      return callback(err);
    }

    callback(null, result);
  });
}

/**
 * bind configs for FreeMarker and get render function
 *
 * @param {Object} configs
 * @return {Function}
 */
function bindConfigs(configs) {
  return function(filePath, options, callback) {
    var renderer = new FreeMarker(configs || {});

    return engine.call({
      renderer: renderer
    }, filePath, options, callback);
  };
}

bindConfigs.getTemplatesDir = getTemplatesDir;
bindConfigs.engine = engine;
bindConfigs.bindConfigs = bindConfigs;

module.exports = bindConfigs;
