
//= require qrates_visualizer
//= require_self

// initialize vinyl visualizer.
var el = document.querySelector('.vinyl-visualizer-container');
var vv = new qvv.VinylVisualizer(el);

// ready to use vinyl visualizer
vv.on('ready', function() {
  console.log('visualizer is ready.');
  // setters.
  vv.vinyl.type(1).size(12);
  vv.label.type(1);
  vv.sleeve.glossFinished(true);
  setTimeout(function() {
    // getters.
    console.log('vv.vinyl.type() returns', vv.vinyl.type());
    console.log('vv.vinyl.size() returns', vv.vinyl.size());
    console.log('vv.label.type() returns', vv.label.type());
    console.log('vv.sleeve.glossFinished() returns', vv.sleeve.glossFinished());
  }, 1000);
});

// observers. (for internal use)
vv.vinyl.on('type', function(value) {
  console.log('change vinyl.type', value);
});
vv.vinyl.on('size', function(value) {
  console.log('change vinyl.size', value);
});
vv.label.on('type', function(value) {
  console.log('change label.type', value);
});
vv.sleeve.on('glossFinished', function(value) {
  console.log('change sleeve.glossFinished', value);
});
