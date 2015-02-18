
//= require tdmsinc-three.js
//= require tiny-emitter
//= require_tree ./qrates_visualizer
//= require_self

(function(global, exports) {

  /**
   * Module dependencies.
   */

  var mixin = exports.mixin;

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
    TinyEmitter.call(this);
    this.el = el;
    this.setup();
  }

  /**
   * Mixin `TinyEmitter`.
   */

  mixin(VinylVisualizer.prototype, TinyEmitter.prototype);

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

})(this, (this.qvv = (this.qvv || {})));
