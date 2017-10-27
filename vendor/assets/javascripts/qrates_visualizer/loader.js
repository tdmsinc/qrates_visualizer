
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
    this.assets = {};
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
    this.assets[name] = null;
    return this;
  };

  /**
   * @param {Function} callback
   * @return {Loader}
   * @api public
   */

  Loader.prototype.load = function(opts, callback) {
    
    opts.loadModels = (opts.loadModels !== undefined) ? opts.loadModels : true;
    opts.loadTextures = (opts.loadTextures !== undefined) ? opts.loadTextures : true;

    var self = this;
    var manager = new THREE.LoadingManager();

    manager.onLoad = function() {
      callback(null, self.assets);
      self.emit('load', self.assets);
    };

    Object.keys(this.targets).forEach(function(key) {

      var loader;
      var path = this.targets[key];
      var ext = extname(path);

      if ('.dae' === ext) {
        if (path.toLowerCase().indexOf('vinyl') !== -1) {
          return;
        }
        if (false === opts.loadModels) {
          return;
        }

        loader = new THREE.ColladaLoader(manager, opts.loadTextures);
      } else if ('.png' === ext || '.jpg' === ext) {
        loader = new THREE.ImageLoader(manager);
      }

      if (!loader) return;

      loader.crossOrigin = ''; // to load texture from cross origin.

      var obj = loader.load(path, function(obj) {
        self.assets[key] = obj;
        self.assets[key].extname = extname(path);
      });

      if (obj !== undefined) {
        self.assets[key] = obj;
      }

    }, this);

    return this;

  };

  Loader.prototype.isLoaded = function (key) {

    if (undefined === this.assets[key] || null === this.assets[key]) {
      return false;
    }

    return true;

  };

  Loader.prototype.loadAsset = function (key, onLoad, onProgress, onError) {

    if (!onLoad) {
      console.warn('Loader.loadAssets: no callback function passed');
    }

    console.log('Loader.loadAssets: key: ', key, ', onLoad: ', onLoad);
    console.log('Loader.loadAssets: isLoaded("' + key + '")', this.isLoaded(key));

    if (!this.isLoaded(key)) {
      
      console.log('Loader.loadAssets: try to load ' + key + '');

      let loader;
      const path = this.targets[key];
      const ext = extname(path);

      if ('.dae' === ext) {
        loader = new THREE.ColladaLoader(undefined, false);
      } else if ('.png' === ext || '.jpg' === ext) {
        loader = new THREE.ImageLoader();
      }

      loader.crossOrigin = '';

      const self = this;

      loader.load(path, function (obj) {

        console.log('Loader.loadAssets: successfully loaded', self.assets[key]);
        
        self.assets[key] = obj;
        self.assets[key].extname = ext;

        if (onLoad) {
          onLoad(key, self.assets[key]);
        }
      }, function () {
        if (onProgress) onProgress(arguments);
      }, function () {
        if (onError) onError(arguments);
      });

    } else {

      if (onProgress) {
        onProgress(1.0);
      }

      if (onLoad) {
        console.log('Loader.loadAssets: already loaded');
        onLoad(key, this.assets[key]);
      }

      return this.assets[key];
    }
  };

  /**
   * @param {String} path
   * @return {String}
   */

  function extname(path) {
    return pathRegex.exec(path).pop();
  }

})(this, (this.qvv = (this.qvv || {})));
