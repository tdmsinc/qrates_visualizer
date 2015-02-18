
//= require tiny-emitter
//= require ./mixin

(function(global, exports) {

  /**
   * Module dependencies.
   */

  var mixin = exports.mixin;

  /**
   * Expose `Model`.
   */

  exports.Emitter = Emitter;

  /**
   * @param {Object} obj
   * @api public
   */

  function Emitter(obj) {
    obj = obj || {};
    mixin(obj, TinyEmitter.prototype);
  }

})(this, (this.qvv = (this.qvv || {})));
