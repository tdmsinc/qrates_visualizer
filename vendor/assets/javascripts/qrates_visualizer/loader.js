
//= require tdmsinc-three.js
//= require ./emitter

(function(global, exports) {

  /**
   * Module dependencies.
   */

  var Emitter = exports.Emitter;

  /**
   * Expose `Loader`.
   */

  exports.Loader = Loader;

  /**
   * Regex for path.
   */

  var pathRegex = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

  /**
   * @param {Object} obj
   * @api public
   */

  function Loader() {
    this.targets = {};
  }

  /**
   * Mixin `Emitter`.
   */

  Emitter(Loader.prototype);

  /**
   * @param {String} name
   * @param {String} path
   * @return {Loader}
   * @api public
   */

  Loader.prototype.add = function(name, path) {
    this.targets[name] = path;
    return this;
  };

  /**
   * @param {Function} callback
   * @return {Loader}
   * @api public
   */

  Loader.prototype.load = function(opts, callback) {

    console.log('Loader.load:', opts, callback);
    
    opts.loadTextures = (opts.loadTextures !== undefined) ? opts.loadTextures : true;

    var self = this;
    var assets = {};
    var manager = new THREE.LoadingManager();

    manager.onLoad = function() {
      callback(null, assets);
      self.emit('load', assets);
    };

    Object.keys(this.targets).forEach(function(key) {

      var loader;
      var path = this.targets[key];
      var ext = extname(path);

      if ('.dae' === ext) loader = new THREE.ColladaLoader(manager, opts.loadTextures);
      if ('.png' === ext || '.jpg' === ext) loader = new THREE.ImageLoader(manager);

      if (!loader) return;

      loader.crossOrigin = ''; // to load texture from cross origin.

      var obj = loader.load(path, function(obj) {
        assets[key] = obj;
        assets[key].extname = extname(path);
      });
      if (obj !== undefined) {
        assets[key] = obj;
      }
    }, this);

    return this;
  };

  /**
   * @param {String} path
   * @return {String}
   */

  function extname(path) {
    return pathRegex.exec(path).pop();
  }

})(this, (this.qvv = (this.qvv || {})));
