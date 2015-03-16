
//= require ../model

(function(global, exports) {

  /**
   * Module dependencies.
   */

  var Model = exports.Model;

  /**
   * Expose `Label`.
   */

  exports.Label = Label;

  /**
   * Properties.
   */

  var properties = [
    'type',
    'sideATexture',
    'sideBTexture'
  ];

  /**
   * Constructor.
   *
   * @param {Object} opts
   * @api public
   */

  function Label(opts) {
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

  Model(Label.prototype);

  /**
   * Add accsesor methods.
   */

  properties.forEach(function(property) {
    Label.prototype[property] = function() {
      var args = [].slice.call(arguments);
      if (!arguments.length) {
        return this.get.apply(this, [property].concat(args));
      }
      return this.set.apply(this, [property].concat(args));
    };
  });

})(this, (this.qvv = (this.qvv || {})));
