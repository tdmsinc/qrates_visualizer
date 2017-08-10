
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
   * Constants
   */
  
  Vinyl.Size = {
    SIZE_7_SMALL_HOLE: '7S',
    SIZE_7_LARGE_HOLE: '7L',
    SIZE_10: '10',
    SIZE_12: '12'
  };

  Vinyl.ColorFormat = {
    BLACK: 'black',
    COLOR: 'color',
    SPECIAL: 'special',
    PICTURE: 'picture'
  };

  Vinyl.Weight = {
    NORMAL: 'normal',
    HEAVY: 'heavy'
  };

  Vinyl.Label = {
    BLANK: 'blank',
    MONO_PRINT: 'mono print',
    COLOR_PRINT: 'color print'
  };

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
    'sideBTexture',
    'sideABumpMapTexture',
    'sideBBumpMapTexture'
  ];

  /**
   * Constructor.
   *
   * @param {Object} opts
   * @api public
   */

  function Vinyl(opts) {
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
