
//= require qrates_visualizer
//= require_self
var canvas_width = window.innerWidth, canvas_height = window.innerHeight;
//
// defaults
//
var defaults = {
  vinyl: {
    size: qvv.VinylVisualizer.VinylSize.SIZE_12,
    weight: qvv.VinylVisualizer.VinylWeight.NORMAL,
    label: qvv.VinylVisualizer.VinylLabel.COLOR_PRINT,
    colorFormat: qvv.VinylVisualizer.VinylColorFormat.COLOR,
    speed: 45
  },
  sleeve: {
    size: qvv.VinylVisualizer.SleeveSize.SIZE_12,
    format: qvv.VinylVisualizer.SleeveFormat.DOUBLE,
    colorFormat: qvv.VinylVisualizer.SleeveColorFormat.WHITE,
    hole: qvv.VinylVisualizer.SleeveHole.NO_HOLE,
    finish: qvv.VinylVisualizer.SleeveFinish.NORMAL
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

  vm.$watch('vinyl.colorFormat', function(value) { vv.vinyl.colorFormat(value); });
  vm.$watch('vinyl.size', function(value) { vv.vinyl.size(value); });
  vm.$watch('vinyl.colors', function(value) {
    vv.vinyl.color({
      index: qvv.VinylVisualizer.VinylIndex.FIRST,
      color: value
    });

    vv.vinyl.color({
      index: qvv.VinylVisualizer.VinylIndex.SECOND,
      color: value
    });
  });
  vm.$watch('vinyl.holeSize', function(value) { vv.vinyl.holeSize(value); });
  vm.$watch('vinyl.heavy1', function(value) {
    vv.vinyl.heavy({
      index: qvv.VinylVisualizer.VinylIndex.FIRST,
      heavy: value
    });
  });
  vm.$watch('vinyl.heavy2', function(value) {
    vv.vinyl.heavy({
      index: qvv.VinylVisualizer.VinylIndex.SECOND,
      heavy: value
    });
  });
  vm.$watch('vinyl.labelType1', function(value) { 
    vv.vinyl.labelType({
      index: qvv.VinylVisualizer.VinylIndex.FIRST,
      label: value
    });
  });
  vm.$watch('vinyl.labelType2', function(value) {
    vv.vinyl.labelType({
      index: qvv.VinylVisualizer.VinylIndex.SECOND,
      label: value
    });
  });
  vm.$watch('vinyl.speed', function(value) { vv.vinyl.speed(value); });
  vm.$watch('sleeve.type', function(value) { vv.sleeve.type(value); });
  vm.$watch('sleeve.colorFormat', function(value) { vv.sleeve.colorFormat(value); });
  vm.$watch('sleeve.hole', function(value) { vv.sleeve.hole(value); });
  vm.$watch('sleeve.finish', function(value) { vv.sleeve.finish(value); });

  //
  // file watcher
  //

  var vinylAoMap = document.querySelector('input[name=vinyl-ao]');
  var vinylBumpMap = document.querySelector('input[name=vinyl-bump]');
  var vinylColorMap = document.querySelector('input[name=vinyl-color]');
  var labelAoMap = document.querySelector('input[name=label-ao]');
  var labelBumpMap = document.querySelector('input[name=label-bump]');
  var labelColorMap = document.querySelector('input[name=label-color]');
  var sleeveAoMap = document.querySelector('input[name=sleeve-ao]');
  var sleeveBumpMap = document.querySelector('input[name=sleeve-bump]');
  var sleeveColorMap = document.querySelector('input[name=sleeve-color]');

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

  vinylAoMap.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyl.aoMap(img);
    });
  };

  vinylBumpMap.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyl.bumpMap(img);
    });
  };

  vinylColorMap.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyl.colorMap(img);
    });
  };

  labelAoMap.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyl.labelAoMap(img);
    });
  };

  labelBumpMap.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyl.labelBumpMap(img);
    });
  };

  labelColorMap.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyl.labelColorMap(img);
    });
  };
  
  sleeveAoMap.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.sleeve.aoMap(img);
    });
  };

  sleeveBumpMap.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.sleeve.bumpMap(img);
    });
  };

  sleeveColorMap.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.sleeve.colorMap(img);
    });
  };
});

//
// observers. (for internal use)
//

vv.vinyl.on('colorFormat', function(value) {
  console.log('change vinyl.colorFormat', value);
});
vv.vinyl.on('color', function(value) {
  console.log('change vinyl.color', value);
});
vv.vinyl.on('size', function(value) {
  console.log('change vinyl.size', value);
});
vv.vinyl.on('labelType1', function(value) {
  console.log('change vinyl.labelType 1', value);
});
vv.sleeve.on('finish', function(value) {
  console.log('change sleeve.finish', value);
});

//
// utils.
//

var form = document.querySelector('form');
var show = document.querySelector('.action-show');

show.addEventListener('click', function(e) {
  form.classList.toggle('show');
}, false);
