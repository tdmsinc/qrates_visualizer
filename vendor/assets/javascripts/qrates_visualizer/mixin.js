
(function(global, exports) {

  /**
   * Expose `mixin`.
   */

  exports.mixin = mixin;

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

})(this, (this.qvv = (this.qvv || {})));
