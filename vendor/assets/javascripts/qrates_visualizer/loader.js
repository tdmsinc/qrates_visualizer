
//= require tdmsinc-three.js
//= require ./emitter

((global, exports) => {

  const Emitter = exports.Emitter;

  const pathRegex = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

  function extname(path) {
    return pathRegex.exec(path).pop();
  }

  class Loader {
    //--------------------------------------------------------------
    constructor() {
      this.targets = {};
      this.assets = {};
    }

    //--------------------------------------------------------------
    add(name, path) {
      this.targets[name] = path;
      this.assets[name] = null;
      return this;
    }

    //--------------------------------------------------------------
    load(opts, callback) {
      
      opts.loadModels = (opts.loadModels !== undefined) ? opts.loadModels : true;
      opts.loadTextures = (opts.loadTextures !== undefined) ? opts.loadTextures : true;
  
      const manager = new THREE.LoadingManager();
  
      if (false === opts.loadModels && false === opts.loadTextures) {
        callback(null, this.assets);
        this.emit('load', this.assets);
        return;
      }
  
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
          if (false === opts.loadTextures && -1 === path.toLowerCase().indexOf('envmap')) {
            return;
          }
  
          loader = new THREE.ImageLoader(manager);
        }
  
        if (!loader) return;
        
        loader.crossOrigin = 'anonymous'; // to load texture from cross origin.
        console.log('visualizer loader loading(1) ' + path);
        
        const obj = loader.load(path, obj => {
          this.assets[key] = obj;
          this.assets[key].extname = extname(path);
        });
  
        if (obj !== undefined) {
          this.assets[key] = obj;
        }
  
      }, this);
  
      return this;
  
    }

    //--------------------------------------------------------------
    isLoaded(key) {
      if (undefined === this.assets[key] || null === this.assets[key]) {
        return false;
      }
  
      return true;
    }

    //--------------------------------------------------------------
    loadAsset(target, onLoad, onProgress, onError) {
      
      if (this.isLoaded(target['key'])) {
        console.log('Loader.loadAsset: ' + target['key'] + ' is already loaded');
        return Promise.resolve({
          'assetType': -1 < target['key'].toLowerCase().indexOf('model') ? 'model' : 'texture',
          'textureType': target['textureType'] || '',
          'key': target['key']
        });
      }
  
      return new Promise((resolve, reject) => {
  
        const key = target['key'];
  
        if (!this.isLoaded(key)) {
          console.log('Loader.loadAssets: try to load ' + key + '');
  
          let loader;
          let assetType = 'model';
          let textureType = '';
          const path = this.targets[key];
          const ext = extname(path);
    
          if ('.dae' === ext) {
            loader = new THREE.ColladaLoader(undefined, false);
          } else if ('.png' === ext || '.jpg' === ext) {
            loader = new THREE.ImageLoader();
            assetType = 'texture';
            textureType = target['textureType'];
          }
    
          console.log('Loader.loadAsset: target', key, 'loader', loader);
  
          if (!loader) {
            console.error('Loader.loadAsset: loader is ' + loader + ', key = ' + key);
            return Promise.reject();
          }
  
          loader.crossOrigin = 'anonymous';
          console.log('visualizer loader loading(2) ' + path);
      
          loader.load(path, obj => {
    
            this.assets[key] = obj;
            this.assets[key].extname = ext;
            this.assets[key].cached = true;
  
            console.log('Loader.loadAssets: successfully loaded', this.assets[key]);
    
            resolve({
              'assetType': assetType,
              'textureType': textureType,
              'key': key
            });
          });
        }
      });
    }
  }

  Emitter(Loader.prototype);

  exports.Loader = Loader;

})(this, (this.qvv = (this.qvv || {})));
