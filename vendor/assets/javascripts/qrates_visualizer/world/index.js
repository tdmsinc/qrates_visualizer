
//= require tdmsinc-three.js
//= require ../emitter
//= require_tree .
//= require_self

(function (global, exports) {
  let gui, axes;

  /**
   * Module dependencies.
   */

  const Emitter = exports.Emitter;
  const Vinyl = exports.world.Vinyl;
  const Sleeve = exports.world.Sleeve;

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
  function World (parent, assets, opts) {

    return new Promise((resolve, reject) => {

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

      this.initGui();
  
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
      this._renderer.sortObjects = false;
  
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
      this._sleeve = new Sleeve(this._assets, this._containerObject, this._opts.loader);
      this._sleeve.setup(opts.defaults.sleeve)
        .then(() => {
          this._sleeve.setObjectScale(this._objectScales['12']);
          
          // vinyl
          this._vinyls = [
            new Vinyl(this._assets, this._containerObject, this._opts.loader),
            new Vinyl(this._assets, this._containerObject, this._opts.loader)
          ];
  
          // sleeve が single で複数の vinyl オプションが渡された場合は2つ目以降のオプションを削除して single フォーマットを採用する
          if ((Sleeve.Format.SINGLE_WITHOUT_SPINE === opts.defaults.sleeve.format || Sleeve.Format.SINGLE === opts.defaults.sleeve.format)) {
            if (1 < opts.defaults.vinyl.length) {
              console.warn('World: too many options for vinyl');
              
              opts.defaults.vinyl.pop();
              opts.defaults.vinyl.length = 1;
            }
          }
  
          // sleeve format に応じて vinyl の位置をオフセット
          const sleeveFormat = this._sleeve.getFormat();
          let offsetY = 0.0;
  
          if (Sleeve.Format.DOUBLE === sleeveFormat || Sleeve.Format.GATEFOLD === sleeveFormat) {
            if (Sleeve.Format.GATEFOLD === sleeveFormat) {
              offsetY = 1.08390626812156;
            } else {
              offsetY = 0.6;
            }
          }
  
          let targets = [];

          if (1 == opts.defaults.vinyl.length) {
            opts.defaults.vinyl.push(opts.defaults.vinyl[0]);
          }
  
          // vinyl オプションから vinyl を生成
          for (let i in opts.defaults.vinyl) {
            opts.defaults.vinyl[i].index = Object.values(Vinyl.Index)[i];
            opts.defaults.vinyl[i].offsetY = 0 == i ? offsetY : -offsetY;

            if ((Sleeve.Format.SINGLE_WITHOUT_SPINE === opts.defaults.sleeve.format || Sleeve.Format.SINGLE === opts.defaults.sleeve.format)) {
              opts.defaults.vinyl[i].visibility = 0 == i ? true : false;
            } else {
              opts.defaults.vinyl[i].visibility = true;
            }

            targets.push(this._vinyls[i].setup(this._opts.defaults.vinyl[i]));
          }
  
          Promise.all(targets)
            .then(() => {
              // scale を設定
              const scale = this._objectScales[this._vinyls[0]._size];
              this._containerObject.scale.set(scale, scale, scale);
              this._containerObject.position.set(0, 0, 0);
  
              this._flipRotation = 0;
              this._flipTween = new TWEEN.Tween(this);
  
              this._presets = {};
              this.registerPresets();

              this._lights.lookAt(new THREE.Vector3(0, 0, 0));

              this._scene.add(this._lights);
              // this._camera.add(this._lights);
              // this._lights.position.set(0, 0, 0);
              this._scene.add(this._containerObject);
  
              if (opts.defaults.hasOwnProperty('view')) {
                this.updateView(opts.defaults.view, { duration: 0 });
              }
  
              // シングルスリーブの場合は2枚目の vinyl を表示しない
              if ((Sleeve.Format.SINGLE_WITHOUT_SPINE === opts.defaults.sleeve.format || Sleeve.Format.SINGLE === opts.defaults.sleeve.format)) {
                this._vinyls[1].setVisibility(false);
              }

              this._vinyls[0].setRenderOrder(0);
              this._vinyls[1].setRenderOrder(1);

              resolve(this);
            });
        });
    });
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
    let lights = new THREE.Object3D();
    lights.name = 'lights';

    let spotLight1 = new THREE.SpotLight(0xffffff, 0.6, 0, 0.314, 10);
    spotLight1.position.set(335, 1955, 475);
    lights.add(spotLight1);

    let spotLight2 = new THREE.SpotLight(0xffffff, 0.6, 0, 0.314, 10);
    spotLight2.position.set(-980, -1900, -880);
    lights.add(spotLight2);

    let pointLight1 = new THREE.PointLight(0xFFFFFF, 0.9, 0);
    pointLight1.position.set(-1000, 1200, -2300);
    lights.add(pointLight1);

    let pointLight2 = new THREE.PointLight(0xFFFFFF, 0.5, 0);
    pointLight2.position.set(-2, -620, 180);
    lights.add(pointLight2);

    let hemisphereLight1 = new THREE.HemisphereLight(0x080E21, 0x2E1B11, 0.2);
    hemisphereLight1.position.set(380, 140, -1225);
    lights.add(hemisphereLight1);

    let hemisphereLight2 = new THREE.HemisphereLight(0x120C17, 0x220A0E, 0.2);
    hemisphereLight2.position.set(-360, 60, 1285);
    lights.add(hemisphereLight2);

    let ambientLight = new THREE.AmbientLight(0x0D0D0D);
    ambientLight.position.set(0, 820, 2);
    lights.add(ambientLight);

    let ambientLight2 = new THREE.AmbientLight(0x0D0D0D);
    ambientLight2.position.set(0, -820, 2);
    lights.add(ambientLight2);

    // var spotLight1 = new THREE.SpotLight(0xFFFFFF, 0.6, 0, 0.314, 10);
    // spotLight1.position.set(335, 1955, 475);
    // spotLight1.castShadow = true;
    // lights.add(spotLight1);

    // var spotLight2 = new THREE.SpotLight(0xFFFFFF, 0.6, 0, 0.314, 10);
    // spotLight2.position.set(-980, -1900, -880);
    // spotLight2.castShadow = true;
    // lights.add(spotLight2);

    // var pointLight1 = new THREE.PointLight(0xFFFFFF, 0.9, 0);
    // pointLight1.position.set(-1000, 1200, -2300);
    // pointLight1.castShadow = true;
    // lights.add(pointLight1);

    // var pointLight2 = new THREE.PointLight(0xFFFFFF, 0.5, 0);
    // pointLight2.position.set(-2, -160, 1480);
    // pointLight2.castShadow = true;
    // lights.add(pointLight2);

    // var hemisphereLight1 = new THREE.HemisphereLight(0x080E21, 0x2E1B11, 0.2);
    // hemisphereLight1.position.set(380, 140, -1225);
    // hemisphereLight1.castShadow = true;
    // lights.add(hemisphereLight1);

    // var hemisphereLight2 = new THREE.HemisphereLight(0x120C17, 0x220A0E, 0.2);
    // hemisphereLight2.position.set(-360, 60, 1285);
    // hemisphereLight2.castShadow = true;
    // lights.add(hemisphereLight2);

    // var ambientLight = new THREE.AmbientLight(0x0D0D0D);
    // ambientLight.position.set(0, 820, 2);
    // ambientLight.castShadow = true;
    // lights.add(ambientLight);

    this.spotLightHelper1 = new THREE.SpotLightHelper(spotLight1, new THREE.Color(1, 1, 0));
    this._scene.add(this.spotLightHelper1);

    this.spotLightHelper2 = new THREE.SpotLightHelper(spotLight2, new THREE.Color(1, 1, 0));
    this._scene.add(this.spotLightHelper2);

    this.pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 50, new THREE.Color(0x00ff00));
    this._scene.add(this.pointLightHelper1);

    this.pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 50, new THREE.Color(0x00ff00));
    this._scene.add(this.pointLightHelper2);

    this.hemisphereLightHelper1 = new THREE.HemisphereLightHelper(hemisphereLight1, 50);
    this._scene.add(this.hemisphereLightHelper1);

    this.hemisphereLightHelper2 = new THREE.HemisphereLightHelper(hemisphereLight2, 50);
    this._scene.add(this.hemisphereLightHelper2);

    let gui_light = this.gui.addFolder('light');

    gui_spotLight1 = gui_light.addFolder('spot light 1');
    gui_spotLight1.add(spotLight1, 'intensity', 0.0, 2.0);
    gui_spotLight1.add(spotLight1, 'distance', 0.0, 100);
    gui_spotLight1.add(spotLight1, 'angle', 0.0, Math.PI);
    gui_spotLight1.add(spotLight1, 'penumbra', 0.0, 100);
    gui_spotLight1.add(spotLight1, 'decay', 0.0, 100);

    gui_spotLight2 = gui_light.addFolder('spot light 2');
    gui_spotLight2.add(spotLight2, 'intensity', 0.0, 2.0);
    gui_spotLight2.add(spotLight2, 'distance', 0.0, 100);
    gui_spotLight2.add(spotLight2, 'angle', 0.0, Math.PI);
    gui_spotLight2.add(spotLight2, 'penumbra', 0.0, 100);
    gui_spotLight2.add(spotLight2, 'decay', 0.0, 100);

    gui_pointLight1 = gui_light.addFolder('point light 1');
    gui_pointLight1.add(pointLight1, 'intensity', 0.0, 2.0);
    gui_pointLight1.add(pointLight1, 'distance', 0.0, 100);
    gui_pointLight1.add(pointLight1, 'decay', 0.0, 100);
    gui_pointLight1.add(pointLight1.position, 'x', -2000, 2000);
    gui_pointLight1.add(pointLight1.position, 'y', -2000, 2000);
    gui_pointLight1.add(pointLight1.position, 'z', -2000, 2000);

    gui_pointLight2 = gui_light.addFolder('point light 2');
    gui_pointLight2.add(pointLight2, 'intensity', 0.0, 20.0);
    gui_pointLight2.add(pointLight2, 'distance', 0.0, 100);
    gui_pointLight2.add(pointLight2, 'decay', 0.0, 100);
    gui_pointLight2.add(pointLight2.position, 'x', -50, 50);
    gui_pointLight2.add(pointLight2.position, 'y', -1000, 0);
    gui_pointLight2.add(pointLight2.position, 'z', 0, 2000);

    gui_hemisphereLight1 = gui_light.addFolder('hemisphere light 1');
    gui_hemisphereLight1.add(hemisphereLight1, 'intensity', 0.0, 2.0);

    gui_hemisphereLight2 = gui_light.addFolder('hemisphere light 2');
    gui_hemisphereLight2.add(hemisphereLight2, 'intensity', 0.0, 2.0);

    gui_ambientLight = gui_light.addFolder('ambient light');
    gui_ambientLight.add(ambientLight, 'intensity', 0.0, 50.0);
    gui_ambientLight.add(ambientLight.position, 'x', -50, 50);
    gui_ambientLight.add(ambientLight.position, 'y', -1000, 0);
    gui_ambientLight.add(ambientLight.position, 'z', 0, 2000);

    gui_ambientLight2 = gui_light.addFolder('ambient light 2');
    gui_ambientLight2.add(ambientLight2, 'intensity', 0.0, 50.0);
    gui_ambientLight2.add(ambientLight2.position, 'x', -50, 50);
    gui_ambientLight2.add(ambientLight2.position, 'y', -1000, 0);
    gui_ambientLight2.add(ambientLight2.position, 'z', 0, 2000);

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

    const props = {
      color: 0xFFFFFF,
      size: 12,
      render: true,
      rotate: false,
      'sleeve visibility': true,
      'vinyl 1 visibility': true,
      'vinyl 2 visibility': true,
      out: false,
      'covered ratio 1': 1.0,
      'covered ratio 2': 0.5,
      'sleeve rot': 60,
      'sleeve front rot': 0,
      'sleeve back rot': 0,
      'sleeve bump': 0.3,
      'vinyl bump': 0.3,
    };

    const self = this;
    const axes = this.axes;
    const camera = this._camera;

    const temp = {
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

    let lightParams = {
      spotLight1: {
        intensity: 1,
        distance: 0,
        angle: 0.314,
        penumbra: 10,
        decay: 0
      }
    };

    let gui = this.gui = new window.dat.GUI();
    let f1 = gui.addFolder('general');
    var renderController = f1.add(props, 'render');
    var rotationController = f1.add(props, 'rotate');
    var coveredRatioController = f1.add(props, 'covered ratio 1', 0.0, 1.2);
    var secondCoveredRatioController = f1.add(props, 'covered ratio 2', 0.0, 1.2);
    var sleeveRotationController = f1.add(props, 'sleeve rot', 0, 90);
    var sleeveFrontRotationController = f1.add(props, 'sleeve front rot', 0, 90);
    var sleeveBackRotationController = f1.add(props, 'sleeve back rot', 0, 90);
    var sleeveVisibilityController = f1.add(props, 'sleeve visibility');
    var firstVinylVisibilityController = f1.add(props, 'vinyl 1 visibility');
    var secondVinylVisibilityController = f1.add(props, 'vinyl 2 visibility');
    var captureController = f1.add(temp, 'capture');
    var sleeveBumpScaleController = f1.add(props, 'sleeve bump', 0, 1.0);
    var vinylBumpScaleController = f1.add(props, 'vinyl bump', 0, 1.0);

    f1.add(this, 'flip');

    let f2 = gui.addFolder('camera');
    f2.add(temp, 'zoom in');
    f2.add(temp, 'zoom out');
    f2.add(temp, 'rotate horizontal');
    f2.add(temp, 'rotate vertical');
    f2.add(temp, 'reset');
    f2.add(temp, 'toggle camera');

    renderController.onChange(function (value) {
      if (value) {
        self.startRender();
      } else {
        self.stopRender();
      }
    });

    rotationController.onChange(function (value) {
      
      if (value) {
        self.play();
      } else {
        self.pause();
      }
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
      self._sleeve.setGatefoldBackRotation(value);
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

    new TWEEN.Tween(this._camera.position)
      .to({ x: tx, y: ty, z: tz }, opts.duration)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(() => {
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));
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

    new TWEEN.Tween(this._camera.rotation)
      .to({ x: tx, y: ty, z: tz }, opts.duration)
      .easing(TWEEN.Easing.Quartic.Out)
      .onComplete(function () {
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

    let idx = 0;

    if (Vinyl.Index.SECOND === index) {
      idx = 1;
    }

    this._vinyls[idx].setVisibility(yn);

    if (callback) callback();
  };

  //--------------------------------------------------------------
  World.prototype.setGatefoldCoverAngle = function (degree, opts, callback) {

    if (Sleeve.Format.GATEFOLD !== this._sleeve.getFormat()) {
      console.warn('World.setGatefoldCoverAngle: changing rotation is not available for "' + this._sleeve.getFormat() + '"');
      return;
    }

    let param = {
      rotation: this._sleeve.getCurrentGatefoldAngle() * (180 / Math.PI)
    };

    new TWEEN.Tween(param)
      .stop()
      .to({ rotation: degree }, 500)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(() => {
        let angleInRadians = param.rotation * (Math.PI / 180);

        this._sleeve.setGatefoldCoverAngle(angleInRadians);
        this._vinyls[0].setFrontSleevePositionAndAngle(this._sleeve.getGatefoldFrontCoverPosition(), angleInRadians * 2);

        let offsetY = this._containerObject.getObjectByName('Back').getWorldPosition().y;

        if (Sleeve.Size.SIZE_7 === this._sleeve.getSize()) {
          offsetY += 0.15;
        }

        this._vinyls[1].setOffsetY(offsetY);
      })
      .onComplete(() => {
        if (callback) callback();
      })
      .start();
  };

  //--------------------------------------------------------------
  World.prototype.setSleeveVisibility = function (yn, opts, callback) {

    this._sleeve.setVisibility(yn);

    if (callback) callback();
  };

  //--------------------------------------------------------------
  World.prototype.setSize = function (size, opts, callback) {

    if (!size) {
      console.warn('World.onVinylSizeChanged: no size value passed');
      return Promise.reject('World.onVinylSizeChanged: no size value passed');
    }

    // to string
    size += '';

    if ('7' === size) {
      size = '7S';
    }

    if (-1 === Object.values(Vinyl.Size).indexOf(size)) {
      console.error('Unknown vinyl size "' + size + '"');
      return Promise.reject('Unknown vinyl size "' + size + '"');
    }
    
    return new Promise((resolve, reject) => {
      switch (size) {
        case '7':
        case '7S':
        case '7L':
          sleeveSize = Sleeve.Size.SIZE_7;
          scale = this._objectScales['7'];
          break;
        case '10':
          sleeveSize = Sleeve.Size.SIZE_10;
          scale = this._objectScales['10'];
          break;
        case '12':
          sleeveSize = Sleeve.Size.SIZE_12;
          scale = this._objectScales['12'];
          break;
      }
  
      Promise.all([
        this._vinyls[0].setOpacity(0, 300, 0),
        this._vinyls[1].setOpacity(0, 300, 0),
        this._sleeve.setOpacity(0, 300, 0),
      ])
        .then(() => {
          console.log('setSize: fade out');
          return Promise.all([
            this._vinyls[0].loadModelForSize(size),
            this._vinyls[1].loadModelForSize(size),
            this._sleeve.loadModelForSize(sleeveSize)
          ])
        })
        .then((results) => {
          return Promise.all([
            this._vinyls[0].setSize(size),
            this._vinyls[1].setSize(size),
            this._sleeve.setSize(sleeveSize, scale)
          ]);
        })
        .then(() => {
          this._containerObject.scale.set(scale, scale, scale);
          
          const format = this._sleeve.getFormat();
          console.log('size changed', this._sleeve.getSize(), this._sleeve.getFormat());
          

          if (Sleeve.Format.SINGLE === format || Sleeve.Format.SINGLE_WITHOUT_SPINE === format) {
            this._vinyls[0].setCoveredRatio(0, 0, 0);
            this._vinyls[1].setCoveredRatio(0, 0, 0);
            this._sleeve.setCoveredRatio(this._sleeve.getCoveredRatio());
          } else {
            let firstOffsetY, secondOffsetY;
            
            if (Sleeve.Format.GATEFOLD === format) {
              firstOffsetY = 0.08;
              secondOffsetY = this._containerObject.getObjectByName('Back').getWorldPosition().y;
  
              if (Sleeve.Size.SIZE_7 === this._sleeve.getSize()) {
                secondOffsetY += 0.15;
              }
  
              this.setGatefoldCoverAngle(this._sleeve.getCurrentGatefoldAngle() * (180 / Math.PI));
            } else if (Sleeve.Format.DOUBLE === format) {
              firstOffsetY = 0.6;
              secondOffsetY = -0.6;
            }

            this._vinyls[0].setCoveredRatio(this._vinyls[0].getCoveredRatio(), 0, firstOffsetY);
            this._vinyls[1].setCoveredRatio(this._vinyls[0].getCoveredRatio() * 2, 0, secondOffsetY);
          }

          this._vinyls[0].setOpacity(this._vinyls[0]._material.opacity, 250, 100);
          this._vinyls[1].setOpacity(this._vinyls[1]._material.opacity, 250, 100);
          this._sleeve.setOpacity(1.0, 250, 100);

          resolve();

          if (callback) callback();
        });
  
      
    });
  };

  //--------------------------------------------------------------
  World.prototype.flip = function (value) {
    console.log('World::flip', value);

    this._flip = !this._flip;

    this._flipTween
      .stop()
      .to({ _flipRotation: this._flip ? -Math.PI : 0 })
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(() => {
        this._containerObject.rotation.z = this._flipRotation;
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

    // 2枚組の場合はスリーブを動かし、シングルの場合はレコードを動かす
    if (Sleeve.Format.GATEFOLD === sleeveFormat || Sleeve.Format.DOUBLE === sleeveFormat) {

      if (Vinyl.Index.SECOND === opts.index) {
        if (1 === this._vinyls.length) {
          return;
        }
      }

      let index, offsetY;

      if (Vinyl.Index.FIRST === opts.index) {
        index = 0;
        
        if (Sleeve.Format.GATEFOLD === sleeveFormat) {
          offsetY = 0.08;
        } else {
          offsetY = 0.6;
        }
      } else if (Vinyl.Index.SECOND === opts.index) {
        index = 1;

        if (Sleeve.Format.GATEFOLD === sleeveFormat) {
          offsetY = this._containerObject.getObjectByName('Back').getWorldPosition().y;

          if (Sleeve.Size.SIZE_7 === this._sleeve.getSize()) {
            offsetY += 0.15;
          }
        } else {
          offsetY = -0.6;
        }
      }

      const param = {
        ratio: this._vinyls[index].getCoveredRatio()
      };

      new TWEEN.Tween(param)
        .stop()
        .to({ ratio: value }, opts.durarion || 500)
        .easing(TWEEN.Easing.Quartic.Out)
        .onUpdate(function () {
          self._vinyls[index].setCoveredRatio(this.ratio, 0, offsetY);
        })
        .start();
    } else {
      const param = {
        ratio: this._sleeve.getCoveredRatio()
      }

      this._vinyls.forEach(function (vinyl) {
        vinyl.setCoveredRatio(0, 0, 0);
      });

      new TWEEN.Tween(param)
        .stop()
        .to({ ratio: value }, opts.durarion || 500)
        .easing(TWEEN.Easing.Quartic.Out)
        .onUpdate(function () {
          self._sleeve.setCoveredRatio(this.ratio);
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
    let image = new Image();
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

    opts.duration = undefined !== opts.duration ? opts.duration : 2000;

    switch (Number(type)) {
      case 0:  // for capture rendered image
        const rate = 0.9;
        this.setCameraPosition(212 * rate, 288 * rate, 251 * rate, opts, callback);
        this._flip = true;
        this.flip();
        this.cover(0.25, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.5, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._controls.reset();
        break;
      case 1:
        this.setCameraPosition(62, 94, 105, opts, callback); // item detail rotation 1
        this._flip = true;
        this.flip();
        this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._controls.reset();
        break;
      case 2:
        this.setCameraPosition(0.01, 365, 10, opts, callback); // item detail rotation 2
        this._flip = true;
        this.flip();
        this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._controls.reset();
        break;
      case 3:
        this.setCameraPosition(0.01, 365, 50, opts, callback); // item detail rotation 3
        this._flip = false;
        this.flip();
        this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._controls.reset();
        break;
      case 4:
        this.setCameraPosition(0.01, 345, 400, opts, callback); // item detail rotation 4
        this._flip = false;
        this.flip();
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._controls.reset();
        break;
      case 5:
        this.setCameraPosition(0.01, 345, 400, opts, callback); // item detail rotation 5
        this._flip = true;
        this.flip();
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
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
        this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._controls.reset();
        break;
      case 10:
        this.setCameraPosition(0, 436, 1, opts, callback); // vinyl Side A
        this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._controls.reset();
        break;
      case 11:
        this.setCameraPosition(0, 170, 1, opts, callback); // label Side A
        this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._controls.reset();
        break;
      case 12:
        this.setCameraPosition(0, -170, -1, opts, callback); // label Side B
        this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._controls.reset();
        break;
      case 13:
        this.setCameraPosition(0, 400, 1, opts, callback); // sleeve Front
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._controls.reset();
        break;
      case 14:
        this.setCameraPosition(0, -400, -1, opts, callback); // sleeve Back
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._controls.reset();
        break;
      case 21:
        this.setPerspective();
        this.setSleeveVisibility(true);
        this.setCameraPosition(190 * 0.8, 259 * 0.8, 226 * 0.8, { duration: opts.duration });
        this.cover(0.25, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.5, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._controls.target = new THREE.Vector3(-30, 0, 24);
        this._controls.update();
        break;
      case 22:
        this.setPerspective();
        this.setSleeveVisibility(true);
        this.setCameraPosition(-250, 260, 260, { duration: opts.duration });
        this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._controls.target = new THREE.Vector3(-30, -210, -140);
        this._controls.update();
        break;
      case 23:
        this.setOrthographic();
        this.setSleeveVisibility(true);
        this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._camera.position.set(-75, 500, 10);
        this._controls.target = new THREE.Vector3(-75, 0, 0);
        this._controls.update();
        break;
      case 24:
        this.setOrthographic();
        this.setSleeveVisibility(true);
        this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._camera.position.set(-75, -500, -10);
        this._controls.target = new THREE.Vector3(-75, 0, 0);
        this._controls.update();
        break;
      case 25:
        this.setOrthographic();
        this.setSleeveVisibility(true);
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._camera.position.set(0, 500, 10);
        this._controls.target = new THREE.Vector3(0, 0, 0);
        this._controls.update();
        break;
      case 26:
        this.setOrthographic();
        this.setSleeveVisibility(true);
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._camera.position.set(0, -500, -10);
        this._controls.target = new THREE.Vector3(0, 0, 0);
        this._controls.update();
        break;
      case 27:
        this.setOrthographic();
        this.setSleeveVisibility(false);
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._camera.position.set(0, 400, 10);
        this._controls.target = new THREE.Vector3(0, 0, 0);
        this._camera.setZoom(320);
        this._controls.update();
        break;
      case 28:
        this.setOrthographic();
        this.setSleeveVisibility(false);
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this._camera.position.set(0, -328, -10);
        this._controls.target = new THREE.Vector3(0, 0, 0);
        this._camera.setZoom(320);
        this._controls.update();
        break;
      case 29:
        this.setOrthographic();
        this.setSleeveVisibility(false);
        this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
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

    if (0 < this._vinyls.length) {
      this._vinyls.forEach(function (vinyl) {
        vinyl.update();
      });
    }

    this._controls.update();

    if (this.spotLightHelper1) {
      this.spotLightHelper1.update();
    }
    this._lights.position.copy(this._camera.position);
    // this._lights.lookAt(new THREE.Vector3(0, 0, 0));
    this._lights.lookAt(this._controls.target);

    // let cameraPosition = this._camera.position;
    // let vinyl1Position = this._vinyls[0]._currentObject.position;
    // let vinyl2Position = this._vinyls[1]._currentObject.position;

    // if (cameraPosition) {
    //   console.log('distance from camera', cameraPosition.distanceTo(vinyl1Position), cameraPosition.distanceTo(vinyl2Position));
    // }
    
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

    const parent = this._parent;

    for (let i in parent.vinyls) {
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

    parent.sleeve.on('size', this.onSleeveSizeChanged.bind(this));
    parent.sleeve.on('hole', this.onSleeveHoleChanged.bind(this));
    parent.sleeve.on('finish', this.onSleeveFinishChanged.bind(this));
    parent.sleeve.on('colorMap', this.onSleeveColorMapChanged.bind(this));
    parent.sleeve.on('aoMap', this.onSleeveAoMapChanged.bind(this));
    parent.sleeve.on('bumpMap', this.onSleeveBumpMapChanged.bind(this));

    return this;
  };

  //--------------------------------------------------------------
  World.prototype.undelegateEvents = function () {
    const parent = this._parent;

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

    const firstVinylSize = this._convertSizeToNumber(this._vinyls[0].getSize());
    const secondVinylSize = firstVinylSize;

    if (1 < this._vinyls.length) {
      secondVinylSize = this._convertSizeToNumber(this._vinyls[1].getSize());
    }

    const largerSize = Math.max(firstVinylSize, secondVinylSize);

    let sleeveSize;
    let scale;

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
  };

  //--------------------------------------------------------------
  World.prototype.onLabelOptionChanged = function (target, value) {

    if (value === true) {
      target.enableLabel();
    } else {
      target.disableLabel();
    }
  };

  //--------------------------------------------------------------
  World.prototype.onVinylSpeedChanged = function (target, rpm) {

    target.setRPM(rpm);
  };

  //--------------------------------------------------------------
  World.prototype.onVinylAlphaMapChanged = function (target, image) {

    target.setAlphaMap(image);
  };

  //--------------------------------------------------------------
  World.prototype.onVinylAoMapChanged = function (target, image) {

    target.setAoMap(image);
  };

  //--------------------------------------------------------------
  World.prototype.onVinylBumpMapChanged = function (target, image) {

    target.setBumpMap(image);
  };

  //--------------------------------------------------------------
  World.prototype.onVinylColorMapChanged = function (target, image) {

    target.setColorMap(image);
  };

  //--------------------------------------------------------------
  World.prototype.onLabelAoMapChanged = function (target, image) {

    target.setLabelAoMap(image);
  };

  //--------------------------------------------------------------
  World.prototype.onLabelBumpMapChanged = function (target, image) {

    target.setLabelBumpMap(image);
  };

  //--------------------------------------------------------------
  World.prototype.onLabelColorMapChanged = function (target, image) {

    target.setLabelColorMap(image);
  };

  //--------------------------------------------------------------
  World.prototype.onSleeveSizeChanged = function (value) {

    this._sleeve.setSize(value);

    if (Sleeve.Format.GATEFOLD === this._sleeve.getFormat()) {
      this._vinyls[0].setFrontSleevePositionAndAngle(this._sleeve.getGatefoldFrontCoverPosition(), this._sleeve.getCurrentGatefoldAngle() * 2);
      this._vinyls[1].setOffsetY(this._containerObject.getObjectByName('Back').getWorldPosition().y);
    }
  };

  //--------------------------------------------------------------
  World.prototype.onSleeveHoleChanged = function (value) {

    return this._sleeve.setHole(value ? Sleeve.Hole.HOLED : Sleeve.Hole.NO_HOLE);
  };

  //--------------------------------------------------------------
  World.prototype.onSleeveFinishChanged = function (value) {

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
  World.prototype.setSleeveFormat = function (format) {

    let lastFormat = this._sleeve.getFormat();

    if (lastFormat === format) {
      return Promise.resolve(lastFormat);
    }

    let coveredRatio = 0.0;
    
    if (Sleeve.Format.SINGLE_WITHOUT_SPINE === lastFormat || Sleeve.Format.SINGLE === lastFormat) {
      coveredRatio = this._sleeve.getCoveredRatio();
    } else {
      coveredRatio = this._vinyls[0].getCoveredRatio();
    }

    return new Promise((resolve, reject) => {
      
      this._sleeve.setOpacity(0.0, 250)
        .then(() => {
          return this._sleeve.setFormat(format);
        })
        .then((sleeve) => {

          this._vinyls.forEach(function (vinyl) {
            vinyl.setFrontSleevePositionAndAngle(new THREE.Vector3(), 0);
          });
          
          let newFormat = this._sleeve.getFormat();

          let firstOffsetY, secondOffsetY;

          if (Sleeve.Format.GATEFOLD === newFormat) {
            firstOffsetY = 0.08;
            secondOffsetY = this._containerObject.getObjectByName('Back').getWorldPosition().y;

            if (Sleeve.Size.SIZE_7 === this._sleeve.getSize()) {
              secondOffsetY += 0.15;
            }
          } else if (Sleeve.Format.DOUBLE === newFormat) {
            firstOffsetY = 0.6;
            secondOffsetY = -0.6;
          } else {
            firstOffsetY = 0.0;
            secondOffsetY = 0.0;
          }

          if (Sleeve.Format.SINGLE_WITHOUT_SPINE === lastFormat || Sleeve.Format.SINGLE === lastFormat) {
            if (Sleeve.Format.SINGLE_WITHOUT_SPINE === newFormat || Sleeve.Format.SINGLE === newFormat) {
              this._sleeve.setCoveredRatio(coveredRatio);
            } else if (Sleeve.Format.DOUBLE === newFormat || Sleeve.Format.GATEFOLD === newFormat) {

              let opts = this._vinyls[0].getCurrentProperties();
              opts.index = Vinyl.Index.SECOND;

              this._vinyls[1].copy(this._vinyls[0])
                .then(() => {
                  this._vinyls[1].setVisibility(true);

                  this._vinyls[0].setOpacity(this._vinyls[0]._material.opacity, 1000, 250);
                  this._vinyls[1].setOpacity(this._vinyls[1]._material.opacity, 1000, 250);
                  
                  this._vinyls[0].setCoveredRatio(coveredRatio, 0, firstOffsetY);
                  this._vinyls[1].setCoveredRatio(Math.min(coveredRatio * 2, 1.0), 0, secondOffsetY);
                  this._sleeve.setCoveredRatio(0);
                });
            }
          } else if (Sleeve.Format.DOUBLE === lastFormat || Sleeve.Format.GATEFOLD === lastFormat) {
            if (Sleeve.Format.SINGLE_WITHOUT_SPINE === newFormat || Sleeve.Format.SINGLE === newFormat) {
              this._vinyls[1].setVisibility(false);

              this._vinyls[0].setCoveredRatio(0, 0, firstOffsetY);
              this._vinyls[1].setCoveredRatio(0, 0, secondOffsetY);
              this._sleeve.setCoveredRatio(coveredRatio);
            } else if (Sleeve.Format.DOUBLE === newFormat || Sleeve.Format.GATEFOLD === newFormat) {
              this._vinyls[0].setCoveredRatio(coveredRatio, 0, firstOffsetY);
              this._vinyls[1].setCoveredRatio(Math.min(coveredRatio * 2, 1.0), 0, secondOffsetY);
            }
          }

          return this._sleeve.setOpacity(1.0, 250);
        })
        .then(() => {
          resolve(this._sleeve.getFormat());
        });;
    });
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
})(this, (this.qvv = (this.qvv || {})));
