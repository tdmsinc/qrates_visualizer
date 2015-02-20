
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
    if (2 == arguments.length) {
      settings[key] = value;
      return this.emit(key, value);
    }
    for (var k in key) {
      settings[k] = key[k];
      this.emit(k, key[k]);
    }
    return this;
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

  /**
   * @return {Object}
   * @api public
   */

  Model.prototype.toObject =
  Model.prototype.toJSON = function() {
    return this.settings || (this.settings = {});
  };

})(this, (this.qvv = (this.qvv || {})));
