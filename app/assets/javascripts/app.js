
//= require qrates_visualizer
//= require_self
var canvas_width = window.innerWidth, canvas_height = window.innerHeight;
//
// defaults
//
var defaults = {
  vinyl: {
    type: 1,
    size: 1,
    color: 0,
    splatterColor: 0,
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
    glossFinish: false
  }
};

//
// initialize vinyl visualizer.
//

var el = document.querySelector('.vinyl-visualizer-container');
var vv = new qvv.VinylVisualizer(el, {
  width: canvas_width,
  height: canvas_height,
  pixelRatio: window.devicePixelRatio || 1,
  renderer: {
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  },
  camera: {
    fov: 35,
    aspect: canvas_width / canvas_height,
    near: 1,
    far: 10000,
    type: 'perspective', // or orthographic
  },
  defaults: {
    vinyl: defaults.vinyl,
    label: defaults.label,
    sleeve: defaults.sleeve
  }
});

//
// initialize view model.
//

var vm = new Vue({ el: 'form', data: defaults });

//
// ready to use vinyl visualizer
//

vv.on('ready', function() {

  console.log('visualizer is ready.');

  //
  // delegate resize.
  //

  window.addEventListener('resize', function(e) {
    vv.resize(e.target.innerWidth, e.target.innerHeight);
  }, false);

  //
  // delegate events
  //

  vm.$watch('visualizer.width', function(value) {
    vv.resize(value, vm.$get('visualizer.height'));
  });
  vm.$watch('visualizer.height', function(value) {
    vv.resize(vm.$get('visualizer.width'), value);
  });
  vm.$watch('visualizer.view', function(value) {
    vv.view(value, { transition: vm.$get('visualizer.transition') });
  });
  vm.$watch('visualizer.capture', function(value) {
    var opts = {
      canvas_width: 1280,
      canvas_height: 794,
      duration: 0
    };
    vv.view(value, {duration:0});
  });

  vm.$watch('vinyl.type', function(value) { vv.vinyl.type(value); });
  vm.$watch('vinyl.size', function(value) { vv.vinyl.size(value); });
  vm.$watch('vinyl.color', function(value) { vv.vinyl.color(value); });
  vm.$watch('vinyl.splatter', function(value) { vv.vinyl.splatter(value); });
  vm.$watch('vinyl.holeSize', function(value) { vv.vinyl.holeSize(value); });
  vm.$watch('vinyl.heavy', function(value) { vv.vinyl.heavy(value); });
  vm.$watch('vinyl.speed', function(value) { vv.vinyl.speed(value); });
  vm.$watch('label.type', function(value) { vv.label.type(value); });
  vm.$watch('sleeve.type', function(value) { vv.sleeve.type(value); });
  vm.$watch('sleeve.hole', function(value) { vv.sleeve.hole(value); });
  vm.$watch('sleeve.glossFinish', function(value) { vv.sleeve.glossFinish(value); });

  //
  // file watcher
  //

  var vinylA = document.querySelector('input[name=vinyl-a]');
  var vinylB = document.querySelector('input[name=vinyl-b]');
  var vinylBumpMap = document.querySelector('input[name=vinyl-bumpmap]');
  var labelA = document.querySelector('input[name=label-a]');
  var labelB = document.querySelector('input[name=label-b]');
  var sleeveFront = document.querySelector('input[name=sleeve-front]');
  var sleeveBack = document.querySelector('input[name=sleeve-back]');
  var sleeveSpine = document.querySelector('input[name=sleeve-spine]');

  /**
   * @param {File} file
   * @param {Function} callback
   */

  function load(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onerror =
      img.onabort = function(e) {
        callback(e);
      };
      img.onload = function(e) {
        callback(null, e.target);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  vinylA.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyl.sideATexture(img);
    });
  };
  vinylB.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyl.sideBTexture(img);
    });
  };
  vinylBumpMap.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyl.bumpMapTexture(img);
    });
  };
  labelA.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.label.sideATexture(img);
    });
  };
  labelB.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.label.sideBTexture(img);
    });
  };
  sleeveFront.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.sleeve.frontTexture(img);
    });
  };
  sleeveBack.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.sleeve.backTexture(img);
    });
  };
  sleeveSpine.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.sleeve.spineTexture(img);
    });
  };
});

//
// observers. (for internal use)
//

vv.vinyl.on('type', function(value) {
  console.log('change vinyl.type', value);
});
vv.vinyl.on('size', function(value) {
  console.log('change vinyl.size', value);
});
vv.label.on('type', function(value) {
  console.log('change label.type', value);
});
vv.sleeve.on('glossFinish', function(value) {
  console.log('change sleeve.glossFinish', value);
});

//
// utils.
//

var form = document.querySelector('form');
var show = document.querySelector('.action-show');

show.addEventListener('click', function(e) {
  form.classList.toggle('show');
}, false);
