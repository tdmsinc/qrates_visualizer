
//= require tdmsinc-three.js
//= require tiny-emitter
//= require_tree ./qrates_visualizer
//= require_self

(function(global, exports) {

  /**
   * @param {Object} proto
   * @param {Object} superProto
   * @api private
   */

  function mixin(proto, superProto) {
    for (var key in superProto) {
      proto[key] = superProto[key];
    }
  }

  /**
   * Expose `VinylVisualizer`.
   */

  exports.VinylVisualizer = VinylVisualizer;

  /**
   * Constructor.
   *
   * @api public
   */

  function VinylVisualizer() {
    // TODO:
  }

})(this, (this.qvv = (this.qvv || {})));
