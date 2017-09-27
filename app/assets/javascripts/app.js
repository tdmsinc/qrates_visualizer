
//= require qrates_visualizer
//= require_self
var canvas_width = window.innerWidth, canvas_height = window.innerHeight;
//
// defaults
//
var defaults = {
  vinyl: [
    {
      size: qvv.VinylVisualizer.VinylSize.SIZE_12,
      weight: qvv.VinylVisualizer.VinylWeight.NORMAL,
      isEnableLabel: false,
      colorFormat: qvv.VinylVisualizer.VinylColorFormat.COLOR,
      speed: 45
    },
    {
      size: qvv.VinylVisualizer.VinylSize.SIZE_12,
      weight: qvv.VinylVisualizer.VinylWeight.NORMAL,
      isEnableLabel: false,
      colorFormat: qvv.VinylVisualizer.VinylColorFormat.COLOR,
      speed: 45
    }
  ],
  sleeve: {
    size: qvv.VinylVisualizer.SleeveSize.SIZE_12,
    format: qvv.VinylVisualizer.SleeveFormat.DOUBLE,
    hole: qvv.VinylVisualizer.SleeveHole.HOLED,
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

  vm.$watch('vinyl.colorFormat1', function(colorFormat) {
    vv.vinyls[0].colorFormat(colorFormat);
  });

  vm.$watch('vinyl.colorFormat2', function(colorFormat) {
    vv.vinyl[1].colorFormat(colorFormat);
  });

  vm.$watch('vinyl.size1', function(value) { 
    vv.vinyls[0].size(value);
  });

  vm.$watch('vinyl.size2', function(value) { 
    vv.vinyls[1].size(value);
  });

  vm.$watch('vinyl.colors', function(color) {

    vv.vinyls[0].color(color);
    vv.vinyls[1].color(color);
  });

  vm.$watch('vinyl.holeSize', function(value) { vv.vinyl.holeSize(value); });

  vm.$watch('vinyl.heavy1', function(value) {

    var weight;

    if (!value) {
      weight = qvv.VinylVisualizer.VinylWeight.NORMAL;
    } else {
      weight = qvv.VinylVisualizer.VinylWeight.HEAVY;
    }

    vv.vinyls[0].weight(weight);
  });

  vm.$watch('vinyl.heavy2', function(value) {

    var weight;

    if (!value) {
      weight = qvv.VinylVisualizer.VinylWeight.NORMAL;
    } else {
      weight = qvv.VinylVisualizer.VinylWeight.HEAVY;
    }

    vv.vinyls[1].weight(weight);
  });

  vm.$watch('vinyl.label1', function(value) { 
    vv.vinyls[0].label(value);
  });

  vm.$watch('vinyl.label2', function(value) {
    vv.vinyls[1].label(value);
  });

  vm.$watch('vinyl.speed', function(value) {
    vv.vinyls.forEach(function (vinyl) {
      vinyl.speed(value);
    });
  });

  vm.$watch('sleeve.type', function(value) { vv.sleeve.type(value); });
  vm.$watch('sleeve.colorFormat', function(value) { vv.sleeve.colorFormat(value); });
  vm.$watch('sleeve.hole', function(value) { vv.sleeve.hole(value); });
  vm.$watch('sleeve.finish', function(value) { vv.sleeve.finish(value); });

  //
  // file watcher
  //

  var vinylAlphaMap1 = document.querySelector('input[name=vinyl-alpha1]');
  var vinylAoMap1 = document.querySelector('input[name=vinyl-ao1]');
  var vinylBumpMap1 = document.querySelector('input[name=vinyl-bump1]');
  var vinylColorMap1 = document.querySelector('input[name=vinyl-color1]');
  var vinylAlphaMap2 = document.querySelector('input[name=vinyl-alpha2]');
  var vinylAoMap2 = document.querySelector('input[name=vinyl-ao2]');
  var vinylBumpMap2 = document.querySelector('input[name=vinyl-bump2]');
  var vinylColorMap2 = document.querySelector('input[name=vinyl-color2]');
  var labelAoMap1 = document.querySelector('input[name=label-ao1]');
  var labelBumpMap1 = document.querySelector('input[name=label-bump1]');
  var labelColorMap1 = document.querySelector('input[name=label-color1]');
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

  vinylAlphaMap1.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyls[0].alphaMap(img);
    });
  };

  vinylAoMap1.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyls[0].aoMap(img);
    });
  };

  vinylBumpMap1.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyls[0].bumpMap(img);
    });
  };

  vinylColorMap1.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyls[0].colorMap(img);
    });
  };

  vinylAlphaMap2.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyls[1].alphaMap(img);
    });
  };

  vinylAoMap2.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyls[1].aoMap(img);
    });
  };

  vinylBumpMap2.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyls[1].bumpMap(img);
    });
  };

  vinylColorMap2.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyls[1].colorMap(img);
    });
  };

  labelAoMap1.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyls[0].labelAoMap(img);
    });
  };

  labelBumpMap1.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyls[0].labelBumpMap(img);
    });
  };

  labelColorMap1.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.vinyls[0].labelColorMap(img);
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
for (var i in vv.vinyls) {
  vv.vinyls[i].on('colorFormat', function(value) {
    console.log('change vinyl.colorFormat', value);
  });
  vv.vinyls[i].on('color', function(value) {
    console.log('change vinyl.color', value);
  });
  vv.vinyls[i].on('size', function(value) {
    console.log('change vinyl.size', value);
  });
  vv.vinyls[i].on('labelType1', function(value) {
    console.log('change vinyl.labelType 1', value);
  });
}

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
