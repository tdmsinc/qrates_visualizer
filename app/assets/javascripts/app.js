
//= require qrates_visualizer
//= require_self

var el = document.querySelector('.vinyl-visualizer-container');
var vv = new qvv.VinylVisualizer(el);

vv.on('ready', function() {
  console.log('visualizer is ready');
});
