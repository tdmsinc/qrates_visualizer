
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
   * Constructor.
   *
   * @api public
   */

  function VinylVisualizer(el, opts) {
    this.opts = opts = opts || {};
    var defaults = opts.defaults || {};
    this.el = el;
    this.vinyl = new Vinyl({ defaults: defaults.vinyl });
    this.label = new Label({ defaults: defaults.label });
    this.sleeve = new Sleeve({ defaults: defaults.sleeve });
    this.setup();
  }

  /**
   * Mixin `Emitter`.
   */

  Emitter(VinylVisualizer.prototype);

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
      self.emit('ready');
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
    var duration = opts.duration || 1000;
    var interval = opts.interval || 4000;
    this.timer = setTimeout(function() {
      var callee = arguments.callee;
      var type = (count++ % 5) + 1;
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
   * @param {Object} opts
   * @param {Function} callback
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.capture = function(opts, callback) {
    if (!this.world) return this;
    this.world.capture(opts, callback);
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
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.lookReverse = function() {
    if (!this.world) return this;
    this.world.lookReverse();
    return this;
  };

  /**
   * @param {Number} degree
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.lookAround = function(degree) {
    if (!this.world) return this;
    this.world.lookAround(degree);
    return this;
  };

  /**
   * @param {Number} value
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.cover = function(value) {
    if (!this.world) return this;
    this.world.lookAround(value);
    return this;
  };

  /**
   * @param {Number} step
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.zoom = function(step) {
    if (!this.world) return this;
    if (step < 0) {
      this.world.zoomOut(Math.abs(step));
    } else {
      this.world.zoomIn(step);
    }
    return this;
  };

  /**
   * @param {Boolean} value
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.sleeveVisibility = function(value) {
    if (!this.world) return this;
    this.world.sleeveVisibility(value);
    return this;
  };

})(this, (this.qvv = (this.qvv || {})));
