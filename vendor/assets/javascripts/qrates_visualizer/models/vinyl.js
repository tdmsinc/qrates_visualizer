
//= require ../model
//= require ../world/vinyl

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
  
  Vinyl.Size = exports.world.Vinyl.Size;
  Vinyl.ColorFormat = exports.world.Vinyl.ColorFormat;
  Vinyl.Weight = exports.world.Vinyl.Weight;
  Vinyl.Label = exports.world.Vinyl.Label;
  Vinyl.Color = exports.world.Vinyl.Color;
  Vinyl.Index = exports.world.Vinyl.Index;

  /**
   * Properties.
   */

  var properties = [
    'colorFormat',
    'size',
    'color',
    'splatterColor',
    'holeSize',
    'weight',
    'speed',
    'alphaMap',
    'aoMap',
    'bumpMap',
    'colorMap',
    'label',
    'labelAoMap',
    'labelBumpMap',
    'labelColorMap'
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
