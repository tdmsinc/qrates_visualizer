
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
   * @api public
   */

  function Label() {
    // TODO:
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
