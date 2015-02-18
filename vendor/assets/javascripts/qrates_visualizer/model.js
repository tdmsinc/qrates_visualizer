
//= require ./emitter
//= require ./mixin

(function(global, exports) {

  /**
   * Module dependencies.
   */

  var mixin = exports.mixin;
  var Emitter = exports.Emitter;

  /**
   * Expose `Model`.
   */

  exports.Model = Model;

  /**
   * @param {Object} obj
   * @api public
   */

  function Model(obj) {
    obj = obj || {};
    Emitter(obj);
    mixin(obj, Model.prototype);
  }

  /**
   * @param {String} key
   * @param {String} value
   * @return {Model}
   * @api public
   */

  Model.prototype.set = function(key, value) {
    var settings = this.settings || (this.settings = {});
    settings[key] = value;
    return this.emit(key, value);
  };

  /**
   * @param {String} key
   * @return {Mixed}
   * @api public
   */

  Model.prototype.get = function(key) {
    var settings = this.settings || (this.settings = {});
    return settings[key];
  };

})(this, (this.qvv = (this.qvv || {})));
