
//= require tdmsinc-three.js
//= require_tree ./qrates_visualizer
//= require_self

(function(global, exports) {

  /**
   * Module dependencies.
   */

  var Emitter = exports.Emitter;
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

  function VinylVisualizer(el) {
    this.el = el;
    this.vinyl = new Vinyl();
    this.label = new Label();
    this.sleeve = new Sleeve();
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
    // TODO: preload assets.

    // TODO: it's renderer for test.
    var renderer = new THREE.WebGLRenderer({ antialiased: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.display = 'block';
    this.el.appendChild(renderer.domElement);

    var self = this;
    setTimeout(function() {
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
    // TODO: resize canvas.
    return this;
  };

})(this, (this.qvv = (this.qvv || {})));
