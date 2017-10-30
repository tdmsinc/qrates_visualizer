
//= require tdmsinc-three.js
//= require ./emitter

(function(global, exports) {

  /**
   * Module dependencies.
   */

  const Emitter = exports.Emitter;

  /**
   * Expose `Loader`.
   */

  exports.Loader = Loader;

  /**
   * Regex for path.
   */

  const pathRegex = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

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

    const manager = new THREE.LoadingManager();

    manager.onLoad = () => {
      callback(null, this.assets);
      this.emit('load', this.assets);
    };

    Object.keys(this.targets).forEach((key) => {

      let loader;
      const path = this.targets[key];
      const ext = extname(path);

      if ('.dae' === ext) {
        if (false === opts.loadModels) {
          return;
        }

        loader = new THREE.ColladaLoader(manager, opts.loadTextures);
      } else if ('.png' === ext || '.jpg' === ext) {
        loader = new THREE.ImageLoader(manager);
      }

      if (!loader) return;

      loader.crossOrigin = ''; // to load texture from cross origin.

      const obj = loader.load(path, (obj) => {
        this.assets[key] = obj;
        this.assets[key].extname = extname(path);
      });

      if (obj !== undefined) {
        this.assets[key] = obj;
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

    return new Promise((resolve, reject) => {
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
    
        loader.load(path, (obj) => {
  
          console.log('Loader.loadAssets: successfully loaded', this.assets[key]);
          
          this.assets[key] = obj;
          this.assets[key].extname = ext;
  
          resolve(key);
        });
      }
    });
  };

  /**
   * @param {String} path
   * @return {String}
   */

  function extname(path) {
    return pathRegex.exec(path).pop();
  }

})(this, (this.qvv = (this.qvv || {})));
