
//= require tdmsinc-tween.js
//= require_tree ./qrates_visualizer
//= require_self

(function(global, exports) {

  /**
   * Module dependencies.
   */

  var Emitter = exports.Emitter;
  var World = exports.World;
  var Loader = exports.Loader;
  var Vinyl = exports.Vinyl;
  var Label = exports.Label;
  var Sleeve = exports.Sleeve;

  /**
   * Expose `VinylVisualizer`.
   */

  exports.VinylVisualizer = VinylVisualizer;

  /**
   * noop.
   */

  var noop = function() {};

  /**
   * Constructor.
   *
   * @api public
   */

  function VinylVisualizer(el, opts) {
    this.opts = opts = opts || {};
    var defaults = opts.defaults || {};
    this.el = el;
    this.vinyl = new Vinyl({ defaults: defaults.vinyl });
    this.sleeve = new Sleeve({ defaults: defaults.sleeve });
    this.setup();
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

  // vinyl の label -----------------------
  VinylVisualizer.VinylLabel = Vinyl.Label;

  // sleeve のサイズ -----------------------
  VinylVisualizer.SleeveSize = Sleeve.Size;

  // sleeve のフォーマット -----------------------
  VinylVisualizer.SleeveFormat = Sleeve.Format;

  // sleeve のカラーフォーマット -----------------------
  VinylVisualizer.SleeveColorFormat = Sleeve.ColorFormat;

  // sleeve のホールオプション -----------------------
  VinylVisualizer.SleeveHole = Sleeve.Hole;

  // sleeve のフィニッシュ(光沢)オプション -----------------------
  VinylVisualizer.SleeveFinish = Sleeve.Finish;

  /**
   * Setup visualizer.
   *
   * @api private
   */

  VinylVisualizer.prototype.setup = function() {
    var self = this;
    var el = this.el;
    var loader = new Loader();

    Object.keys(el.dataset).forEach(function(key) {
      loader.add(key, el.dataset[key]);
    }, this);

    loader.load(function(err, assets) {
      var world = self.world = new World(self, assets, self.opts);
      world.delegateEvents();
      world.startRender();
      el.appendChild(world.getRenderer().domElement);
      setTimeout(function() {
        self.emit('ready');
      }, 0);
    });
  };

  /**
   * @param {Object} opts
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.startAutoRotation = function(opts) {
    if (this.timer) return this;
    opts = opts || {};
    var count = 0;
    var self = this;
    var duration = opts.duration || 2000;
    var interval = opts.interval || 3000;
    this.timer = setTimeout(function() {
      var callee = arguments.callee;
      var type = count++ % 5;
      self.view(type, { duration: duration }, function() {
        self.timer = setTimeout(callee, interval);
      });
    }, 0);
    return this;
  };

  /**
   * @param {Object} opts
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.stopAutoRotation = function(opts) {
    this.timer = clearTimeout(this.timer);
    return this;
  };

  /**
   * @param {Number} type
   * @param {Object} opts
   * @param {Function} callback
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.view = function(type, opts, callback) {
    if (!this.world) return this;
    this.world.updateView(type, opts, callback);
    return this;
  };

  /**
   * @param {Function} callback
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.capture = function(callback) {
    if (!this.world) return this;
    this.world.capture(callback);
    return this;
  };

  /**
   * @param {Number} width
   * @param {Number} height
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.resize = function(width, height) {
    if (!this.world) return this;
    this.world.resize(width, height);
    return this;
  };

  /**
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.play = function() {
    if (!this.world) return this;
    this.world.play();
    return this;
  };

  /**
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.pause = function() {
    if (!this.world) return this;
    this.world.pause();
    return this;
  };

  /**
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.startRender = function() {
    if (!this.world) return this;
    this.world.startRender();
    return this;
  };

  /**
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.stopRender = function() {
    if (!this.world) return this;
    this.world.stopRender();
    return this;
  };

  /**
   * @param {Object} opts [optional]
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.flip = function(opts) {
    if (!this.world) return this;
    opts = opts || {};
    this.world.flip(opts);
    return this;
  };

  /**
   * @param {Number} degree
   * @param {Object} opts [optional]
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.rotateHorizontal =
  VinylVisualizer.prototype.lookAround = function(degree, opts) {
    if (!this.world) return this;
    opts = opts || {};
    this.world.rotateHorizontal(degree, opts);
    return this;
  };

  /**
   * @param {Number} degree
   * @param {Object} opts [optional]
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.rotateVertical = function(degree, opts) {
    if (!this.world) return this;
    opts = opts || {};
    this.world.rotateVertical(degree, opts);
    return this;
  };

  /**
   * @param {Number} value
   * @param {Object} opts [optional]
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.cover = function(value, opts) {
    if (!this.world) return this;
    opts = opts || {};
    this.world.cover(value, opts);
    return this;
  };

  /**
   * @param {Number} step
   * @param {Object} opts [optional]
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.zoom = function(step, opts) {
    if (!this.world) return this;
    opts = opts || {};
    if (step < 0) {
      this.world.zoomOut(Math.abs(step), opts);
    } else {
      this.world.zoomIn(step, opts);
    }
    return this;
  };

  /**
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.setOrthographic = function() {
    if (!this.world) return this;
    this.world.setOrthographic();
    return this;
  };

  /**
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.setPerspective = function() {
    if (!this.world) return this;
    this.world.setPerspective();
    return this;
  };

  /**
   * @param {Boolean} value
   * @param {Object} opts [optional]
   * @param {Function} callback
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.vinylVisibility = function(value, opts, callback) {
    if (!this.world) return this;
    opts = opts || {};
    callback = callback || noop;
    this.world.setVinylVisibility(value, opts, callback);
    return this;
  };

  /**
   * @param {Boolean} value
   * @param {Object} opts [optional]
   * @param {Function} callback
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.sleeveVisibility = function(value, opts, callback) {
    if (!this.world) return this;
    opts = opts || {};
    callback = callback || noop;
    this.world.setSleeveVisibility(value, opts, callback);
    return this;
  };

})(this, (this.qvv = (this.qvv || {})));
