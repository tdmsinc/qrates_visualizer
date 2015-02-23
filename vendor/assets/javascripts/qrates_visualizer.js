
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
    opts = opts || {};
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
      var world = self.world = new World(self, assets);
      world.delegateEvents();
      world.start();
      el.appendChild(world.renderer.domElement);
      self.emit('ready');
    });
  };

  /**
   * @param {Number} type
   * @param {Object} opts
   * @param {Function} callback
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.view = function(type, opts, callback) {
    // TODO: change view
    return this;
  };

  /**
   * @param {Object} opts
   * @param {Function} callback
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.capture = function(opts, callback) {
    // TODO: capture image.
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
    // TODO:
    return this;
  };

  /**
   * @return {VinylVisualizer}
   * @api public
   */

  VinylVisualizer.prototype.pause = function() {
    // TODO:
    return this;
  };

})(this, (this.qvv = (this.qvv || {})));
