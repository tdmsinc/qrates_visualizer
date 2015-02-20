
//= require ../model

(function(global, exports) {

  /**
   * Module dependencies.
   */

  var Model = exports.Model;

  /**
   * Expose `Vinyl`.
   */

  exports.Vinyl = Vinyl;

  /**
   * Properties.
   */

  var properties = [
    'type',
    'size',
    'color',
    'splatterColor',
    'holeSize',
    'heavy',
    'speed',
    'sideATexture',
    'sideBTexture'
  ];

  /**
   * Constructor.
   *
   * @param {Object} opts
   * @api public
   */

  function Vinyl(opts) {
    opts = opts || {};
    if (opts.defaults) this.set(opts.defaults);
  }

  /**
   * Mixin `Model`.
   */

  Model(Vinyl.prototype);

  /**
   * Add accsesor methods.
   */

  properties.forEach(function(property) {
    Vinyl.prototype[property] = function() {
      var args = [].slice.call(arguments);
      if (!arguments.length) {
        return this.get.apply(this, [property].concat(args));
      }
      return this.set.apply(this, [property].concat(args));
    };
  });

})(this, (this.qvv = (this.qvv || {})));
