
//= require ../model

(function(global, exports) {

  /**
   * Module dependencies.
   */

  var Model = exports.Model;

  /**
   * Expose `Sleeve`.
   */

  exports.Sleeve = Sleeve;

  /**
   * Properties.
   */

  var properties = [
    'type',
    'hole',
    'glossFinish',
    'frontTexture',
    'backTexture',
    'spineTexture'
  ];

  /**
   * Constructor.
   *
   * @param {Object} opts
   * @api public
   */

  function Sleeve(opts) {
    opts = opts || {};
    var self = this;
    if (opts.defaults) {
      setTimeout(function() {
        self.set(opts.defaults);
      }, 0);
    }
  }

  /**
   * Mixin `Model`.
   */

  Model(Sleeve.prototype);

  /**
   * Add accsesor methods.
   */

  properties.forEach(function(property) {
    Sleeve.prototype[property] = function() {
      var args = [].slice.call(arguments);
      if (!arguments.length) {
        return this.get.apply(this, [property].concat(args));
      }
      return this.set.apply(this, [property].concat(args));
    };
  });

})(this, (this.qvv = (this.qvv || {})));
