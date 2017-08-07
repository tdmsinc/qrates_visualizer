
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
   * Constants
   */
  
  Sleeve.Size = {
    SIZE_7: '7',
    SIZE_10: '10',
    SIZE_12: '12'
  };

  Sleeve.Format = {
    SINGLE_NO_SPINE: 'no-spine',
    SINGLE: 'single',
    DOUBLE: 'double',
    GATEFOLD: 'gatefold'
  };

  Sleeve.Hole = {
    NO_HOLE: 'normal',
    HOLED: 'holed'
  };

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
