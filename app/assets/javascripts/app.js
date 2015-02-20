
//= require qrates_visualizer
//= require_self

// defaults
var defaults = {
  visualizer: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  vinyl: {
    type: 1,
    size: 7,
    holeSize: 0,
    heavy: false,
    speed: 45,
  },
  label: {
    type: 1
  },
  sleeve: {
    type: 1,
    hole: false,
    glossFinished: false
  }
};

// initialize vinyl visualizer.
var el = document.querySelector('.vinyl-visualizer-container');
var vv = new qvv.VinylVisualizer(el, {
  defaults: {
    vinyl: defaults.vinyl,
    label: defaults.label,
    sleeve: defaults.sleeve
  }
});

// initialize view model.
var vm = new Vue({ el: 'form', data: defaults });

vm.$watch('visualizer.width', function(value) {
  vv.resize(value, vm.$get('visualizer.height'));
});
vm.$watch('visualizer.height', function(value) {
  vv.resize(vm.$get('visualizer.width'), value);
});
vm.$watch('visualizer.view', function(value) {
  vv.view(value, { transition: vm.$get('visualizer.transition') });
});

vm.$watch('vinyl.type', function(value) { vv.vinyl.type(value); });
vm.$watch('vinyl.size', function(value) { vv.vinyl.size(value); });
vm.$watch('vinyl.holeSize', function(value) { vv.vinyl.holeSize(value); });
vm.$watch('vinyl.heavy', function(value) { vv.vinyl.heavy(value); });
vm.$watch('vinyl.speed', function(value) { vv.vinyl.speed(value); });
vm.$watch('label.type', function(value) { vv.label.type(value); });
vm.$watch('sleeve.type', function(value) { vv.sleeve.type(value); });
vm.$watch('sleeve.hole', function(value) { vv.sleeve.hole(value); });
vm.$watch('sleeve.glossFinished', function(value) { vv.sleeve.glossFinished(value); });

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
