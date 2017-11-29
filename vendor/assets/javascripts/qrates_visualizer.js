
//= require tdmsinc-tween.js
//= require_tree ./qrates_visualizer
//= require_self

((global, exports) => {

  const Emitter = exports.Emitter;
  const World = exports.World;
  const Loader = exports.Loader;
  const Vinyl = exports.Vinyl;
  const Label = exports.Label;
  const Sleeve = exports.Sleeve;

  const noop = function() {};

  class VinylVisualizer {

    //--------------------------------------------------------------
    constructor(el, opts) {

      this.opts = opts = opts || {};
      
      const defaults = opts.defaults || {};
  
      this.el = el;
      this.loader = new Loader();
      this.loadModels = opts.loadModels !== undefined ? opts.loadModels : true;
      this.loadTextures = opts.loadTextures !== undefined ? opts.loadTextures : true;
      
      this.vinyls = [];
  
      for (let i in opts.defaults.vinyl) {
        this.vinyls.push(new Vinyl({ defaults: defaults.vinyl[i] }));
      }
  
      this.sleeve = new Sleeve({ defaults: defaults.sleeve });
  
      this.opts.loader = this.loader;
  
      this.setup();
    }

    //--------------------------------------------------------------
    setup() {
      
      const el = this.el;
  
      Object.keys(el.dataset).forEach((key) => {
        this.loader.add(key, el.dataset[key]);
      }, this);
      
      this.loader.load({
        loadModels: this.loadModels,
        loadTextures: this.loadTextures
      }, (err, assets) => {
        this.world = new World(this, assets, this.opts);
        this.world.setup()
          .then((world) => {
            this.world.startRender();
            el.appendChild(this.world.getRenderer().domElement);
            
            setTimeout(() => {
              this.emit('ready');
            }, 0);
          });
      });
    }
  
    //--------------------------------------------------------------
    startAutoRotation(opts) {
  
      if (this.timer) {
        return this;
      }
  
      opts = opts || {};
  
      let count = 0;
      const duration = opts.duration || 2000;
      const interval = opts.interval || 3000;
  
      this.timer = setTimeout(() => {
        const callee = arguments.callee;
        const type = count++ % 5;
  
        this.view(type, { duration: duration }, () => {
          this.timer = setTimeout(callee, interval);
        });
      }, 0);
  
      return this;
    }
  
    //--------------------------------------------------------------
    stopAutoRotation(opts) {
  
      this.timer = clearTimeout(this.timer);
  
      return this;
    }
  
    //--------------------------------------------------------------
    view(type, opts, callback) {
  
      if (!this.world) {
        return this;
      }
  
      this.world.updateView(type, opts, callback);
  
      return this;
    }
  
    //--------------------------------------------------------------
    capture(callback) {
      
      if (!this.world) {
        return this;
      }
  
      this.world.capture(callback);
  
      return this;
    }
  
    //--------------------------------------------------------------
    resize(width, height) {
      
      if (!this.world) {
        return this;
      }
  
      this.world.resize(width, height);
  
      return this;
    }
  
    //--------------------------------------------------------------
    play() {
  
      if (!this.world) {
        return this;
      }
  
      this.world.play();
  
      return this;
    }
  
    //--------------------------------------------------------------
    pause() {
  
      if (!this.world) {
        return this;
      }
  
      this.world.pause();
      
      return this;
    }
  
    //--------------------------------------------------------------
    startRender() {
  
      if (!this.world) {
        return this;
      }
  
      this.world.startRender();
      
      return this;
    }
  
    //--------------------------------------------------------------
    stopRender() {
  
      if (!this.world) {
        return this;
      }
  
      this.world.stopRender();
  
      return this;
    }
  
    //--------------------------------------------------------------
    flip(opts) {
  
      if (!this.world) {
        return this;
      }
  
      opts = opts || {};
      this.world.flip(opts);
  
      return this;
    }
  
    //--------------------------------------------------------------
    rotateHorizontal(degree, opts) {

      if (!this.world) {
        return this;
      }
  
      opts = opts || {};
      this.world.rotateHorizontal(degree, opts);
  
      return this;
    }

    //--------------------------------------------------------------
    lookAround(degree, opts) {
  
      if (!this.world) {
        return this;
      }
  
      opts = opts || {};
      this.world.rotateHorizontal(degree, opts);
  
      return this;
    }
  
    //--------------------------------------------------------------
    rotateVertical(degree, opts) {
  
      if (!this.world) {
        return this;
      }
  
      opts = opts || {};
      this.world.rotateVertical(degree, opts);
  
      return this;
    }
  
    //--------------------------------------------------------------
    cover(value, opts) {
  
      if (!this.world) {
        return this;
      }
  
      opts = opts || {};
      this.world.cover(value, opts);
      
      return this;
    }
  
    //--------------------------------------------------------------
    zoom(step, opts) {
  
      if (!this.world) {
        return this;
      }
  
      opts = opts || {};
      
      if (step < 0) {
        this.world.zoomOut(Math.abs(step), opts);
      } else {
        this.world.zoomIn(step, opts);
      }
  
      return this;
    }
  
    //--------------------------------------------------------------
    setOrthographic() {
      
      if (!this.world) {
        return this;
      }
  
      this.world.setOrthographic();
  
      return this;
    }
  
    //--------------------------------------------------------------
    setPerspective() {
      
      if (!this.world) {
        return this;
      }
      
      this.world.setPerspective();
      
      return this;
    }
  
    //--------------------------------------------------------------
    vinylVisibility(index, value, opts, callback) {
  
      if (!this.world) {
        return this;
      }
  
      opts = opts || {};
      callback = callback || noop;
      
      this.world.setVinylVisibility(index, value, opts, callback);
  
      return this;
    }
  
    //--------------------------------------------------------------
    sleeveVisibility(value, opts, callback) {
  
      if (!this.world) {
        return this;
      }
  
      opts = opts || {};
      callback = callback || noop;
  
      this.world.setSleeveVisibility(value, opts, callback);
  
      return this;
    }
  
    //--------------------------------------------------------------
    async setSize(value, opts, callback) {
  
      if (!this.world) {
        return this;
      }
  
      opts = opts || {};
      callback = callback || noop;
      
      await this.world.setSize(value, opts, callback);

      return this;
    }
  
    //--------------------------------------------------------------
    setGatefoldCoverAngle(degree, opts, callback) {
  
      if (!this.world) {
        return this;
      }
  
      opts = opts || {};
      callback = callback || noop;
  
      this.world.setGatefoldCoverAngle(degree, opts, callback);
  
      return this;
    }
  }

  /**
   * Mixin `Emitter`.
   */

  Emitter(VinylVisualizer.prototype);

  // vinyl のサイズ -----------------------
  VinylVisualizer.VinylSize = Vinyl.Size;

  // vinyl のカラーフォーマット -----------------------
  VinylVisualizer.VinylColorFormat = Vinyl.ColorFormat;

  // vinyl のウェイト -----------------------
  VinylVisualizer.VinylWeight = Vinyl.Weight;

  // vinyl のフォーマット -----------------------
  VinylVisualizer.VinylFormat = Vinyl.Format;

  // vinyl の index -----------------------
  VinylVisualizer.VinylIndex = Vinyl.Index;

  // sleeve のサイズ -----------------------
  VinylVisualizer.SleeveSize = Sleeve.Size;

  // sleeve のフォーマット -----------------------
  VinylVisualizer.SleeveFormat = Sleeve.Format;

  // sleeve のホールオプション -----------------------
  VinylVisualizer.SleeveHole = Sleeve.Hole;

  // sleeve のフィニッシュ(光沢)オプション -----------------------
  VinylVisualizer.SleeveFinish = Sleeve.Finish;

  exports.VinylVisualizer = VinylVisualizer;

})(this, (this.qvv = (this.qvv || {})));
