
//= require tdmsinc-three.js
//= require ../emitter
//= require_tree .
//= require_self

(function (global, exports) {
  var gui, axes;

  /**
   * Module dependencies.
   */

  var Emitter = exports.Emitter;
  var Vinyl = exports.world.Vinyl;
  var Sleeve = exports.world.Sleeve;

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

  //--------------------------------------------------------------
  function World(parent, assets, opts) {

    if (window.Stats) {
      this._stats = new window.Stats();
      this._stats.domElement.setAttribute('class', 'stats');
      document.body.appendChild(this._stats.domElement);
    }

    this._parent = parent;
    this._assets = assets;

    this._opts = opts || {
      renderer: {
        antialias: true,
        preserveDrawingBuffer: true,
      }
    };

    this._objectScales = {
      '7': 1,
      '10': 0.6890566038,
      '12': 0.5833865815
    };

    this._width = opts.width;
    this._height = opts.height;

    this._isRendering = false;

    this._scene = new THREE.Scene();

    this._camera = new THREE.CombinedCamera(this._width / 2, this._height / 2, this._opts.camera.fov, this._opts.camera.near, this._opts.camera.far, -500, this._opts.camera.far);
    this._camera.lookAt(new THREE.Vector3(0, 0, 0));
    this._camera.position.set(212, 288, 251);
    this._orthographicZoom = 170;

    if ('orthographic' === this._opts.camera.type) {
      this.setOrthographic();
    }

    this._renderer = new THREE.WebGLRenderer(this._opts.renderer);
    this._renderer.setPixelRatio(this._opts.pixelRatio || window.devicePixelRatio || 1);
    this._renderer.setSize(this._width, this._height);
    this._renderer.autoClear = false;
    this._renderer.setClearColor(0, 0.0);

    this._opts.camera.control = undefined !== this._opts.camera.control ? this._opts.camera.control : true;

    this._controls = new THREE.TrackballControls(this._camera, this._parent.el);
    this._controls.minDistance = 100;
    this._controls.maxDistance = 700;
    this._controls.target = new THREE.Vector3(0, 0, 0);
    this._controls.handleResize({ left: 0, top: 0, width: opts.width, height: opts.height });
    this._controls.update();
    this._controls.enabled = this._opts.camera.control;

    this._lights = this.createLights();

    this._enableRotate = false;
    this._flip = false;

    // sleeve と vinyl がぶら下がるコンテナ
    this._containerObject = new THREE.Object3D();
    this._containerObject.name = 'container';

    // sleeve
    this._sleeve = new Sleeve();
    this._sleeve.setup(this._scene, assets, opts.defaults.sleeve, this._containerObject);

    // vinyl
    this._vinyls = [];

    // sleeve が single で複数の vinyl オプションが渡された場合は2つ目以降のオプションを削除して single フォーマットを採用する
    if ((Sleeve.Format.SINGLE_WITHOUT_SPINE === opts.defaults.sleeve.format || Sleeve.Format.SINGLE === opts.defaults.sleeve.format) && 1 < opts.defaults.vinyl.length) {
      console.warn('World: too many options for vinyl');

      opts.defaults.vinyl.pop();
      opts.defaults.vinyl.length = 1;
    }

    // vinyl オプションから vinyl を生成
    for (var i in opts.defaults.vinyl) {
      opts.defaults.vinyl[i].index = Object.values(Vinyl.Index)[i];

      this._vinyls.push(new Vinyl());
      this._vinyls[i].setup(this._scene, this._assets, this._opts.defaults.vinyl[i], this._containerObject);
    }

    // scale を設定
    var scale = this._objectScales[this._vinyls[0]._size];
    this._containerObject.scale.set(scale, scale, scale);
    this._containerObject.position.set(0, 0, 0);

    this._flipRotation = 0;
    this._flipTween = new TWEEN.Tween(this);

    this._presets = {};
    this.registerPresets();

    this._scene.add(this._lights);
    this._scene.add(this._containerObject);

    // let geometry = new THREE.BoxGeometry(50, 50, 50);
    // let material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    // let mesh = new THREE.Mesh(geometry, material);
    // mesh.position.set(0, 0, 0);
    // this._scene.add(mesh);

    var self = this;

    this.initGui();

    if (opts.defaults.hasOwnProperty('view')) {
      this.updateView(opts.defaults.view, { duration: 0 });
    }

    var sleeveFormat = this._sleeve.getFormat();

    if (Sleeve.Format.DOUBLE === sleeveFormat || Sleeve.Format.GATEFOLD === sleeveFormat) {

      var offsetY;
      if (Sleeve.Format.GATEFOLD === sleeveFormat) {
        offsetY = 1.08390626812156;
        this._vinyls[0].setOffsetY(offsetY);
        this._vinyls[1].setOffsetY(-offsetY);
      } else {
        offsetY = 0.6;
        this._vinyls[0].setOffsetY(offsetY);
        this._vinyls[1].setOffsetY(-offsetY);
      }
    }
  }

  /**
   * Mixin `Emitter`.
   */

  Emitter(World.prototype);

  /**
   *
   */

  //--------------------------------------------------------------
  World.prototype.getRenderer = function () {
    return this._renderer;
  };

  //--------------------------------------------------------------
  World.prototype.createLights = function () {
    var lights = new THREE.Object3D();
    lights.name = 'lights';

    var spotLight1 = new THREE.SpotLight(0xFFFFFF, 0.6, 0, 0.314, 10);
    spotLight1.position.set(335, 1955, 475);
    spotLight1.castShadow = true;
    lights.add(spotLight1);

    var spotLight2 = new THREE.SpotLight(0xFFFFFF, 0.6, 0, 0.314, 10);
    spotLight2.position.set(-980, -1900, -880);
    spotLight2.castShadow = true;
    lights.add(spotLight2);

    var pointLight1 = new THREE.PointLight(0xFFFFFF, 0.9, 0);
    pointLight1.position.set(-1000, 1200, -2300);
    pointLight1.castShadow = true;
    lights.add(pointLight1);

    var pointLight2 = new THREE.PointLight(0xFFFFFF, 0.5, 0);
    pointLight2.position.set(-2, -160, 1480);
    pointLight2.castShadow = true;
    lights.add(pointLight2);

    var hemisphereLight1 = new THREE.HemisphereLight(0x080E21, 0x2E1B11, 0.2);
    hemisphereLight1.position.set(380, 140, -1225);
    hemisphereLight1.castShadow = true;
    lights.add(hemisphereLight1);

    var hemisphereLight2 = new THREE.HemisphereLight(0x120C17, 0x220A0E, 0.2);
    hemisphereLight2.position.set(-360, 60, 1285);
    hemisphereLight2.castShadow = true;
    lights.add(hemisphereLight2);

    var ambientLight = new THREE.AmbientLight(0x0D0D0D);
    ambientLight.position.set(0, 820, 2);
    ambientLight.castShadow = true;
    lights.add(ambientLight);

    return lights;
  };

  //--------------------------------------------------------------
  World.prototype.registerPresets = function () {
    // TODO: register preset parameters

    this.registerPreset(1, function () {
      return {
        camera: null,
        lights: null,
        object: null
      };
    });

    this.registerPreset(2, function () {
      return {
        camera: null,
        lights: null,
        object: null
      };
    });
  };

  //--------------------------------------------------------------
  World.prototype.initGui = function () {
    if (!window.dat) {
      console.warn('dat.GUI is not loaded');
      this._sleeve.setCoveredRatio(0.8, { duration: 1 });
      return false;
    }

    var props = {
      color: 0xFFFFFF,
      size: 12,
      render: true,
      rotate: false,
      'sleeve visibility': true,
      'vinyl 1 visibility': true,
      'vinyl 2 visibility': true,
      out: false,
      zoom: 1.0,
      'covered ratio 1': 1.0,
      'covered ratio 2': 0.5,
      'sleeve rot': 60,
      'sleeve front rot': 0,
      'sleeve back rot': 0,
      'sleeve bump': 0.3,
      'vinyl bump': 0.3,
      'sleeve ao': 1.0,
      'vinyl ao': 1.0,
      sleeveX: -15,
      'vinyl offsetY': 0
    };

    var cameraProps = {
      x: 0.0, y: 17.0, z: 30.0,
    };

    var self = this;
    var axes = this.axes;
    var camera = this._camera;

    var temp = {
      capture: function () {
        self.capture();
      },
      'zoom in': function () {
        self.zoomIn(1);
      },
      'zoom out': function () {
        self.zoomOut(1);
      },
      'rotate horizontal': function () {
        self.rotateHorizontal(30);
      },
      'rotate vertical': function () {
        self.rotateVertical(30);
      },
      'reset': function () {
        self.resetCamera();
      },
      'toggle camera': function () {
        if (self._camera.getType() === self._camera.TYPE_PERSPECTIVE) {
          self.setOrthographic();
        } else {
          self.setPerspective();
        }
      }
    };

    var gui = this.gui = new window.dat.GUI();
    var renderController = gui.add(props, 'render');
    var rotationController = gui.add(props, 'rotate');
    var coveredRatioController = gui.add(props, 'covered ratio 1', 0.0, 1.0);
    var secondCoveredRatioController = gui.add(props, 'covered ratio 2', 0.0, 1.0);
    var sleeveRotationController = gui.add(props, 'sleeve rot', 0, 90);
    var sleeveFrontRotationController = gui.add(props, 'sleeve front rot', 0, 90);
    var sleeveBackRotationController = gui.add(props, 'sleeve back rot', 0, 90);
    var sleeveVisibilityController = gui.add(props, 'sleeve visibility');
    var firstVinylVisibilityController = gui.add(props, 'vinyl 1 visibility');
    var secondVinylVisibilityController = gui.add(props, 'vinyl 2 visibility');
    var captureController = gui.add(temp, 'capture');
    var zoomController = gui.add(props, 'zoom', 0, 400);
    var vinylOffsetYController = gui.add(props, 'vinyl offsetY', 0.0, 2.0);
    var cameraXController = gui.add(cameraProps, 'x', -1000.0, 1000.0);
    var cameraYController = gui.add(cameraProps, 'y', -1000.0, 1000.0);
    var cameraZController = gui.add(cameraProps, 'z', -1000.0, 1000.0);
    var sleeveBumpScaleController = gui.add(props, 'sleeve bump', 0, 1.0);
    var vinylBumpScaleController = gui.add(props, 'vinyl bump', 0, 1.0);
    var sleeveAoController = gui.add(props, 'sleeve ao', 0.0, 1.0);
    var vinylAoController = gui.add(props, 'vinyl ao', 0.0, 1.0);

    gui.add(this, 'flip');

    gui.add(temp, 'zoom in');
    gui.add(temp, 'zoom out');
    gui.add(temp, 'rotate horizontal');
    gui.add(temp, 'rotate vertical');
    gui.add(temp, 'reset');
    gui.add(temp, 'toggle camera');

    renderController.onChange(function (value) {
      if (value) {
        self.startRender();
      } else {
        self.stopRender();
      }
    });

    rotationController.onChange(function (value) {
      self.enableRotate = value;
      
      self._vinyls.forEach(function (vinyl) {
        vinyl.setEnableRotate(value);
      });
    });

    coveredRatioController.onChange(function (value) {
      self.cover(value, { duration: 2000, index: Vinyl.Index.FIRST });
    });

    secondCoveredRatioController.onChange(function (value) {
      self.cover(value, { duration: 2000, index: Vinyl.Index.SECOND });
    });

    sleeveRotationController.onChange(function (value) {
      self.setGatefoldCoverAngle(value);
    });

    sleeveFrontRotationController.onChange(function (value) {
      self.setSleeveFrontRotation(value);
    });

    sleeveBackRotationController.onChange(function (value) {
      self.setSleeveBackRotation(value);
    });

    sleeveVisibilityController.onChange(function (value) {
      self.setSleeveVisibility(value, null, function () {
      });
    });

    firstVinylVisibilityController.onChange(function (value) {
      self.setVinylVisibility(Vinyl.Index.FIRST, value, null, function () {
      });
    });

    secondVinylVisibilityController.onChange(function (value) {
      self.setVinylVisibility(Vinyl.Index.SECOND, value, null, function () {
      });
    });

    zoomController.onChange(function (value) {
      self.zoom(value);
    });

    vinylOffsetYController.onChange(function (value) {
      console.log(value);
      self._vinyls[0].setOffsetY(value);

      if (1 === self._vinyls.length) {
        return;
      }

      self._vinyls[1].setOffsetY(-value);
    });

    cameraXController.onChange(function (value) {
      self.setCameraPosition(cameraProps.x, cameraProps.y, cameraProps.z, { duration: 0 });
    });
    cameraYController.onChange(function (value) {
      self.setCameraPosition(cameraProps.x, cameraProps.y, cameraProps.z, { duration: 0 });
    });
    cameraZController.onChange(function (value) {
      self.setCameraPosition(cameraProps.x, cameraProps.y, cameraProps.z, { duration: 0 });
    });

    sleeveBumpScaleController.onChange(function (value) {
      if (!self._vinyl) {
        return;
      }

      self._sleeve.setBumpScale(value);
    });

    vinylBumpScaleController.onChange(function (value) {
      if (!self._vinyl) {
        return;
      }

      self._vinyl.setBumpScale(value);
    });

    sleeveAoController.onChange(function (value) {
      self._sleeve.setAoMapIntensity(value);
    });

    vinylAoController.onChange(function (value) {
      self._vinyl.setAoMapIntensity(value);
    });
  };

  //--------------------------------------------------------------
  World.prototype.setCameraPosition = function (tx, ty, tz, opts, callback) {
    if (!callback) {
      callback = null;
    }

    opts = opts || {
      durarion: 1000
    };

    opts.duration = undefined === opts.duration ? 1000 : opts.duration;

    var self = this;

    // self.startRender();

    // this.resetCamera();

    new TWEEN.Tween(this._camera.position)
      .to({ x: tx, y: ty, z: tz }, opts.duration)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function () {
        self._camera.lookAt(new THREE.Vector3(0, 0, 0));
        // self._vinyl.setBumpScale(Math.max(Math.abs(self._camera.position.z) / 4000, self._vinyl.getBumpScale()));
      })
      .onComplete(function () {
        if (callback) callback();
      })
      .start();
  };

  //--------------------------------------------------------------
  World.prototype.setCameraRotation = function (tx, ty, tz, opts, callback) {
    if (!callback) {
      callback = null;
    }

    opts = opts || {
      durarion: 1001
    };

    opts.duration = undefined === opts.duration ? 1001 : opts.duration;

    var self = this;

    // self.startRender();

    // this.resetCamera();

    new TWEEN.Tween(this._camera.rotation)
      .to({ x: tx, y: ty, z: tz }, opts.duration)
      .easing(TWEEN.Easing.Quartic.Out)
      .onComplete(function () {
        console.log(self._camera);
        console.log(self._controls);
        if (callback) callback();
      })
      .start();
  };

  //--------------------------------------------------------------
  World.prototype.resetCamera = function () {
    this._camera = new THREE.CombinedCamera(this._width / 2, this._height / 2, this._opts.camera.fov, this._opts.camera.near, this._opts.camera.far, -500, this._opts.camera.far);
    this._camera.position.set(212, 288, 251);
    this._camera.lookAt(new THREE.Vector3(0, 0, 0));

    this._controls = new THREE.TrackballControls(this._camera, this._parent.el);
    this._controls.target = new THREE.Vector3(0, 0, 0);
    this._controls.handleResize({ left: 0, top: 0, width: this._width, height: this._height });
    this._controls.update();
  };

  //--------------------------------------------------------------
  World.prototype.setPerspective = function () {
    this._camera.toPerspective();
    this._camera.setZoom(1);
  };

  //--------------------------------------------------------------
  World.prototype.setOrthographic = function () {
    this._camera.toOrthographic();
    this._camera.setZoom(this._orthographicZoom);
  };

  //--------------------------------------------------------------
  World.prototype.setVinylVisibility = function (index, yn, opts, callback) {
    this._vinyls[0].setVisibility(index, yn);
  };

  //--------------------------------------------------------------
  World.prototype.setGatefoldCoverAngle = function (degree) {

    var sleeveFormat = this._sleeve.getFormat();

    if (Sleeve.Format.GATEFOLD !== sleeveFormat) {
      console.warn('World.setGatefoldCoverAngle: changing rotation is not available for "' + sleeveFormat + '"');
      return;
    }

    var self = this;
    var currentAngleInDegrees = this._sleeve.getCurrentGatefoldAngle() * (180 / Math.PI);

    new TWEEN.Tween({ rotation: currentAngleInDegrees })
      .stop()
      .to({ rotation: degree }, 500)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function () {
        angleInRadians = this.rotation * (Math.PI / 180);
        self._sleeve.setGatefoldCoverAngle(angleInRadians);
        self._vinyls[0].setRotationZ(angleInRadians * 2);
      })
      .start();
  };

  //--------------------------------------------------------------
  World.prototype.setSleeveVisibility = function (yn, opts, callback) {
    this._sleeve.setVisibility(yn);
  };

  //--------------------------------------------------------------
  World.prototype.flip = function (value) {
    console.log('World::flip', value);

    this._flip = !this._flip;

    var self = this;

    this._flipTween
      .stop()
      .to({ _flipRotation: this._flip ? -Math.PI : 0 })
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function () {
        self._containerObject.rotation.z = self._flipRotation;
      })
      .start();
  };

  //--------------------------------------------------------------
  World.prototype.rotateHorizontal = function (degrees) {
    console.log('World::rotateHorizontal', degrees);

    // this._controls.rotateLeft(degrees * (Math.PI / 180));
    // this._controls.rotateStart.copy(this._controls.getMouseProjectionOnBall(0, 0));
    // this._controls.rotateEnd.copy(this._controls.getMouseProjectionOnBall(30, 0));
  };

  //--------------------------------------------------------------
  World.prototype.rotateVertical = function (degrees) {
    console.log('World::rotateVertical', degrees);

    // this._controls.rotateUp(degrees * (Math.PI / 180));
    // this._controls.rotateStart.copy(this._controls.getMouseProjectionOnBall(this._width / 2, this._height / 2));
    // this._controls.rotateEnd.copy(this._controls.getMouseProjectionOnBall(this._width / 2, this._height / 2 + 6 * degrees));
  };

  //--------------------------------------------------------------
  World.prototype.cover = function (value, opts) {

    const self = this;
    const sleeveFormat = this._sleeve.getFormat();

    if (Sleeve.Format.GATEFOLD === sleeveFormat || Sleeve.Format.DOUBLE === sleeveFormat) {
      this._sleeve.resetCoveredRatio();

      let index = 0;
      if (Vinyl.Index.SECOND === opts.index) {
        if (1 === this._vinyls.length) {
          return;
        }

        index = 1;
      }

      // if (Sleeve.Format.GATEFOLD === sleeveFormat) {
      //   this._vinyls[0].setOffsetY(1.1965015565108743);
      //   this._vinyls[1].setOffsetY(-1.1965015565108743);
      // } else {
      //   this._vinyls[0].setOffsetY(0.6);
      //   this._vinyls[1].setOffsetY(-0.6);
      // }

      const param = {
        ratio: this._vinyls[index].getCoveredRatio()
      };

      new TWEEN.Tween(param)
        .stop()
        .to({ ratio: value })
        .easing(TWEEN.Easing.Quartic.Out)
        .onUpdate(function () {
          self._vinyls[index].setCoveredRatio(this.ratio);
        })
        .start();
    } else {
      const param = {
        ratio: this._sleeve.getCoveredRatio()
      }

      this._vinyls.forEach(function (vinyl) {
        vinyl.setCoveredRatio(0);
      });

      new TWEEN.Tween(param)
        .stop()
        .to({ ratio: value })
        .easing(TWEEN.Easing.Quartic.Out)
        .onUpdate(function () {
          self._sleeve.setCoveredRatio(this.ratio, opts);
        })
        .start();
    }
  };

  //--------------------------------------------------------------
  World.prototype.zoomIn = function (step) {
    if (this._camera.type === this._camera.TYPE_PERSPECTIVE) {
      this._controls._zoomStart.copy(this._controls.getMouseOnScreen(0, 0));
      this._controls._zoomEnd.copy(this._controls.getMouseOnScreen(0, -20 * (step || 1)));
      this._controls.zoomCamera();
    } else {
      this._orthographicZoom += step * 15;
      this._camera.setZoom(this._orthographicZoom);
    }
  };

  //--------------------------------------------------------------
  World.prototype.zoomOut = function (step) {
    if (this._camera.type === this._camera.TYPE_PERSPECTIVE) {
      this._controls._zoomStart.copy(this._controls.getMouseOnScreen(0, 0));
      this._controls._zoomEnd.copy(this._controls.getMouseOnScreen(0, 20 * (step || 1)));
      this._controls.zoomCamera();
    } else {
      this._orthographicZoom -= step * 15;
      this._camera.setZoom(this._orthographicZoom);
    }
  };

  //--------------------------------------------------------------
  World.prototype.capture = function (callback) {
    console.log('World::capture');
    var image = new Image();
    image.src = this._renderer.domElement.toDataURL('image/png');
    image.onload = function () {
      if (callback) callback(null, this);
    };
  };

  //--------------------------------------------------------------
  World.prototype.resize = function (width, height) {

    this.stopRender();

    this._width = width;
    this._height = height;
    // this._camera.aspect = width / height;
    this._camera.setSize(this._width, this._height);
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(width, height);

    this._controls.handleResize({
      left: 0,
      top: 0,
      width: this._width,
      height: this._height
    });

    this.startRender();
  };

  //--------------------------------------------------------------
  World.prototype.play = function () {

    this._enableRotate = true;

    this._vinyls.forEach(function (vinyl) {
      vinyl.setEnableRotate(true);
    });
  };

  //--------------------------------------------------------------
  World.prototype.pause = function () {

    this._enableRotate = false;
    
    this._vinyls.forEach(function (vinyl) {
      vinyl.setEnableRotate(false);
    });
  };

  //--------------------------------------------------------------
  World.prototype.updateView = function (type, opts, callback) {

    opts = opts || {
      duration: 2000
    };

    // TODO: rewrite for presets.
    // TODO: clear all tween.

    opts.duration = undefined !== opts.duration ? opts.duration : 2000;

    switch (Number(type)) {
      case 0:  // for capture rendered image
        var rate = 0.9;
        this.setCameraPosition(212 * rate, 288 * rate, 251 * rate, opts, callback);
        this._flip = true;
        this.flip();
        this.cover(0.5, { duration: opts.duration });
        this._controls.reset();
        break;
      case 1:
        this.setCameraPosition(62, 94, 105, opts, callback); // item detail rotation 1
        this._flip = true;
        this.flip();
        this.cover(0.8, { duration: opts.duration });
        this._controls.reset();
        break;
      case 2:
        this.setCameraPosition(0.01, 365, 10, opts, callback); // item detail rotation 2
        this._flip = true;
        this.flip();
        this.cover(0.8, { duration: opts.duration });
        this._controls.reset();
        break;
      case 3:
        this.setCameraPosition(0.01, 365, 50, opts, callback); // item detail rotation 3
        this._flip = false;
        this.flip();
        this.cover(0.8, { duration: opts.duration });
        this._controls.reset();
        break;
      case 4:
        this.setCameraPosition(0.01, 345, 400, opts, callback); // item detail rotation 4
        this._flip = false;
        this.flip();
        this.cover(0.0, { duration: opts.duration });
        this._controls.reset();
        break;
      case 5:
        this.setCameraPosition(0.01, 345, 400, opts, callback); // item detail rotation 5
        this._flip = true;
        this.flip();
        this.cover(0.0, { duration: opts.duration });
        this._controls.reset();
        break;
      case 6:
        this.setCameraPosition(212, 288, 251, opts, callback); // item detail rotation 6
        this._controls.reset();
        break;
      case 7:
        this.setCameraPosition(212, 288, 251, opts, callback); // item detail rotation 7
        this._controls.reset();
        break;
      case 8:
        this.setCameraPosition(212, 288, 251, opts, callback); // item detail rotation 8
        this._controls.reset();
        break;
      case 9:
        this.setCameraPosition(148, 201, 175, opts, callback); // item detail rotation 9
        this._flip = true;
        this.flip();
        this.cover(0.8, { duration: opts.duration });
        this._controls.reset();
        break;
      case 10:
        this.setCameraPosition(0, 436, 1, opts, callback); // vinyl Side A
        this.cover(0.8, { duration: opts.duration });
        this._controls.reset();
        break;
      case 11:
        this.setCameraPosition(0, 170, 1, opts, callback); // label Side A
        this.cover(0.8, { duration: opts.duration });
        this._controls.reset();
        break;
      case 12:
        this.setCameraPosition(0, -170, -1, opts, callback); // label Side B
        this.cover(0.8, { duration: opts.duration });
        this._controls.reset();
        break;
      case 13:
        this.setCameraPosition(0, 400, 1, opts, callback); // sleeve Front
        this.cover(0.0, { duration: opts.duration });
        this._controls.reset();
        break;
      case 14:
        this.setCameraPosition(0, -400, -1, opts, callback); // sleeve Back
        this.cover(0.0, { duration: opts.duration });
        this._controls.reset();
        break;
      case 21:
        this.setPerspective();
        this.setSleeveVisibility(true);
        this.setCameraPosition(190 * 0.8, 259 * 0.8, 226 * 0.8, { duration: opts.duration });
        this.cover(0.5, { duration: opts.duration });
        this._controls.target = new THREE.Vector3(-30, 0, 24);
        this._controls.update();
        break;
      case 22:
        this.setPerspective();
        this.setSleeveVisibility(true);
        this.setCameraPosition(-250, 260, 260, { duration: opts.duration });
        this.cover(0.8, { duration: opts.duration });
        this._controls.target = new THREE.Vector3(-30, -210, -140);
        this._controls.update();
        break;
      case 23:
        this.setOrthographic();
        this.setSleeveVisibility(true);
        this.cover(0.8, { duration: opts.duration });
        this._camera.position.set(-75, 500, 10);
        this._controls.target = new THREE.Vector3(-75, 0, 0);
        this._controls.update();
        break;
      case 24:
        this.setOrthographic();
        this.setSleeveVisibility(true);
        this.cover(0.8, { duration: opts.duration });
        this._camera.position.set(-75, -500, -10);
        this._controls.target = new THREE.Vector3(-75, 0, 0);
        this._controls.update();
        break;
      case 25:
        this.setOrthographic();
        this.setSleeveVisibility(true);
        this.cover(0, { duration: opts.duration });
        this._camera.position.set(0, 500, 10);
        this._controls.target = new THREE.Vector3(0, 0, 0);
        this._controls.update();
        break;
      case 26:
        this.setOrthographic();
        this.setSleeveVisibility(true);
        this.cover(0, { duration: opts.duration });
        this._camera.position.set(0, -500, -10);
        this._controls.target = new THREE.Vector3(0, 0, 0);
        this._controls.update();
        break;
      case 27:
        this.setOrthographic();
        this.setSleeveVisibility(false);
        this.cover(0, { duration: opts.duration });
        this._camera.position.set(0, 400, 10);
        this._controls.target = new THREE.Vector3(0, 0, 0);
        this._camera.setZoom(320);
        this._controls.update();
        break;
      case 28:
        this.setOrthographic();
        this.setSleeveVisibility(false);
        this.cover(0, { duration: opts.duration });
        this._camera.position.set(0, -328, -10);
        this._controls.target = new THREE.Vector3(0, 0, 0);
        this._camera.setZoom(320);
        this._controls.update();
        break;
      case 29:
        this.setOrthographic();
        this.setSleeveVisibility(false);
        this.cover(0.8, { duration: opts.duration });
        this._camera.position.set(-75, 500, 10);
        this._controls.target = new THREE.Vector3(-75, 0, 0);
        this._controls.update();
        break;
      default:
        break;
    }
  };

  //--------------------------------------------------------------
  World.prototype.startRender =
    World.prototype.resumeRender = function () {
      console.log('World::startRender', this._request);
      if (!this._request) {
        this._isRendering = true;
        this._request = requestAnimationFrame(this.draw.bind(this));
      }

      return this;
    };

  //--------------------------------------------------------------
  World.prototype.stopRender = function () {
    console.log('World::stopRender', this._request);
    if (this._request) {
      this._isRendering = false;
      this._request = cancelAnimationFrame(this._request);
    }

    return this;
  };

  //--------------------------------------------------------------
  World.prototype.update = function () {
    if (this._sleeve) {
      this._sleeve.update();
    }

    this._vinyls.forEach(function (vinyl) {
      vinyl.update();
    });

    this._controls.update();

    this._lights.position.copy(this._camera.position);
    //this._lights.lookAt(new THREE.Vector3(0, 0, 0));
    this._lights.lookAt(this._controls.target);
  };

  //--------------------------------------------------------------
  World.prototype.draw = function (time) {

    if (this._stats) {
      this._stats.begin();
    }

    if (!this._isRendering) {
      return;
    }

    this.update();

    this._renderer.clear();
    this._renderer.render(this._scene, this._camera);

    if (this._stats) {
      this._stats.end();
    }

    this._request = requestAnimationFrame(this.draw.bind(this));

    TWEEN.update(time);
  };

  //--------------------------------------------------------------
  /**
   * @param {String|Mixed} type
   * @param {Function} fn
   * @return {World}
   */

  World.prototype.registerPreset = function (type, fn) {
    if (this._presets[type]) {
      console.warn('Preset %s is already registered. Overwritten.', type);
    } console.log('registerPreset');
    this._presets[type] = fn;
    return this;
  };

  //--------------------------------------------------------------
  World.prototype.delegateEvents = function () {

    var parent = this._parent;

    for (var i in parent.vinyls) {
      parent.vinyls[i].on('colorFormat', this.onVinylColorFormatChanged.bind(this, this._vinyls[i]));
      parent.vinyls[i].on('size', this.onVinylSizeChanged.bind(this, this._vinyls[i]));
      parent.vinyls[i].on('color', this.onVinylColorChanged.bind(this, this._vinyls[i]));
      parent.vinyls[i].on('weight', this.onVinylWeightChanged.bind(this, this._vinyls[i]));
      parent.vinyls[i].on('speed', this.onVinylSpeedChanged.bind(this, this._vinyls[i]));
      parent.vinyls[i].on('alphaMap', this.onVinylAlphaMapChanged.bind(this, this._vinyls[i]));
      parent.vinyls[i].on('aoMap', this.onVinylAoMapChanged.bind(this, this._vinyls[i]));
      parent.vinyls[i].on('bumpMap', this.onVinylBumpMapChanged.bind(this, this._vinyls[i]));
      parent.vinyls[i].on('colorMap', this.onVinylColorMapChanged.bind(this, this._vinyls[i]));
      parent.vinyls[i].on('label', this.onLabelOptionChanged.bind(this, this._vinyls[i]));
      parent.vinyls[i].on('labelAoMap', this.onLabelAoMapChanged.bind(this, this._vinyls[i]));
      parent.vinyls[i].on('labelBumpMap', this.onLabelBumpMapChanged.bind(this, this._vinyls[i]));
      parent.vinyls[i].on('labelColorMap', this.onLabelColorMapChanged.bind(this, this._vinyls[i]));
    }

    parent.sleeve.on('type', this.onSleeveTypeChanged.bind(this));
    parent.sleeve.on('hole', this.onSleeveHoleChanged.bind(this));
    parent.sleeve.on('finish', this.onSleeveFinishChanged.bind(this));
    parent.sleeve.on('colorMap', this.onSleeveColorMapChanged.bind(this));
    parent.sleeve.on('aoMap', this.onSleeveAoMapChanged.bind(this));
    parent.sleeve.on('bumpMap', this.onSleeveBumpMapChanged.bind(this));

    return this;
  };

  //--------------------------------------------------------------
  World.prototype.undelegateEvents = function () {
    var parent = this._parent;

    return this;
  };

  //--------------------------------------------------------------
  World.prototype.onVinylColorFormatChanged = function (target, colorFormat) {

    if (-1 === Object.values(Vinyl.ColorFormat).indexOf(colorFormat)) {
      console.warn('World.onVinylColorFormatChanged: unknown value "' + colorFormat + '" for vinyl color format');
      return;
    }

    target.setColorFormat(colorFormat);
  };

  //--------------------------------------------------------------
  World.prototype.onVinylSizeChanged = function (target, size) {

    // to string
    size += '';

    if (!size) {
      console.warn('World.onVinylSizeChanged: no size value passed');
      return;
    }

    if (-1 === Object.values(Vinyl.Size).indexOf(size)) {
      console.error('Unknown vinyl size "' + size + '"');
      return;
    }

    target.setSize(size);

    this._resetFirstVinylRotation();

    var firstVinylSize = this._convertSizeToNumber(this._vinyls[0].getSize());
    var secondVinylSize = firstVinylSize;

    if (1 < this._vinyls.length) {
      secondVinylSize = this._convertSizeToNumber(this._vinyls[1].getSize());
    }

    var largerSize = Math.max(firstVinylSize, secondVinylSize);

    var sleeveSize;
    var scale;

    switch (largerSize) {
      case 7:
        sleeveSize = Sleeve.Size.SIZE_7;
        scale = 1;
        break;
      case 10:
        sleeveSize = Sleeve.Size.SIZE_10;
        scale = 0.6890566038;
        break;
      case 12:
        sleeveSize = Sleeve.Size.SIZE_12;
        scale = 0.5833865815;
        break;
    }

    this._containerObject.scale.set(scale, scale, scale);
    this._sleeve.setSize(sleeveSize);
  };

  //--------------------------------------------------------------
  World.prototype.onVinylColorChanged = function (target, color) {

    target.setColor(Object.keys(Vinyl.Color)[color]);
  };

  //--------------------------------------------------------------
  World.prototype.onVinylWeightChanged = function (target, weight) {

    target.setWeight(weight);

    this._resetFirstVinylRotation();
  };

  //--------------------------------------------------------------
  World.prototype.onLabelOptionChanged = function (target, value) {

    if (value === true) {
      target.enableLabel();
    } else {
      target.disableLabel();
    }

    this._resetFirstVinylRotation();
  };

  //--------------------------------------------------------------
  World.prototype.onVinylSpeedChanged = function (target, rpm) {

    target.setRPM(rpm);
  };

  //--------------------------------------------------------------
  World.prototype.onVinylAlphaMapChanged = function (target, image) {

    target.setTexture({ alphaMap: image });
  };

  //--------------------------------------------------------------
  World.prototype.onVinylAoMapChanged = function (target, image) {

    target.setTexture({ aoMap: image });
  };

  //--------------------------------------------------------------
  World.prototype.onVinylBumpMapChanged = function (target, image) {

    target.setTexture({ bumpMap: image });
  };

  //--------------------------------------------------------------
  World.prototype.onVinylColorMapChanged = function (target, image) {

    target.setTexture({ map: image });
  };

  //--------------------------------------------------------------
  World.prototype.onLabelAoMapChanged = function (target, image) {

    target.setLabelTexture({ aoMap: image });
  };

  //--------------------------------------------------------------
  World.prototype.onLabelBumpMapChanged = function (target, image) {

    target.setLabelTexture({ bumpMap: image });
  };

  //--------------------------------------------------------------
  World.prototype.onLabelColorMapChanged = function (target, image) {

    target.setLabelTexture({ map: image });
  };

  //--------------------------------------------------------------
  World.prototype.onSleeveTypeChanged = function (value) {

    this._sleeve.setFormat(value);

    if (Sleeve.Format.GATEFOLD === value || Sleeve.Format.DOUBLE === value) {
      if (2 === this._vinyls.length) {
        return;
      }

      var opts = this._vinyls[0].getCurrentProperties();
      opts.index = Vinyl.Index.SECOND;

      this._vinyls.push(new Vinyl());
      this._vinyls[1].setup(this._scene, this._assets, opts, this._containerObject);

      var offsetY;
      if (Sleeve.Format.GATEFOLD === value) {
        offsetY = 1.1965015565108743;
        this._vinyls[0].setOffsetY(offsetY);
        this._vinyls[1].setOffsetY(-offsetY);
      } else {
        this._vinyls[0].setOffsetY(0.6);
        this._vinyls[1].setOffsetY(-0.6);
      }
    } else {
      if (1 === this._vinyls.length) {
        return;
      }

      this._vinyls[1].removeFromContainer();
      this._vinyls[1].dispose();
      this._vinyls.pop();
      this._vinyls.length = 1;

      this._vinyls[0].setOffsetY(0);
    }

    this._vinyls.forEach(function (vinyl) {
      vinyl.setCoveredRatio(0);
    });

    this._resetFirstVinylRotation();
  };

  //--------------------------------------------------------------
  World.prototype.onSleeveHoleChanged = function (value) {

    this._sleeve.setHole(value ? Sleeve.Hole.HOLED : Sleeve.Hole.NO_HOLE);
  };

  //--------------------------------------------------------------
  World.prototype.onSleeveFinishChanged = function (value) {
    console.log(value);

    this._sleeve.setFinish(value);
  };

  //--------------------------------------------------------------
  World.prototype.onSleeveColorMapChanged = function (value) {

    if (!value) {
      return;
    }

    this._sleeve.setColorMap(value);
  };

  //--------------------------------------------------------------
  World.prototype.onSleeveAoMapChanged = function (value) {

    if (!value) {
      return;
    }

    this._sleeve.setAoMap(value);
  };

  //--------------------------------------------------------------
  World.prototype.onSleeveBumpMapChanged = function (value) {

    if (!value) {
      return;
    }

    this._sleeve.setBumpMap(value);
  };

  //--------------------------------------------------------------
  World.prototype._convertSizeToNumber = function (size) {

    if (Vinyl.Size.SIZE_7_SMALL_HOLE === size || Vinyl.Size.SIZE_7_LARGE_HOLE === size || Sleeve.Size.SIZE_7 === size) {
      return 7;
    } else if (Vinyl.Size.SIZE_10 === size) {
      return 10;
    } else if (Vinyl.Size.SIZE_12 === size) {
      return 12;
    }
  };

  //--------------------------------------------------------------
  World.prototype._resetFirstVinylRotation = function () {

    if (Sleeve.Format.GATEFOLD === this._sleeve.getFormat()) {
      this._vinyls[0].setRotationZ(this._sleeve.getCurrentGatefoldAngle() * 2);
    } else {
      this._vinyls[0].setRotationZ(0);
    }
  }
})(this, (this.qvv = (this.qvv || {})));
