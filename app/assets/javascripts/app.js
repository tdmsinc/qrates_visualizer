
//= require qrates_visualizer
//= require_self
const canvas_width = window.innerWidth, canvas_height = window.innerHeight;
//
// defaults
//
const defaults = {
  vinyl: [
    {
      size: qvv.VinylVisualizer.VinylSize.SIZE_12,
      weight: qvv.VinylVisualizer.VinylWeight.NORMAL,
      isEnableLabel: false,
      colorFormat: qvv.VinylVisualizer.VinylColorFormat.COLOR,
      speed: 45,
      label: true,
      transparent: true,
      // side: THREE.DoubleSide
    },
    // {
    //   size: qvv.VinylVisualizer.VinylSize.SIZE_12,
    //   weight: qvv.VinylVisualizer.VinylWeight.NORMAL,
    //   isEnableLabel: false,
    //   colorFormat: qvv.VinylVisualizer.VinylColorFormat.COLOR,
    //   speed: 45,
    //   label: false,
    //   transparent: true
    // }
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
const el = document.querySelector('.vinyl-visualizer-container');
const vv = new qvv.VinylVisualizer(el, {
  width: canvas_width,
  height: canvas_height,
  pixelRatio: window.devicePixelRatio || 1,
  loadModels: false,
  loadTextures: false,
  view: 0,
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

const vm = new Vue({ el: 'form', data: defaults });

//
// ready to use vinyl visualizer
//

vv.on('ready', () => {

  console.log('visualizer is ready.');

  //
  // delegate resize.
  //

  window.addEventListener('resize', e => {
    vv.resize(e.target.innerWidth, e.target.innerHeight);
  }, false);

  //
  // delegate events
  //

  vm.$watch('visualizer.width', value => {
    vv.resize(value, vm.$get('visualizer.height'));
  });

  vm.$watch('visualizer.height', value => {
    vv.resize(vm.$get('visualizer.width'), value);
  });

  vm.$watch('visualizer.view', value => {
    vv.view(value, { transition: vm.$get('visualizer.transition') });
  });

  vm.$watch('visualizer.capture', value => {
    const opts = {
      canvas_width: 1280,
      canvas_height: 794,
      duration: 0
    };
    vv.view(value, {duration:0});
  });

  vm.$watch('vinyl.colorFormat1', colorFormat => {
    vv.world._vinyls[0].setColorFormat(colorFormat)
      .then(() => {
        vv.world._vinyls[0].setRenderOrder(10);
        vv.world._vinyls[1].setRenderOrder(100);
      });
  });

  vm.$watch('vinyl.colorFormat2', colorFormat => {
    if (1 == vv.world._vinyls.length) {
      return;
    }

    vv.world._vinyls[1].setColorFormat(colorFormat)
      .then(() => {
        vv.world._vinyls[0].setRenderOrder(10);
        vv.world._vinyls[1].setRenderOrder(100);
      });
  });

  vm.$watch('vinyl.size1', value => { 
    vv.setSize(value)
      .then(() => {
        console.log('size changed');
      });
  });

  vm.$watch('vinyl.size2', value => { 
    vv.setSize(value)
      .then(() => {
        console.log('size changed');
      });
  });

  vm.$watch('vinyl.colors', index => {

    vv.world._vinyls[0].setColor(index);

    if (1 == vv.world._vinyls.length) {
      return;
    }

    vv.world._vinyls[1].setColor(index);
  });

  vm.$watch('vinyl.heavy1', value => {

    let weight;

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

  vm.$watch('vinyl.heavy2', value => {

    let weight;

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

  vm.$watch('vinyl.label1', value => { 
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

  vm.$watch('vinyl.label2', value => {
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

  vm.$watch('vinyl.speed', value => {
    vv.world._vinyls.forEach((vinyl) => {
      vinyl.setRPM(value);
    });
  });

  vm.$watch('sleeve.size', value => {
    vv.setSize(value)
      .then(world => {
        console.log('size changed');
      });
  });

  vm.$watch('sleeve.type', value => {
    vv.world.setSleeveFormat(value)
      .then((format) => {
        console.log('sleeve format changed: ', format);
      });
  });

  vm.$watch('sleeve.colorFormat', value => {
    vv.world._sleeve.setColorFormat(value);
  });

  vm.$watch('sleeve.hole', value => {
    vv.world.setSleeveHole(value);
  });

  vm.$watch('sleeve.finish', value => {
    vv.world._sleeve.setFinish(value);
  });

  //
  // file watcher
  //

  const vinylAlphaMap1 = document.querySelector('input[name=vinyl-alpha1]');
  const vinylAoMap1 = document.querySelector('input[name=vinyl-ao1]');
  const vinylBumpMap1 = document.querySelector('input[name=vinyl-bump1]');
  const vinylColorMap1 = document.querySelector('input[name=vinyl-color1]');
  const vinylAlphaMap2 = document.querySelector('input[name=vinyl-alpha2]');
  const vinylAoMap2 = document.querySelector('input[name=vinyl-ao2]');
  const vinylBumpMap2 = document.querySelector('input[name=vinyl-bump2]');
  const vinylColorMap2 = document.querySelector('input[name=vinyl-color2]');
  const labelAoMap1 = document.querySelector('input[name=label-ao1]');
  const labelBumpMap1 = document.querySelector('input[name=label-bump1]');
  const labelColorMap1 = document.querySelector('input[name=label-color1]');
  const sleeveAoMap = document.querySelector('input[name=sleeve-ao]');
  const sleeveBumpMap = document.querySelector('input[name=sleeve-bump]');
  const sleeveColorMap = document.querySelector('input[name=sleeve-color]');

  /**
   * @param {File} file
   * @param {Function} callback
   */

  function load(file, callback) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onerror =
      img.onabort = e => {
        callback(e);
      };
      img.onload = e => {
        callback(null, e.target);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  vinylAlphaMap1.onchange = e => {
    load(e.target.files.item(0), (err, img) => {
      if (err) return console.error(err);
      vv.world._vinyls[0].setAlphaMap(img);
    });
  };

  vinylAoMap1.onchange = e => {
    load(e.target.files.item(0), (err, img) => {
      if (err) return console.error(err);
      vv.world._vinyls[0].setAoMap(img);
    });
  };

  vinylBumpMap1.onchange = e => {
    load(e.target.files.item(0), (err, img) => {
      if (err) return console.error(err);
      vv.world._vinyls[0].setBumpMap(img);
    });
  };

  vinylColorMap1.onchange = e => {
    load(e.target.files.item(0), (err, img) => {
      if (err) return console.error(err);
      vv.world._vinyls[0].setColorMap(img);
    });
  };

  vinylAlphaMap2.onchange = e => {
    load(e.target.files.item(0), (err, img) => {
      if (err) return console.error(err);

      if (1 == vv.world._vinyls.length) {
        return;
      }

      vv.world._vinyls[1].setAlphaMap(img);
    });
  };

  vinylAoMap2.onchange = e => {
    load(e.target.files.item(0), (err, img) => {
      if (err) return console.error(err);

      if (1 == vv.world._vinyls.length) {
        return;
      }

      vv.world._vinyls[1].setAoMap(img);
    });
  };

  vinylBumpMap2.onchange = e => {
    load(e.target.files.item(0), (err, img) => {
      if (err) return console.error(err);

      if (1 == vv.world._vinyls.length) {
        return;
      }

      vv.world._vinyls[1].setBumpMap(img);
    });
  };

  vinylColorMap2.onchange = e => {
    load(e.target.files.item(0), (err, img) => {
      if (err) return console.error(err);

      if (1 == vv.world._vinyls.length) {
        return;
      }

      vv.world._vinyls[1].setColorMap(img);
    });
  };

  labelAoMap1.onchange = e => {
    load(e.target.files.item(0), (err, img) => {
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

  labelColorMap1.onchange = e => {
    load(e.target.files.item(0), (err, img) => {
      if (err) return console.error(err);
      vv.world._vinyls[0].setLabelColorMap(img);
    });
  };
  
  sleeveAoMap.onchange = e => {
    load(e.target.files.item(0), (err, img) => {
      if (err) return console.error(err);

      if (qvv.VinylVisualizer.SleeveFormat.GATEFOLD === vv.world._sleeve.getFormat()) {
        vv.world._sleeve.setAoMap(img, 'front');
        vv.world._sleeve.setAoMap(img, 'back');
        vv.world._sleeve.setAoMap(img, 'spine');
      } else {
        vv.world._sleeve.setAoMap(img);    
      }
    });
  };

  sleeveBumpMap.onchange = e => {
    load(e.target.files.item(0), (err, img) => {
      if (err) return console.error(err);

      if (qvv.VinylVisualizer.SleeveFormat.GATEFOLD === vv.world._sleeve.getFormat()) {
        vv.world._sleeve.setBumpMap(img, 'front');
        vv.world._sleeve.setBumpMap(img, 'back');
        vv.world._sleeve.setBumpMap(img, 'spine');
      } else {
        vv.world._sleeve.setBumpMap(img);    
      }
    });
  };

  sleeveColorMap.onchange = e => {
    load(e.target.files.item(0), (err, img) => {
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

const form = document.querySelector('form');
const show = document.querySelector('.action-show');

show.addEventListener('click', e => {
  form.classList.toggle('show');
}, false);
