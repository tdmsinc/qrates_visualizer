
//= require tdmsinc-three.js.js
//= require ../emitter
//= require_tree .
//= require_self

((global, exports) => {
  
  let gui, axes;

  /**
   * Module dependencies.
   */

  const Emitter = exports.Emitter;
  const Vinyl = exports.world.Vinyl;
  const Sleeve = exports.world.Sleeve;

  /**
   * @param {VisualEditor} parent
   * @param {Object} assets
   * @param {Object} opts
   * @api public
   */

  class World  {

    //--------------------------------------------------------------
    constructor(parent, assets, opts) {

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
        '7S': 1,
        '7L': 1,
        '7': 1,
        '10': 0.6890566038,
        '12': 0.5833865815
      };
  
      this._width = opts.width;
      this._height = opts.height;
  
      this._isRendering = false;
  
      // scene
      this._scene = new THREE.Scene();
  
      // camera
      this._camera = new THREE.CombinedCamera(this._width / 2, this._height / 2, this._opts.camera.fov, this._opts.camera.near, this._opts.camera.far, -500, this._opts.camera.far);
      this._camera.lookAt(new THREE.Vector3(0, 0, 0));
      this._camera.position.set(212, 288, 251);
      this._orthographicZoom = 170;
  
      if ('orthographic' === this._opts.camera.type) {
        this.setOrthographic();
      }
  
      // renderer
      this._renderer = new THREE.WebGLRenderer(this._opts.renderer);
      this._renderer.setPixelRatio(this._opts.pixelRatio || window.devicePixelRatio || 1);
      this._renderer.setSize(this._width, this._height);
      this._renderer.autoClear = false;
      this._renderer.setClearColor(0, 0.0);
      this._renderer.sortObjects = false;
  
      this._opts.camera.control = undefined !== this._opts.camera.control ? this._opts.camera.control : true;
  
      // controls
      this._controls = new THREE.TrackballControls(this._camera, this._parent.el);
      this._controls.minDistance = 100;
      this._controls.maxDistance = 700;
      this._controls.target = new THREE.Vector3(0, 0, 0);
      this._controls.handleResize({ left: 0, top: 0, width: opts.width, height: opts.height });
      this._controls.update();
      this._controls.enabled = this._opts.camera.control;

      // lights
      this._topSpotLight = new THREE.SpotLight(0xffffff, 0.5, 0, 0.314, 0.26, 1);
      this._topSpotLight.position.set(-159, 2000, -120);
      this._scene.add(this._topSpotLight);
  
      this._bottomSpotLight = new THREE.SpotLight(0xffffff, 0.5, 0, 0.314, 0.26, 1);
      this._bottomSpotLight.position.set(159, -2000, 120);
      this._scene.add(this._bottomSpotLight);

      this._sideSpotLight = new THREE.SpotLight(0xffffff, 0.3, 0, 0.314, 0.26, 1);
      this._sideSpotLight.position.set(-500, 0, 0);
      this._scene.add(this._sideSpotLight);
  
      this._ambientLight = new THREE.AmbientLight(0x0D0D0D, 10);
      this._scene.add(this._ambientLight);
    
      // 
      this._enableRotate = false;
      this._flip = false;
  
      // sleeve と vinyl がぶら下がるコンテナ
      this._containerObject = new THREE.Object3D();
      this._containerObject.name = 'container';

      let vinylSize_1 = this._opts.defaults.vinyl[0].size;
      vinylSize_1 = -1 < vinylSize_1.indexOf('7') ? '7' : vinylSize_1;

      let vinylSize_2 = vinylSize_1;
      
      if (1 < this._opts.defaults.vinyl.length) {
        vinylSize_2 = this._opts.defaults.vinyl[1].size;
        vinylSize_2 = -1 < vinylSize_2.indexOf('7') ? '7' : vinylSize_2;
      }

      let sleeveSize;

      if (parseInt(vinylSize_1) > parseInt(vinylSize_2)) {
        sleeveSize = vinylSize_1;
      } else {
        sleeveSize = vinylSize_2;
      }
      
      this._opts.defaults.sleeve.size = sleeveSize;
  
      // sleeve
      this._sleeve = new Sleeve(this._assets, this._containerObject, this._opts.loader);

      // vinyl
      this._vinyls = [
        new Vinyl(this._assets, this._containerObject, this._opts.loader),
        new Vinyl(this._assets, this._containerObject, this._opts.loader)
      ];
    }

    //--------------------------------------------------------------
    async setup() {

      await this._sleeve.setup(this._opts.defaults.sleeve);
      
      this._sleeve.setObjectScale(this._objectScales[this._opts.defaults.sleeve.size]);
      
      // sleeve が single で複数の vinyl オプションが渡された場合は2つ目以降のオプションを削除して single フォーマットを採用する
      if ((Sleeve.Format.SINGLE_WITHOUT_SPINE === this._opts.defaults.sleeve.format || Sleeve.Format.SINGLE === this._opts.defaults.sleeve.format)) {
        if (1 < this._opts.defaults.vinyl.length) {
          console.warn('World: too many options for vinyl');
          
          this._opts.defaults.vinyl.pop();
          this._opts.defaults.vinyl.length = 1;
        }
      }

      // sleeve format に応じて vinyl の位置をオフセット
      const sleeveFormat = this._sleeve.getFormat();

      let firstOffsetY, secondOffsetY;
      
      if (Sleeve.Format.GATEFOLD === sleeveFormat) {
        firstOffsetY = 0.08;
        secondOffsetY = this._containerObject.getObjectByName('Back').getWorldPosition().y;

        if (Sleeve.Size.SIZE_7 === this._sleeve.getSize()) {
          secondOffsetY += 0.15;
        } else if (Sleeve.Size.SIZE_10 === this._sleeve.getSize()) {
          secondOffsetY += 0.2;
        } else if (Sleeve.Size.SIZE_12 === this._sleeve.getSize()) {
          secondOffsetY += 0.2;
        }
      } else if (Sleeve.Format.DOUBLE === sleeveFormat) {
        firstOffsetY = 0.6;
        secondOffsetY = -0.6;
      } else {
        firstOffsetY = 0.0;
        secondOffsetY = 0.0;
      }

      let targets = [];

      if (1 == this._opts.defaults.vinyl.length) {
        this._opts.defaults.vinyl.push(this._opts.defaults.vinyl[0]);
      }

      // vinyl オプションから vinyl を生成
      for (let i in this._opts.defaults.vinyl) {
        this._opts.defaults.vinyl[i].index = Object.values(Vinyl.Index)[i];
        this._opts.defaults.vinyl[i].offsetY = 0 == i ? firstOffsetY : secondOffsetY;

        if ((Sleeve.Format.SINGLE_WITHOUT_SPINE === this._opts.defaults.sleeve.format || Sleeve.Format.SINGLE === this._opts.defaults.sleeve.format)) {
          this._opts.defaults.vinyl[i].visibility = 0 == i ? true : false;
        } else {
          this._opts.defaults.vinyl[i].visibility = true;
        }

        targets.push(this._vinyls[i].setup(this._opts.defaults.vinyl[i]));
      }

      await Promise.all(targets);
        
      // scale を設定
      const scale = this._objectScales[this._vinyls[0]._size];
      this._containerObject.scale.set(scale, scale, scale);
      this._containerObject.position.set(0, 0, 0);

      this._flipRotation = 0;
      this._flipTween = new TWEEN.Tween(this);

      this._presets = {};
      this.registerPresets();

      this.initGui();

      this._scene.add(this._containerObject);

      if (this._opts.defaults.hasOwnProperty('view')) {
        this.updateView(this._opts.defaults.view, { duration: 0 });
      }

      // シングルスリーブの場合は2枚目の vinyl を表示しない
      if ((Sleeve.Format.SINGLE_WITHOUT_SPINE === this._opts.defaults.sleeve.format || Sleeve.Format.SINGLE === this._opts.defaults.sleeve.format)) {
        this._vinyls[1].setVisibility(false);
      }

      return this;
    }

    //--------------------------------------------------------------
    getRenderer() {
      return this._renderer;
    }
  
    //--------------------------------------------------------------
    registerPresets() {
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
    initGui() {

      if (!window.dat) {
        console.warn('dat.GUI is not loaded');
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
  
      const cameraProps = {
        x: 0.0, y: 17.0, z: 30.0,
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
  
      if (!this.gui) {
        this.gui = new window.dat.GUI();
      }

      const generalParamsFolder = this.gui.addFolder('general');
      const renderController = generalParamsFolder.add(props, 'render');
      const rotationController = generalParamsFolder.add(props, 'rotate');
      const coveredRatioController = generalParamsFolder.add(props, 'covered ratio 1', 0.0, 1.2);
      const secondCoveredRatioController = generalParamsFolder.add(props, 'covered ratio 2', 0.0, 1.2);
      const sleeveRotationController = generalParamsFolder.add(props, 'sleeve rot', 0, 90);
      const sleeveFrontRotationController = generalParamsFolder.add(props, 'sleeve front rot', 0, 90);
      const sleeveBackRotationController = generalParamsFolder.add(props, 'sleeve back rot', 0, 90);
      const sleeveVisibilityController = generalParamsFolder.add(props, 'sleeve visibility');
      const firstVinylVisibilityController = generalParamsFolder.add(props, 'vinyl 1 visibility');
      const secondVinylVisibilityController = generalParamsFolder.add(props, 'vinyl 2 visibility');
      const captureController = generalParamsFolder.add(temp, 'capture');
      const zoomController = generalParamsFolder.add(props, 'zoom', 0, 400);
      const vinylOffsetYController = generalParamsFolder.add(props, 'vinyl offsetY', 0.0, 2.0);
      const cameraXController = generalParamsFolder.add(cameraProps, 'x', -1000.0, 1000.0);
      const cameraYController = generalParamsFolder.add(cameraProps, 'y', -1000.0, 1000.0);
      const cameraZController = generalParamsFolder.add(cameraProps, 'z', -1000.0, 1000.0);
      const sleeveBumpScaleController = generalParamsFolder.add(props, 'sleeve bump', 0, 1.0);
      const vinylBumpScaleController = generalParamsFolder.add(props, 'vinyl bump', 0, 1.0);
      const sleeveAoController = generalParamsFolder.add(props, 'sleeve ao', 0.0, 1.0);
      const vinylAoController = generalParamsFolder.add(props, 'vinyl ao', 0.0, 1.0);
  
      generalParamsFolder.add(this, 'flip');
  
      generalParamsFolder.add(temp, 'zoom in');
      generalParamsFolder.add(temp, 'zoom out');
      generalParamsFolder.add(temp, 'rotate horizontal');
      generalParamsFolder.add(temp, 'rotate vertical');
      generalParamsFolder.add(temp, 'reset');
      generalParamsFolder.add(temp, 'toggle camera');
  
      renderController.onChange(value => {
        if (value) {
          self.startRender();
        } else {
          self.stopRender();
        }
      });
  
      rotationController.onChange(value => {
        
        if (value) {
          self.play();
        } else {
          self.pause();
        }
      });
  
      coveredRatioController.onChange(value => {
        this.cover(value, { duration: 2000, index: Vinyl.Index.FIRST });
      });
  
      secondCoveredRatioController.onChange(value => {
        this.cover(value, { duration: 2000, index: Vinyl.Index.SECOND });
      });
  
      sleeveRotationController.onChange(value => {
        this.setGatefoldCoverAngle(value);
      });
  
      sleeveFrontRotationController.onChange(value => {
        this.setSleeveFrontRotation(value);
      });
  
      sleeveBackRotationController.onChange(value => {
        this._sleeve.setGatefoldBackRotation(value);
      });
  
      sleeveVisibilityController.onChange(value => {
        this._sleeve.setVisibility(value);
      });
  
      firstVinylVisibilityController.onChange(value => {
        this.setVinylVisibility(Vinyl.Index.FIRST, value, null, function () {
        });
      });
  
      secondVinylVisibilityController.onChange(value => {
        this.setVinylVisibility(Vinyl.Index.SECOND, value, null, function () {
        });
      });
  
      zoomController.onChange(value => {
        this.zoom(value);
      });
  
      vinylOffsetYController.onChange(value => {
        this._vinyls[0].setOffsetY(value);
  
        if (1 === this._vinyls.length) {
          return;
        }
  
        this._vinyls[1].setOffsetY(-value);
      });
  
      cameraXController.onChange(value => {
        this.setCameraPosition(cameraProps.x, cameraProps.y, cameraProps.z, { duration: 0 });
      });
      cameraYController.onChange(value => {
        this.setCameraPosition(cameraProps.x, cameraProps.y, cameraProps.z, { duration: 0 });
      });
      cameraZController.onChange(value => {
        this.setCameraPosition(cameraProps.x, cameraProps.y, cameraProps.z, { duration: 0 });
      });
  
      sleeveBumpScaleController.onChange(value => {
        if (!this._sleeve) {
          return;
        }
  
        this._sleeve.setBumpScale(value);
      });
  
      vinylBumpScaleController.onChange(value => {
        if (0 === this._vinyls.length) {
          return;
        }
  
        this._vinyl.setBumpScale(value);
      });

      // lights' parameters
      const lightParamsFolder = this.gui.addFolder('lights');
      
      const topSpotLightParamsFolder = lightParamsFolder.addFolder('spot light - top');
      topSpotLightParamsFolder.add(this._topSpotLight, 'intensity', 0, 1);
      topSpotLightParamsFolder.add(this._topSpotLight, 'distance', 0, 200);
      topSpotLightParamsFolder.add(this._topSpotLight, 'angle', 0, 1.05);
      topSpotLightParamsFolder.add(this._topSpotLight, 'penumbra', 0, 1);
      topSpotLightParamsFolder.add(this._topSpotLight, 'decay', 0, 2);
      topSpotLightParamsFolder.add(this._topSpotLight.position, 'x', -2000, 2000);
      topSpotLightParamsFolder.add(this._topSpotLight.position, 'y', -2000, 2000);
      topSpotLightParamsFolder.add(this._topSpotLight.position, 'z', -2000, 2000);

      const bottomSpotLightParamsFolder = lightParamsFolder.addFolder('spot light - bottom');
      bottomSpotLightParamsFolder.add(this._bottomSpotLight, 'intensity', 0, 1);
      bottomSpotLightParamsFolder.add(this._bottomSpotLight.position, 'x', -2000, 2000);
      bottomSpotLightParamsFolder.add(this._bottomSpotLight.position, 'y', -2000, 2000);
      bottomSpotLightParamsFolder.add(this._bottomSpotLight.position, 'z', -2000, 2000);

      const sideSpotLightParamsFolder = lightParamsFolder.addFolder('spot light - side');
      sideSpotLightParamsFolder.add(this._sideSpotLight, 'intensity', 0, 1);
      sideSpotLightParamsFolder.add(this._sideSpotLight, 'distance', 0, 200);
      sideSpotLightParamsFolder.add(this._sideSpotLight, 'angle', 0, 1.05);
      sideSpotLightParamsFolder.add(this._sideSpotLight, 'penumbra', 0, 1);
      sideSpotLightParamsFolder.add(this._sideSpotLight, 'decay', 0, 2);
      sideSpotLightParamsFolder.add(this._sideSpotLight.position, 'x', -500, 0);
      sideSpotLightParamsFolder.add(this._sideSpotLight.position, 'y', -500, 500);
      sideSpotLightParamsFolder.add(this._sideSpotLight.position, 'z', -500, 500);

      const ambientLightParamsFolder = lightParamsFolder.addFolder('ambient light');
      ambientLightParamsFolder.add(this._ambientLight, 'intensity', 0, 10);

      // light helpers
      this._topSpotLightHelper = new THREE.SpotLightHelper(this._topSpotLight, 0xff0000);
      this._bottomSpotLightHelper = new THREE.SpotLightHelper(this._bottomSpotLight, 0x00ff00);
      this._sideSpotLightHelper = new THREE.SpotLightHelper(this._sideSpotLight, 0x0000ff);

      this._scene.add(this._topSpotLightHelper);
      this._scene.add(this._bottomSpotLightHelper);
      this._scene.add(this._sideSpotLightHelper);

      const lightHelperToggles = {
        topSpotLight: true,
        bottomSpotLight: true,
        sideSpotLight: true
      };

      const topSpotLightHelperController = topSpotLightParamsFolder.add(lightHelperToggles, 'topSpotLight');
      topSpotLightHelperController.onChange(value => {
        this._topSpotLightHelper.visible = value;
      });

      const bottomSpotLightHelperController = bottomSpotLightParamsFolder.add(lightHelperToggles, 'bottomSpotLight');
      bottomSpotLightHelperController.onChange(value => {
        this._bottomSpotLightHelper.visible = value;
      });

      const sideSpotLightHelperController = sideSpotLightParamsFolder.add(lightHelperToggles, 'sideSpotLight');
      sideSpotLightHelperController.onChange(value => {
        this._sideSpotLightHelper.visible = value;
      });

      // axis
      this._axisHelper = new THREE.AxisHelper(100);
      this._scene.add(this._axisHelper);
    };
  
    //--------------------------------------------------------------
    setCameraPosition(x, y, z, opts, callback) {

      if (!callback) {
        callback = null;
      }
  
      opts = opts || {
        duration: 1000
      };
  
      opts.duration = undefined === opts.duration ? 1000 : opts.duration;
  
      new TWEEN.Tween(this._camera.position)
        .stop()
        .to({ x, y, z }, opts.duration)
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
    setCameraPositionAndTarget(x, y, z, tx, ty, tz, opts, callback) {
      
      if (!callback) {
        callback = null;
      }
  
      opts = opts || {
        duration: 1000
      };
  
      opts.duration = undefined === opts.duration ? 1000 : opts.duration;

      let param = {
        x: this._camera.position.x,
        y: this._camera.position.y,
        z: this._camera.position.z,
        tx: this._controls.target.x,
        ty: this._controls.target.y,
        tz: this._controls.target.z
      };

      // this._controls.reset();
      
      new TWEEN.Tween(param)
        .stop()
        .to({ x, y, z, tx, ty, tz }, opts.duration)
        .easing(TWEEN.Easing.Quartic.Out)
        .onUpdate(() => {
          this._camera.position.set(param.x, param.y, param.z);
          // this._camera.lookAt(new THREE.Vector3(0, 0, 0));
          this._controls.target.set(param.tx, param.ty, param.tz);// = new THREE.Vector3(tx, ty, tz);
        })
        .onComplete(function () {
          if (callback) callback();
        })
        .start();
    };
          
    //--------------------------------------------------------------
    setCameraRotation(tx, ty, tz, opts, callback) {

      if (!callback) {
        callback = null;
      }
  
      opts = opts || {
        duration: 1000
      };
  
      opts.duration = undefined === opts.duration ? 1000 : opts.duration;
  
      new TWEEN.Tween(this._camera.rotation)
        .to({ x: tx, y: ty, z: tz }, opts.duration)
        .easing(TWEEN.Easing.Quartic.Out)
        .onComplete(function () {
          if (callback) callback();
        })
        .start();
    };
  
    //--------------------------------------------------------------
    resetCamera() {
      this._camera = new THREE.CombinedCamera(this._width / 2, this._height / 2, this._opts.camera.fov, this._opts.camera.near, this._opts.camera.far, -500, this._opts.camera.far);
      this._camera.position.set(212, 288, 251);
      this._camera.lookAt(new THREE.Vector3(0, 0, 0));
  
      this._controls = new THREE.TrackballControls(this._camera, this._parent.el);
      this._controls.target = new THREE.Vector3(0, 0, 0);
      this._controls.handleResize({ left: 0, top: 0, width: this._width, height: this._height });
      this._controls.update();
    };
  
    //--------------------------------------------------------------
    setPerspective() {
      this._camera.toPerspective();
      this._camera.setZoom(1);
    };
  
    //--------------------------------------------------------------
    setOrthographic() {
      this._camera.toOrthographic();
      this._camera.setZoom(this._orthographicZoom);
    };
  
    //--------------------------------------------------------------
    setVinylVisibility(index, yn, opts, callback) {
  
      let idx = 0;
  
      if (Vinyl.Index.SECOND === index) {
        idx = 1;
      }
  
      this._vinyls[idx].setVisibility(yn);
  
      if (callback) callback();
    };
  
    //--------------------------------------------------------------
    setGatefoldCoverAngle(degree, opts, callback) {
  
      if (Sleeve.Format.GATEFOLD !== this._sleeve.getFormat()) {
        console.warn('World.setGatefoldCoverAngle: changing rotation is not available for "' + this._sleeve.getFormat() + '"');
        return;
      }
  
      let param = {
        rotation: this._sleeve.getCurrentGatefoldAngle() * (180 / Math.PI)
      };
  
      opts = opts || { duration: 500 };
      
      new TWEEN.Tween(param)
        .stop()
        .to({ rotation: degree }, opts.duration)
        .easing(TWEEN.Easing.Quartic.Out)
        .onUpdate(() => {

          let angleInRadians = param.rotation * (Math.PI / 180);
  
          this._sleeve.setGatefoldCoverAngle(angleInRadians);
          this._vinyls[0].setFrontSleevePositionAndAngle(this._sleeve.getGatefoldFrontCoverPosition(), angleInRadians * 2);
          let offsetY = this._containerObject.worldToLocal(this._containerObject.getObjectByName('Back').getWorldPosition()).y;

          if (Sleeve.Size.SIZE_7 === this._sleeve.getSize()) {
            offsetY += 0.15;
          } else if (Sleeve.Size.SIZE_10 === this._sleeve.getSize()) {
            offsetY += 0.2;
          } else if (Sleeve.Size.SIZE_12 === this._sleeve.getSize()) {
            offsetY += 0.2;
          }
  
          this._vinyls[1].setOffsetY(offsetY);
        })
        .onComplete(() => {
          if (callback) callback();
        })
        .start();
    };
  
    //--------------------------------------------------------------
    async setSize(size, opts, callback) {
  
      if (!size) {
        throw new Error('World.onVinylSizeChanged: no size value passed');
      }
  
      // to string
      size += '';
  
      if ('7' === size) {
        size = '7S';
      }
  
      if (-1 === Object.values(Vinyl.Size).indexOf(size)) {
        throw new Error('Unknown vinyl size "' + size + '"');
      }
      
      let sleeveSize, scale;

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

      await Promise.all([
        this._vinyls[0].loadModelForSize(size),
        this._vinyls[1].loadModelForSize(size),
        this._sleeve.loadModelForSize(sleeveSize)
      ]);

      // await Promise.all([
      //   this._vinyls[0].setOpacity(0, 300, 0),
      //   this._vinyls[1].setOpacity(0, 300, 0),
      //   this._sleeve.setOpacity(0, 300, 0),
      // ]);

      await Promise.all([
        this._vinyls[0].setSize(size),
        this._vinyls[1].setSize(size),
        this._sleeve.setSize(sleeveSize, scale)
      ]);

      this._containerObject.scale.set(scale, scale, scale);

      const format = this._sleeve.getFormat();

      let firstOffsetY, secondOffsetY;

      if (Sleeve.Format.GATEFOLD === format) {
        firstOffsetY = 0.08;
        secondOffsetY = this._containerObject.getObjectByName('Back').getWorldPosition().y;

        if (Sleeve.Size.SIZE_7 === this._sleeve.getSize()) {
          secondOffsetY += 0.15;
        } else if (Sleeve.Size.SIZE_10 === this._sleeve.getSize()) {
          secondOffsetY += 0.2;
        } else if (Sleeve.Size.SIZE_12 === this._sleeve.getSize()) {
          secondOffsetY += 0.2;
        }

        this.setGatefoldCoverAngle(this._sleeve.getCurrentGatefoldAngle() * (180 / Math.PI));
      } else if (Sleeve.Format.DOUBLE === format) {
        firstOffsetY = 0.6;
        secondOffsetY = -0.6;
      }

      this._vinyls[0].setCoveredRatio(this._vinyls[0].getCoveredRatio(), 0, firstOffsetY);
      this._vinyls[1].setCoveredRatio(this._vinyls[0].getCoveredRatio() * 2, 0, secondOffsetY);

      this._vinyls[0].setOpacity(this._vinyls[0]._material.opacity, 0, 0);
      this._vinyls[1].setOpacity(this._vinyls[1]._material.opacity, 0, 0);
      this._sleeve.setOpacity(1.0, 0, 0);

      return this;
    };

    //--------------------------------------------------------------
    updateVinylRenderOrder() {

      if (0 === this._vinyls.length) {
        return;
      }
      
      if (!this._vinyls[1]._visibility) {
        this._vinyls[0].setTransparent(true);
        this._vinyls[0].setRenderOrder(0);
      } else {
        if (0 < this._camera.getWorldDirection().y) {
          this._vinyls[0].setTransparent(false);
          this._vinyls[1].setTransparent(true);

          this._vinyls[0].setRenderOrder(2);
          this._vinyls[1].setRenderOrder(1);
        } else {
          this._vinyls[0].setTransparent(true);
          this._vinyls[1].setTransparent(false);

          this._vinyls[0].setRenderOrder(1);
          this._vinyls[1].setRenderOrder(2);
        }
      }
    }
  
    //--------------------------------------------------------------
    flip(value, opts) {
      if (value === undefined) {
        this._flip = !this._flip;
        // console.log('(toggled) flip to', this._flip);
      } else {
        this._flip = value;
        // console.log('(set as) flip to', this._flip);
      }

      opts = opts || { duration: 1000 };
  
      this._flipTween
        .stop()
        .to({ _flipRotation: this._flip ? -Math.PI : 0 }, opts.duration)
        .easing(TWEEN.Easing.Quartic.Out)
        .onUpdate(() => {
          this._containerObject.rotation.z = this._flipRotation;
        })
        .start();
    };
  
    //--------------------------------------------------------------
    cover(value, opts) {
      opts = opts || { duration: 500 };
      
      const self = this;
      const sleeveFormat = this._sleeve.getFormat();
  
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
        } else if (Sleeve.Format.DOUBLE === sleeveFormat) {
          offsetY = 0.6;
        } else {
          offsetY = 0;
        }
      } else if (Vinyl.Index.SECOND === opts.index) {
        index = 1;

        if (Sleeve.Format.GATEFOLD === sleeveFormat) {
          offsetY = this._containerObject.worldToLocal(this._containerObject.getObjectByName('Back').getWorldPosition()).y;

          if (Sleeve.Size.SIZE_7 === this._sleeve.getSize()) {
            offsetY += 0.15;
          } else if (Sleeve.Size.SIZE_10 === this._sleeve.getSize()) {
            offsetY += 0.2;
          } else if (Sleeve.Size.SIZE_12 === this._sleeve.getSize()) {
            offsetY += 0.2;
          }
  
        } else if (Sleeve.Format.DOUBLE === sleeveFormat) {
          offsetY = -0.6;
        } else {
          offsetY = 0;
        }
      }

      const param = {
        ratio: this._vinyls[index].getCoveredRatio()
      };
      new TWEEN.Tween(param)
        .stop()
        .to({ ratio: value }, opts.duration)
        .easing(TWEEN.Easing.Quartic.Out)
        .onUpdate(function () {
          self._vinyls[index].setCoveredRatio(this.ratio, 0, offsetY);
        })
        .start();
    };
  
    //--------------------------------------------------------------
    zoomIn(step) {
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
    zoomOut(step) {
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
    capture(callback) {
      let image = new Image();
      image.src = this._renderer.domElement.toDataURL('image/png');
      image.onload = function () {
        if (callback) callback(null, this);
      };
    };
  
    //--------------------------------------------------------------
    resize(width, height) {
  
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
    play() {
  
      this._enableRotate = true;
  
      this._vinyls.forEach(function (vinyl) {
        vinyl.setEnableRotate(true);
      });
    };
  
    //--------------------------------------------------------------
    pause() {
  
      this._enableRotate = false;
      
      this._vinyls.forEach(function (vinyl) {
        vinyl.setEnableRotate(false);
      });
    };
  
    //--------------------------------------------------------------
    setProjectionAndVisibility(projection, sleeveVisibility, vinyl1Visibility, vinyl2Visibility) {
      const sleeveFormat = this._sleeve.getFormat();
      if (projection) {
        this.setPerspective();
      } else {
        this.setOrthographic();
      }
      this._sleeve.setVisibility(sleeveVisibility);
      this._vinyls[0].setVisibility(vinyl1Visibility);
      if (Sleeve.Format.GATEFOLD === sleeveFormat || Sleeve.Format.DOUBLE === sleeveFormat) {
        this._vinyls[1].setVisibility(vinyl2Visibility);
      }
    }
    
    updateView(type, opts, callback) {
  
      opts = opts || {
        duration: 0
      };
  
      const sleeveFormat = this._sleeve.getFormat();
      const size = this._sleeve.getSize();
      const double = (Sleeve.Format.GATEFOLD === sleeveFormat || Sleeve.Format.DOUBLE === sleeveFormat);
        
      let reset = true;
  
      switch (Number(type)) {
      case 0: { // Default
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        if (double) {
          this.cover(1.15, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
          this.cover(0.60, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
          if (size === Sleeve.Size.SIZE_7) {
            this.setCameraPositionAndTarget(55, 250, 10, 55, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_10) {
            this.setCameraPositionAndTarget(56, 250, 10, 56, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_12) {
            this.setCameraPositionAndTarget(57, 250, 10, 57, 0, 0, opts, callback);
          }
  
        } else {
          this.cover(0.8, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
          if (size === Sleeve.Size.SIZE_7) {
            this.setCameraPositionAndTarget(36, 250, 10, 36, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_10) {
            this.setCameraPositionAndTarget(37, 250, 10, 37, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_12) {
            this.setCameraPositionAndTarget(38, 250, 10, 38, 0, 0, opts, callback);
          }
          }
        break;
      }
      case 1: { // Overview #1 おもて面、sleeve & vinyl 正面
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        if (double) {
          this.cover(1.15, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
          this.cover(0.60, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
          if (size === Sleeve.Size.SIZE_7) {
            this.setCameraPositionAndTarget(55, 300, 10, 55, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_10) {
            this.setCameraPositionAndTarget(56, 300, 10, 56, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_12) {
            this.setCameraPositionAndTarget(57, 300, 10, 57, 0, 0, opts, callback);
          }
        } else {
          this.cover(0.8, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
          if (size === Sleeve.Size.SIZE_7) {
            this.setCameraPositionAndTarget(36, 300, 10, 36, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_10) {
            this.setCameraPositionAndTarget(37, 300, 10, 37, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_12) {
            this.setCameraPositionAndTarget(38, 300, 10, 38, 0, 0, opts, callback);
          }
        }
        break;
      }
      case 2: { // Overview #2 裏面、sleeve & vinyl 正面
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(true, opts);
        this.setGatefoldCoverAngle(0, opts);
        if (double) {
          this.cover(1.15, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
          this.cover(0.60, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
          if (size === Sleeve.Size.SIZE_7) {
            this.setCameraPositionAndTarget(-55, 300, 10, -55, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_10) {
            this.setCameraPositionAndTarget(-56, 300, 10, -56, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_12) {
            this.setCameraPositionAndTarget(-57, 300, 10, -57, 0, 0, opts, callback);
          }
        } else {
          this.cover(0.8, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
          if (size === Sleeve.Size.SIZE_7) {
            this.setCameraPositionAndTarget(-36, 300, 10, -36, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_10) {
            this.setCameraPositionAndTarget(-37, 300, 10, -37, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_12) {
            this.setCameraPositionAndTarget(-38, 300, 10, -38, 0, 0, opts, callback);
          }
        }
        break;
      }
      case 3: { // Overview #3 おもて面、sleeve & vinyl 斜め
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        if (double) {
          this.cover(1, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
          this.cover(0.55, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        } else {
          this.cover(0.8, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        }
        this.setCameraPositionAndTarget(200, 150, 150, 50, 0, 0, opts, callback);
        break;
      }
      case 4: { // Overview #4 vinyl1 label面 寄り おもて
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        if (double) {
          this.cover(2.6, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
          this.cover(1.3, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        } else {
          this.cover(1.3, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        }
        if (size === Sleeve.Size.SIZE_7) {
          this.setCameraPositionAndTarget(121.5, 110, 10, 121.5, 0, 0, opts, callback);
        } else if (size === Sleeve.Size.SIZE_10) {
          this.setCameraPositionAndTarget(123, 110, 10, 123, 0, 0, opts, callback);
        } else if (size === Sleeve.Size.SIZE_12) {
          this.setCameraPositionAndTarget(126, 110, 10, 126, 0, 0, opts, callback);
        }
        break;
      }
      case 5: { // Overview #5 vinyl label面 寄り 裏
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(true, opts);
        this.setGatefoldCoverAngle(0, opts);
        if (double) {
          this.cover(2.6, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
          this.cover(1.3, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        } else {
          this.cover(1.3, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        }
        if (size === Sleeve.Size.SIZE_7) {
          this.setCameraPositionAndTarget(-121.5, 110, 10, -121.5, 0, 0, opts, callback);
        } else if (size === Sleeve.Size.SIZE_10) {
          this.setCameraPositionAndTarget(-123, 110, 10, -123, 0, 0, opts, callback);
        } else if (size === Sleeve.Size.SIZE_12) {
          this.setCameraPositionAndTarget(-126, 110, 10, -126, 0, 0, opts, callback);
        }
        break;
      }
      case 6: { // Overview #6 sleeve front
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        this.setCameraPositionAndTarget(0, 230, 1, 0, 0, 0, opts, callback);
        break;
      }
      case 7: { // Overview #7 sleeve back
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(true, opts);
        this.setGatefoldCoverAngle(0, opts);
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        this.setCameraPositionAndTarget(0, 230, 1, 0, 0, 0, opts, callback);
        break;
      }
      case 8: { // Overview #8 spine面
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        this.setCameraPositionAndTarget(-150, 130, 130, -10, 0, 10, opts, callback);
        break;
      }
      case 9: { // Overview #9 gatefold open inner
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(90, opts);
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        this.setCameraPositionAndTarget(-50, 300, 10, -50, 0, 0, opts, callback);
        break;
      }
      case 10: { // Overview #10 gatefold open outer
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(90, opts);
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        this.setCameraPositionAndTarget(-40, -300, -10, -40, 0, 0, opts, callback);
        break;
      }
      case 11: { // Renderer image #1
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        if (double) {
          this.cover(1.15, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
          this.cover(0.60, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
          if (size === Sleeve.Size.SIZE_7) {
            this.setCameraPositionAndTarget(55, 230, 10, 55, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_10) {
            this.setCameraPositionAndTarget(56, 230, 10, 56, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_12) {
            this.setCameraPositionAndTarget(57, 230, 10, 57, 0, 0, opts, callback);
          }
        } else {
          this.cover(0.8, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
          if (size === Sleeve.Size.SIZE_7) {
            this.setCameraPositionAndTarget(36, 230, 10, 36, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_10) {
            this.setCameraPositionAndTarget(37, 230, 10, 37, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_12) {
            this.setCameraPositionAndTarget(38, 230, 10, 38, 0, 0, opts, callback);
          }
        }
        break;
      }
      case 12: { // Renderer image #2
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(true, opts);
        this.setGatefoldCoverAngle(0, opts);
        if (double) {
          this.cover(1.15, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
          this.cover(0.60, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
          if (size === Sleeve.Size.SIZE_7) {
            this.setCameraPositionAndTarget(-55, 230, 10, -55, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_10) {
            this.setCameraPositionAndTarget(-56, 230, 10, -56, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_12) {
            this.setCameraPositionAndTarget(-57, 230, 10, -57, 0, 0, opts, callback);
          }
        } else {
          this.cover(0.8, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
          if (size === Sleeve.Size.SIZE_7) {
            this.setCameraPositionAndTarget(-36, 230, 10, -36, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_10) {
            this.setCameraPositionAndTarget(-37, 230, 10, -37, 0, 0, opts, callback);
          } else if (size === Sleeve.Size.SIZE_12) {
            this.setCameraPositionAndTarget(-38, 230, 10, -38, 0, 0, opts, callback);
          }
        }
        break;
      }
      case 13: { // Renderer image #3
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        if (double) {
          this.cover(1, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
          this.cover(0.55, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        } else {
          this.cover(0.8, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        }
        this.setCameraPositionAndTarget(160, 120, 120, 50, -8, 0, opts, callback);

        break;
      }
      case 14: { // Renderer image #4 label a
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        if (double) {
          this.cover(2.6, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
          this.cover(1.3, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        } else {
          this.cover(1.3, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        }
        if (size === Sleeve.Size.SIZE_7) {
          this.setCameraPositionAndTarget(121.5, 90, 10, 121.5, 0, 0, opts, callback);
        } else if (size === Sleeve.Size.SIZE_10) {
          this.setCameraPositionAndTarget(123, 90, 10, 123, 0, 0, opts, callback);
        } else if (size === Sleeve.Size.SIZE_12) {
          this.setCameraPositionAndTarget(126, 90, 10, 126, 0, 0, opts, callback);
        }
        break;
      }
      case 15: { // Renderer image #5 label b
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(true, opts);
        this.setGatefoldCoverAngle(0, opts);
        if (double) {
          this.cover(2.6, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
          this.cover(1.3, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        } else {
          this.cover(1.3, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        }
        if (size === Sleeve.Size.SIZE_7) {
          this.setCameraPositionAndTarget(-121.5, 90, 10, -121.5, 0, 0, opts, callback);
        } else if (size === Sleeve.Size.SIZE_10) {
          this.setCameraPositionAndTarget(-123, 90, 10, -123, 0, 0, opts, callback);
        } else if (size === Sleeve.Size.SIZE_12) {
          this.setCameraPositionAndTarget(-126, 90, 10, -126, 0, 0, opts, callback);
        }
        break;
      }
      case 16: { // Renderer image #6 sleeve front
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        this.setCameraPositionAndTarget(0, 200, 1, 0, 0, 0, opts, callback);
        break;
      }
      case 17: { // Renderer image #7 sleeve back
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(true, opts);
        this.setGatefoldCoverAngle(80, opts);
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        this.setCameraPositionAndTarget(0, 200, 1, 0, 0, 0, opts, callback);
        break;
      }
      case 18: { // Renderer image #8 (for spine)
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        this.setCameraPositionAndTarget(-120, 104, 104, -10, 0, 10, opts, callback);
        break;
      }
      case 19: { // Renderer image #9 (for gatefold)
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(90, opts);
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        this.setCameraPositionAndTarget(-50, 300, 10, -50, 0, 0, opts, callback);
        break;
      }
      case 20: { // Renderer image #10 (for gatefold)
        this.setProjectionAndVisibility(true, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(90, opts);
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.SECOND });
        this.cover(0, { duration: opts.duration, index: qvv.VinylVisualizer.VinylIndex.FIRST });
        this.setCameraPositionAndTarget(-50, -300, -10, -50, 0, 0, opts, callback);
        break;
      }
      case 21: { // Thumbnail
        this.setProjectionAndVisibility(false, true, true, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this.setCameraPositionAndTarget(0, 160, 1, 0, 0, 0, opts, callback);
        this._camera.setZoom(450);
        break;
      }
      case 22: { // Sleeve thumbnail
        this.setProjectionAndVisibility(false, true, false, false);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this.setCameraPositionAndTarget(0, 160, 1, 0, 0, 0, opts, callback);
        this._camera.setZoom(450);
        break;
      }
      case 23: { // Vinyl thumbnail 1
        this.setProjectionAndVisibility(false, false, true, false);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this.setCameraPositionAndTarget(0, 160, 1, 0, 0, 0, opts, callback);
        this._camera.setZoom(450);
        break;
      }
      case 24: { // Vinyl thumbnail 2
        this.setProjectionAndVisibility(true, false, false, true);
        this.flip(false, opts);
        this.setGatefoldCoverAngle(0, opts);
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
        this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
        this.setCameraPositionAndTarget(0, 160, 1, 0, 0, 0, opts, callback);
        break;
      }
      }
    };
  
    //--------------------------------------------------------------
    startRender() {
      if (!this._request) {
        this._isRendering = true;
        this._request = requestAnimationFrame(this.draw.bind(this));
      }

      return this;
    };

    //--------------------------------------------------------------
    resumeRender() {
      startRender();
    };
  
    //--------------------------------------------------------------
    stopRender() {
      if (this._request) {
        this._isRendering = false;
        this._request = cancelAnimationFrame(this._request);
      }
  
      return this;
    };
  
    //--------------------------------------------------------------
    update() {
      if (this._sleeve) {
        this._sleeve.update();
      }

      this.updateVinylRenderOrder();
  
      this._vinyls.forEach(function (vinyl) {
        vinyl.update();
      });
  
      this._controls.update();
    };
  
    //--------------------------------------------------------------
    draw(time) {
  
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
    registerPreset(type, fn) {
      if (this._presets[type]) {
        console.warn('Preset %s is already registered. Overwritten.', type);
      }

      this._presets[type] = fn;
      return this;
    };
  
    //--------------------------------------------------------------
    async setSleeveFormat(format) {
  
      let lastFormat = this._sleeve.getFormat();
  
      if (lastFormat === format) {
        return lastFormat;
      }
  
      let coveredRatio = 0.0;
      
      coveredRatio = this._vinyls[0].getCoveredRatio();
  
      // await this._sleeve.setOpacity(0.0, 250);
      await this._sleeve.setFormat(format);

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
        } else if (Sleeve.Size.SIZE_10 === this._sleeve.getSize()) {
          secondOffsetY += 0.2;
        } else if (Sleeve.Size.SIZE_12 === this._sleeve.getSize()) {
          secondOffsetY += 0.2;
        }

        this._vinyls[1].setVisibility(true);
      } else if (Sleeve.Format.DOUBLE === newFormat) {
        firstOffsetY = 0.6;
        secondOffsetY = -0.6;
        this._vinyls[1].setVisibility(true);
      } else {
        firstOffsetY = 0.0;
        secondOffsetY = 0.0;
        this._vinyls[1].setVisibility(false);
      }

      this._vinyls[0].setCoveredRatio(this._vinyls[0].getCoveredRatio(), 0, firstOffsetY);
      this._vinyls[1].setCoveredRatio(this._vinyls[1].getCoveredRatio(), 0, secondOffsetY);

      await this._sleeve.setOpacity(1.0, 0);

      this.updateVinylRenderOrder();

      return this._sleeve.getFormat();
    };
  
    //--------------------------------------------------------------
    async setSleeveHole(yn) {
  
      if (Sleeve.Format.GATEFOLD === this._sleeve.getFormat()) {
        return this;
      }
  
      await this._sleeve.setHole(yn);

      let sleeveFormat = this._sleeve.getFormat();
      let firstOffsetY, secondOffsetY;

      let coveredRatio = 0.0;

      if (Sleeve.Format.DOUBLE === sleeveFormat) {
        firstOffsetY = 0.6;
        secondOffsetY = -0.6;
      } else {
        firstOffsetY = 0.0;
        secondOffsetY = 0.0;
      }

      this._vinyls[0].setCoveredRatio(this._vinyls[0].getCoveredRatio(), 0, firstOffsetY);
      this._vinyls[1].setCoveredRatio(this._vinyls[1].getCoveredRatio(), 0, secondOffsetY);

      await this._sleeve.setOpacity(1.0, 0);

      return this;
    };

    async fadeOut(duration) {
      duration = duration || 1000;
      return new Promise((resolve) => {
        let values = {opacity: 1};
        new TWEEN.Tween(values)
          .stop()
          .delay(0)
          .to({ opacity: 0 }, duration)
          .onUpdate((value) => {
            this.getRenderer().domElement.style.opacity = values.opacity;
          })
          .onComplete(resolve).start()
      });
    }

    async fadeIn(duration) {
      duration = duration || 1000;
      return new Promise((resolve) => {
        let values = {opacity: 0};
        new TWEEN.Tween(values)
          .stop()
          .delay(0)
          .to({ opacity: 1 }, duration)
          .onUpdate((value) => {
            this.getRenderer().domElement.style.opacity = values.opacity;
          })
          .onComplete(resolve).start()
      });
    }
  }

  /**
   * Mixin `Emitter`.
   */

  Emitter(World.prototype);

  exports.World = World;

})(this, (this.qvv = (this.qvv || {})));