
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
      speed: 45,
      label: true,
      transparent: true
    },
    {
      size: qvv.VinylVisualizer.VinylSize.SIZE_12,
      weight: qvv.VinylVisualizer.VinylWeight.NORMAL,
      isEnableLabel: false,
      colorFormat: qvv.VinylVisualizer.VinylColorFormat.COLOR,
      speed: 45,
      label: false,
      transparent: true
    }
  ],
  sleeve: {
    size: qvv.VinylVisualizer.SleeveSize.SIZE_12,
    format: qvv.VinylVisualizer.SleeveFormat.GATEFOLD,
    hole: true,
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
  loadModels: false,
  loadTextures: false,
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
    vv.world._vinyls[0].setColorFormat(colorFormat);
  });

  vm.$watch('vinyl.colorFormat2', function(colorFormat) {
    if (1 == vv.world._vinyls.length) {
      return;
    }

    vv.world._vinyls[1].setColorFormat(colorFormat);
  });

  vm.$watch('vinyl.size1', function(value) { 
    vv.setSize(value)
      .then(() => {
        console.log('size changed');
      });
  });

  vm.$watch('vinyl.size2', function(value) { 
    vv.setSize(value)
      .then(() => {
        console.log('size changed');
      });
  });

  vm.$watch('vinyl.colors', function(color) {

    vv.world._vinyls[0].setColor(color);

    if (1 == vv.world._vinyls.length) {
      return;
    }

    vv.world._vinyls[1].setColor(color);
  });

  vm.$watch('vinyl.heavy1', function(value) {

    var weight;

    if (!value) {
      weight = qvv.VinylVisualizer.VinylWeight.NORMAL;
    } else {
      weight = qvv.VinylVisualizer.VinylWeight.HEAVY;
    }

    vv.world._vinyls[0].setWeight(weight)
    .then((vinyl) => {
      console.log('vv.world._vinyls[0].setWeight: weight changed', vinyl);
    });
  });

  vm.$watch('vinyl.heavy2', function(value) {

    var weight;

    if (!value) {
      weight = qvv.VinylVisualizer.VinylWeight.NORMAL;
    } else {
      weight = qvv.VinylVisualizer.VinylWeight.HEAVY;
    }

    vv.world._vinyls[1].setWeight(weight)
      .then((vinyl) => {
        console.log('vv.world._vinyls[1].setWeight: weight changed', vinyl);
      });
  });

  vm.$watch('vinyl.label1', function(value) { 
    if (value === false) {
      vv.world._vinyls[0].disableLabel()
      .then((vinyl) => {
        console.log('vv.world._vinyls[0].enableLabel: disabled label', vinyl);
      });
    } else {
      vv.world._vinyls[0].enableLabel()
        .then((vinyl) => {
          console.log('vv.world._vinyls[0].enableLabel: enabled label', vinyl);
        });
    }
  });

  vm.$watch('vinyl.label2', (value) => {
    if (1 == vv.world._vinyls.length) {
      return;
    }

    if (value === false) {
      vv.world._vinyls[1].disableLabel()
      .then((vinyl) => {
        console.log('vv.world._vinyls[1].enableLabel: disabled label');
      });
    } else {
      vv.world._vinyls[1].enableLabel()
        .then((vinyl) => {
          console.log('vv.world._vinyls[1].enableLabel: enabled label');
        });
    }
  });

  vm.$watch('vinyl.speed', (value) => {
    vv.world._vinyls.forEach((vinyl) => {
      vinyl.setRPM(value);
    });
  });

  vm.$watch('sleeve.size', (value) => {
    vv.setSize(value) 
  });

  vm.$watch('sleeve.type', function (value) {
    vv.world.setSleeveFormat(value)
      .then((format) => {
        console.log('sleeve format changed: ', format);
      });
  });

  vm.$watch('sleeve.colorFormat', (value) => {
    vv.world._sleeve.setColorFormat(value);
  });

  vm.$watch('sleeve.hole', (value) => {
    vv.world._sleeve.setHole(value)
      .then((sleeve) => {
        console.log('vv.world._sleeve.setHole: hole option changed', sleeve);
      });
  });

  vm.$watch('sleeve.finish', (value) => {
    vv.world._sleeve.setFinish(value);
  });

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
      vv.world._vinyls[0].setAlphaMap(img);
    });
  };

  vinylAoMap1.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.world._vinyls[0].setAoMap(img);
    });
  };

  vinylBumpMap1.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.world._vinyls[0].setBumpMap(img);
    });
  };

  vinylColorMap1.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.world._vinyls[0].setColorMap(img);
    });
  };

  vinylAlphaMap2.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);

      if (1 == vv.world._vinyls.length) {
        return;
      }

      vv.world._vinyls[1].setAlphaMap(img);
    });
  };

  vinylAoMap2.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);

      if (1 == vv.world._vinyls.length) {
        return;
      }

      vv.world._vinyls[1].setAoMap(img);
    });
  };

  vinylBumpMap2.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);

      if (1 == vv.world._vinyls.length) {
        return;
      }

      vv.world._vinyls[1].setBumpMap(img);
    });
  };

  vinylColorMap2.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);

      if (1 == vv.world._vinyls.length) {
        return;
      }

      vv.world._vinyls[1].setColorMap(img);
    });
  };

  labelAoMap1.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.world._vinyls[0].setLabelAoMap(img);
    });
  };

  labelBumpMap1.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.world._vinyls[0].setLabelBumpMap(img);
    });
  };

  labelColorMap1.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.world._vinyls[0].setLabelColorMap(img);
    });
  };
  
  sleeveAoMap.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.world._sleeve.setAoMap(img);
    });
  };

  sleeveBumpMap.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      vv.world._sleeve.setBumpMap(img);
    });
  };

  sleeveColorMap.onchange = function(e) {
    load(e.target.files.item(0), function(err, img) {
      if (err) return console.error(err);
      
      console.log('sleeveColorMap.onchange', vv.world._sleeve.getFormat());

      if (qvv.VinylVisualizer.SleeveFormat.GATEFOLD === vv.world._sleeve.getFormat()) {
        vv.world._sleeve.setColorMap(img, 'front');
        vv.world._sleeve.setColorMap(img, 'back');
        vv.world._sleeve.setColorMap(img, 'spine');
      } else {
        vv.world._sleeve.setColorMap(img);        
      }
    });
  };
});

//
// utils.
//

var form = document.querySelector('form');
var show = document.querySelector('.action-show');

show.addEventListener('click', function(e) {
  form.classList.toggle('show');
}, false);
