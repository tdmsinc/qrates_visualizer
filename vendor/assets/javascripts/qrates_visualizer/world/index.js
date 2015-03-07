
//= require tdmsinc-three.js
//= require ../emitter
//= require_tree .
//= require_self

(function(global, exports) {
  var gui, axes;

  var props = {
    color: 0xFFFFFF,
    size: 12,
    label: null,
    render: true,
    rotate: false,
    sleeve: true,
    out: false,
    zoom: 1.0,
    'covered ratio': 0.8,
    bumpScale: 0.282,
    sleeveX: -15
  };

  var cameraProps = {
    x:0.0, y: 17.0, z: 30.0,
  };

  var colors = [
    { color: 0x000000, opacity: 1.0 },
    { color: 0xFFFFFF, opacity: 1.0 },
    { color: 0xF3EA5D, opacity: 1.0 },
    { color: 0xDA291C, opacity: 1.0 },
    { color: 0xFF8F1C, opacity: 1.0 },
    { color: 0x0085CA, opacity: 1.0 },
    { color: 0x7A3E3A, opacity: 1.0 },
    { color: 0xA4D65E, opacity: 1.0 },
    { color: 0x9EA2A2, opacity: 1.0 },
    { color: 0x00AF66, opacity: 0.85 },
    { color: 0xEFDF00, opacity: 0.85 },
    { color: 0xDA291C, opacity: 0.85 },
    { color: 0x833177, opacity: 0.85 },
    { color: 0x0085CA, opacity: 0.85 },
    { color: 0xFFFFFF, opacity: 0.85 }
  ];

  /**
   * Module dependencies.
   */

  var Emitter = exports.Emitter;
  var Vinyl   = exports.world.Vinyl;
  var Label   = exports.world.Label;
  var Sleeve  = exports.world.Sleeve;

  /**
   * Expose `World`.
   */

  exports.World = World;

  /**
   * @param {VisualEditor} parent
   * @param {Object} assets
   * @param {Object} opts
   * @api public
   */

  function World(parent, assets, opts) {
    this._parent = parent;
    this._assets = assets;
    this._opts = opts || {
      renderer: {
        antialias: true,
        preserveDrawingBuffer: true,
        rpm: 45
      }
    };

    this._isRendering = false;

    this._scene = new THREE.Scene();

    this._camera = new THREE.PerspectiveCamera(this._opts.camera.fov, this._opts.camera.aspect, this._opts.camera.near, this._opts.camera.far);
    this._camera.lookAt(new THREE.Vector3(0, 0, 0));

    this._renderer = new THREE.WebGLRenderer(this._opts.renderer);
    this._renderer.setSize(this._opts.width, this._opts.height);
    this._renderer.setClearColor(0, 0.0);

    this._orbitControls = new THREE.OrbitControls(this._camera);
    this._orbitControls.target = new THREE.Vector3(0, 0, 0);
    this._orbitControls.update();

    this.initGui();
    this._lights = this.createLights();
    this._scene.add(this._lights);

    var shadowTexture = this.shadowTexture = new THREE.Texture();
    shadowTexture.image = assets['assetsTextureShadow'];
    shadowTexture.needsUpdate = true;
    var pgeometry = new THREE.PlaneGeometry(300, 300);
    var pmaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, map: shadowTexture });
    var ground = new THREE.Mesh(pgeometry, pmaterial);
    ground.position.set(0, -80, 0);
    ground.rotation.x = 90 * Math.PI / 180;
    // ground.receiveShadow = true;
    // this._scene.add(ground);

    var size = 7;

    this.enableRotate = false;
    this.rotationAmount = 0;

    this._sleeve = new Sleeve();
    this._sleeve.setup(this._scene, assets, { size: size });
    this._sleeve.setCoveredRatio(0.8);

    this._vinyl = new Vinyl();
    this._vinyl.setup(this._scene, assets, { size: size, color: 0xFFFFFF });

    this._label = new Label();
    this._label.setup(this._scene, assets, { size: size });

    this._rpm = opts.defaults.vinyl.speed;

    this._clock = new THREE.Clock();

    this.setCameraPosition(0, 409, 106);
  }

  /**
   * Mixin `Emitter`.
   */

  Emitter(World.prototype);

  /**
   *
   */

  World.prototype.getRenderer = function() {
    return this._renderer;
  };

  World.prototype.createLights = function() {
    var lights = new THREE.Object3D();

    var spotLight1 = new THREE.SpotLight(0xFFFFFF, 0.4, 0, 0.314, 10);
    spotLight1.position.set(335, 1955, 475);
    lights.add(spotLight1);

    var spotLight2 = new THREE.SpotLight(0xFFFFFF, 0.4, 0, 0.314, 10);
    spotLight2.position.set(-980, 1900, -880);
    lights.add(spotLight2);

    var pointLight1 = new THREE.PointLight(0xFFFFFF, 0.4, 0);
    pointLight1.position.set(25, 10, -2300);
    lights.add(pointLight1);

    var pointLight2 = new THREE.PointLight(0xFFFFFF, 0.4, 0);
    pointLight2.position.set(-2, -160, 1480);
    lights.add(pointLight2);

    var hemisphereLight1 = new THREE.HemisphereLight(0x080E21, 0x2E1B11, 0.2);
    hemisphereLight1.position.set(380, 140, -1225);
    lights.add(hemisphereLight1);

    var hemisphereLight2 = new THREE.HemisphereLight(0x120C17, 0x220A0E, 0.2);
    hemisphereLight2.position.set(-360, 60, 1285);
    lights.add(hemisphereLight2);

    var ambientLight = new THREE.AmbientLight(0x0D0D0D);
    ambientLight.position.set(0, 820, 2);
    lights.add(ambientLight);

    return lights;
  };

  /**
   *
   */

  World.prototype.initGui = function() {
    if (!window.dat) {
      console.warn('dat.GUI is not loaded');
      return false;
    }

    var self = this;
    var axes = this.axes;
    var camera = this._camera;

    var temp = {
      capture: function() {
        self.capture();
      },
      'zoom in': function() {
        self.zoomIn(1);
      },
      'zoom out': function() {
        self.zoomOut(1);
      }
    };

    var gui = this.gui = new window.dat.GUI();
    var renderController = gui.add(props, 'render');
    var rotationController = gui.add(props, 'rotate');
    var outFromSleeveController = gui.add(props, 'covered ratio', 0.0, 1.0);
    var sleeveVisibilityController = gui.add(props, 'sleeve');
    var captureController = gui.add(temp, 'capture');
    var zoomController = gui.add(props, 'zoom', 0, 400);
    var cameraXController = gui.add(cameraProps, 'x', -1000, 1000);
    var cameraYController = gui.add(cameraProps, 'y', -1000, 1000);
    var cameraZController = gui.add(cameraProps, 'z', -1000, 1000);
    var bumpScaleController = gui.add(props, 'bumpScale', 0, 1.0);

    gui.add(this, 'lookReverse').name('flip');

    gui.add(temp, 'zoom in');
    gui.add(temp, 'zoom out');

    renderController.onChange(function(value) {
      if (value) {
        self.startRender();
      } else {
        self.stopRender();
      }
    });

    rotationController.onChange(function(value) {
      self.enableRotate = value;
    });

    outFromSleeveController.onChange(function(value) {
      self.cover(value);
    });

    sleeveVisibilityController.onChange(function(value) {
      self.setSleeveVisibility(value, null, function() {
        console.log('sleeve visibility is changed');
      });
    });

    zoomController.onChange(function(value) {
      self.zoom(value);
    });

    bumpScaleController.onChange(function(value) {
      if (!self._vinyl) {
        return;
      }

      self._vinyl.setBumpScale(value);
    });
  };

  World.prototype.setCameraPosition = function(tx, ty, tz, opts, callback) {
    if (!callback) {
      callback = null;
    }

    opts = opts || {
      durarion: 1000
    };

    var self = this;

    // self.startRender();

    new TWEEN.Tween(this._camera.position)
      .to({ x: tx, y: ty, z: tz }, opts.duration || 1000)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function() {
        self._camera.lookAt(new THREE.Vector3(0, 0, 0));
        self._vinyl.setBumpScale(Math.max(self._camera.position.z / 500, 0.1));
      })
      .onComplete(function() {
        // self.stopRender();
        if (callback) callback();
      })
      .start();
  };

  World.prototype.setSleeveVisibility = function(yn, opts, callback) {
    opts = opts || {
      durarion: 1000
    };

    var self = this;

    // self.startRender();

    this._sleeve.setVisible(yn, opts, function() {
      // self.stopRender();
    });
  };

  World.prototype.lookReverse = function(value) {
    console.log('World::lookReverse', value);

    this._orbitControls.rotateLeft(Math.PI);
  };

  World.prototype.lookAround = function(value) {
    console.log('World::lookAround', value);
  };

  World.prototype.cover = function(value) {
    this._sleeve.setCoveredRatio(value);
  };

  World.prototype.zoomIn = function(step) {
    this._orbitControls.dollyIn(1.02 * (step || 1));
  };

  World.prototype.zoomOut = function(step) {
    this._orbitControls.dollyOut(1.02 * (step || 1));
  };

  World.prototype.capture = function(opts, callback) {
    console.log('World::capture');

    var image = new Image();
    image.src = this._renderer.domElement.toDataURL('image/png');
    image.onload = function() {
      if (callback) callback(null, this);
    };
  };

  World.prototype.resize = function(width, height) {
    console.log('World::resize');
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(width, height);
    this.draw();
  };

  /**
   *
   */
  World.prototype.play = function() {
    console.log('World::play');
    this.enableRotate = true;
  };

  /**
   *
   */
  World.prototype.pause = function() {
    console.log('World::pause');
    this.enableRotate = false;
  };

  /**
   *
   */
  World.prototype.updateView = function(type, opts, callback) {
    console.log('World::updateView', type);

    var self = this;

    switch (Number(type)) {
      case 1:
        this.setCameraPosition(0, 400, 100, opts, callback);
        break;
      case 2:
        this.setCameraPosition(0, 180, 1, opts, callback);
        break;
      case 3:
        this.setCameraPosition(0, 0, 180, opts, callback);
        break;
      case 4:
        this.setCameraPosition(127, 192, 214, opts, callback);
        break;
      case 5:
        this.setCameraPosition(0, 386.4, -3.5, opts, callback);
        break;
      case 6:
        this.setCameraPosition(0, 346.3, -100, opts, callback);
        break;
      case 7:
        this.setCameraPosition(0, 282.6, -182.9, opts, callback);
        break;
      case 8:
        this.setCameraPosition(0, 199.8, -246.4, opts, callback);
        break;
      default:
        break;
    }
  };

  /**
   *
   */
  World.prototype.startRender =
  World.prototype.resumeRender = function() {
    console.log('World::startRender', this._request);
    if (!this._request) {
      this._isRendering = true;
      this._request = requestAnimationFrame(this.draw.bind(this));
    }

    return this;
  };

  /**
   *
   */
  World.prototype.stopRender = function() {
    console.log('World::stopRender', this._request);
    if (this._request) {
      this._isRendering = false;
      this._request = cancelAnimationFrame(this._request);
    }
    
    return this;
  };

  /**
   *
   */
  World.prototype.update = function() {
    var amount = this._clock.getDelta() * (Math.PI * (this._rpm / 60));

    if (this.enableRotate) {
      this.rotationAmount = Math.min(this.rotationAmount + 0.001, 0.07);
    } else {
      this.rotationAmount = Math.max(this.rotationAmount - 0.001, 0);
    }

    if (this._sleeve) {
      this._sleeve.update();
    }

    if (this._vinyl) {
      if (this.enableRotate) {
        this._vinyl._rotation.y -= amount;
      }

      this._vinyl.update();
    }

    if (this._label) {
      if (this.enableRotate) {
        this._label.rotation.y -= amount;
      }
      this._label.update();
    }

    TWEEN.update();

    this._orbitControls.update();
  };

  /**
   *
   */
  World.prototype.draw = function() {
    if (!this._isRendering) {
      return;
    }

    this.update();
    this._renderer.render(this._scene, this._camera);
    this._request = requestAnimationFrame(this.draw.bind(this));
  };

  /**
   *
   */
  World.prototype.delegateEvents = function() {
    var parent = this._parent;

    parent.vinyl.on('type', this.onVinylTypeChanged.bind(this));
    parent.vinyl.on('size', this.onVinylSizeChanged.bind(this));
    parent.vinyl.on('color', this.onVinylColorChanged.bind(this));
    parent.vinyl.on('splatterColor', this.onVinylSplatterColorChanged.bind(this));
    parent.vinyl.on('holeSize', this.onVinylHoleSizeChanged.bind(this));
    parent.vinyl.on('heavy', this.onVinylHeavyChanged.bind(this));
    parent.vinyl.on('speed', this.onVinylSpeedChanged.bind(this));
    parent.vinyl.on('sideATexture', this.onVinylSideATextureChanged.bind(this));
    parent.vinyl.on('sideBTexture', this.onVinylSideBTextureChanged.bind(this));
    parent.vinyl.on('bumpMapTexture', this.onVinylBumpMapTextureChanged.bind(this));
    parent.vinyl.on('sideABumpMapTexture', this.onVinylSideABumpMapTextureChanged.bind(this));
    parent.vinyl.on('sideBBumpMapTexture', this.onVinylSideBBumpMapTextureChanged.bind(this));

    parent.label.on('type', this.onLabelTypeChanged.bind(this));
    parent.label.on('sideATexture', this.onLabelSideATextureChanged.bind(this));
    parent.label.on('sideBTexture', this.onLabelSideBTextureChanged.bind(this));

    parent.sleeve.on('type', this.onSleeveTypeChanged.bind(this));
    parent.sleeve.on('hole', this.onSleeveHoleChanged.bind(this));
    parent.sleeve.on('glossFinish', this.onSleeveGlossFinishChanged.bind(this));
    parent.sleeve.on('frontTexture', this.onSleeveFrontTextureChanged.bind(this));
    parent.sleeve.on('backTexture', this.onSleeveBackTextureChanged.bind(this));
    parent.sleeve.on('spineTexture', this.onSleeveSpineTextureChanged.bind(this));

    return this;
  };

  World.prototype.undelegateEvents = function() {
    var parent = this._parent;

    return this;
  };

  World.prototype.onVinylTypeChanged = function(value) {
    console.log('World::onVinylTypeChanged', value);

    if (1 === value) {
      this._vinyl.setColorMode(this._vinyl.COLOR_MODE_BLACK);
    } else if (2 === value) {
      this._vinyl.setColorMode(this._vinyl.COLOR_MODE_COLOR);
    } else if (3 === value) {
      this._vinyl.setColorMode(this._vinyl.COLOR_MODE_SPLATTER);
    }
  };

  World.prototype.onVinylSizeChanged = function(value) {
    console.log('World::onVinylSizeChanged', value);
    var size;

    if (1 == value) {
      size = 7;
    } else if (2 == value) {
      size = 10;
    } else if (3 == value) {
      size = 12;
    }

    this._sleeve.setSize(size);
    this._vinyl.setSize(size);
    this._label.setSize(size);
  };

  World.prototype.onVinylColorChanged = function(value) {
    console.log('World::onVinylColorChanged', value);

    this._vinyl.setColor(colors[value].color);
  };

  World.prototype.onVinylSplatterColorChanged = function(value) {
    console.log('World::onVinylSplatterColorChanged', value);

    this._vinyl.setColor(colors[value].color);
  };

  World.prototype.onVinylHoleSizeChanged = function(value) {
    console.log('World::onVinylHoleSizeChanged', value);

    this._label.setLargeHole(0 === value ? false : true);
  };

  World.prototype.onVinylHeavyChanged = function(value) {
    console.log('World::onVinylHeavyChanged', value);
  };

  World.prototype.onVinylSpeedChanged = function(value) {
    console.log('World::onVinylSpeedChanged', value);

    this._rpm = value;
  };

  World.prototype.onVinylSideATextureChanged = function(value) {
    console.log('World::onVinylSideATextureChanged');

    this._vinyl.setTexture(value);
  };

  World.prototype.onVinylSideBTextureChanged = function(value) {
    console.log('World::onVinylSideBTextureChanged', value);

    this._vinyl.setTexture(null, value);
  };

  World.prototype.onVinylBumpMapTextureChanged = function(value) {
    console.log('World::onVinylBumpMapTextureChanged');

    this._vinyl.setBumpMapTexture(value);
  };

  World.prototype.onVinylSideABumpMapTextureChanged = function(value) {
    console.log('World::onVinylSideABumpMapTextureChanged');

    this._vinyl.setSideABumpMapTexture(value);
  };

  World.prototype.onVinylSideBBumpMapTextureChanged = function(value) {
    console.log('World::onVinylSideBBumpMapTextureChanged');

    this._vinyl.setSideBBumpMapTexture(value);
  };

  World.prototype.onLabelTypeChanged = function(value) {
    console.log('World::onLabelTypeChanged', value);

    var types = [this._label.TYPE_WHITE, this._label.TYPE_PRINT_MONOCHROME, this._label.TYPE_PRINT_COLOR];
    this._label.setType(types[value - 1]);
  };

  World.prototype.onLabelSideATextureChanged = function(value) {
    console.log('World::onLabelSideATextureChanged');

    this._label.setTexture(value, null);
  };

  World.prototype.onLabelSideBTextureChanged = function(value) {
    console.log('World::onLabelSideBTextureChanged', value);

    this._label.setTexture(null, value);
  };

  World.prototype.onSleeveTypeChanged = function(value) {
    console.log('World::onSleeveTypeChanged', value);

    var types = [this._sleeve.TYPE_BLACK, this._sleeve.TYPE_WHITE, this._sleeve.TYPE_PRINT, this._sleeve.TYPE_PRINT_SPINE];
    this._sleeve.setType(types[value - 1]);
  };

  World.prototype.onSleeveHoleChanged = function(value) {
    console.log('World::onSleeveHoleChanged', value);

    this._sleeve.setHole(value);
  };

  World.prototype.onSleeveGlossFinishChanged = function(value) {
    console.log(value);
  };

  World.prototype.onSleeveFrontTextureChanged = function(value) {
    console.log('World::onSleeveFrontTextureChanged');

    this._sleeve.setTexture(value, null);
  };

  World.prototype.onSleeveBackTextureChanged = function(value) {
    console.log('World::onSleeveBackTextureChanged');

    this._sleeve.setTexture(null, value);
  };

  World.prototype.onSleeveSpineTextureChanged = function(value) {
    console.log('World::onSleeveSpineTextureChanged');
  };
})(this, (this.qvv = (this.qvv || {})));
