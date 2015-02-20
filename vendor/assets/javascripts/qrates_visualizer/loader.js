
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

  Loader.prototype.load = function(callback) {
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
      var ext = path.slice(path.length - 4);
      if ('.obj' === ext) loader = new THREE.OBJLoader(manager);
      if ('.png' === ext) loader = new THREE.ImageLoader(manager);
      loader.load(path, function(obj) {
        assets[key] = obj;
      });
    }, this);

    return this;
  };

})(this, (this.qvv = (this.qvv || {})));
