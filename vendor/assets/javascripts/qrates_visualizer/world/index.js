
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
    
      this._enableRotate = false;
      this._flip = false;
  
      // sleeve と vinyl がぶら下がるコンテナ
      this._containerObject = new THREE.Object3D();
      this._containerObject.name = 'container';
  
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
      
      this._sleeve.setObjectScale(this._objectScales['12']);
      
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
      let offsetY = 0.0;

      if (Sleeve.Format.DOUBLE === sleeveFormat || Sleeve.Format.GATEFOLD === sleeveFormat) {
        if (Sleeve.Format.GATEFOLD === sleeveFormat) {
          offsetY = 1.08390626812156;
        } else {
          offsetY = 0.6;
        }
      }

      let targets = [];

      if (1 == this._opts.defaults.vinyl.length) {
        this._opts.defaults.vinyl.push(this._opts.defaults.vinyl[0]);
      }

      // vinyl オプションから vinyl を生成
      for (let i in this._opts.defaults.vinyl) {
        this._opts.defaults.vinyl[i].index = Object.values(Vinyl.Index)[i];
        this._opts.defaults.vinyl[i].offsetY = 0 == i ? offsetY : -offsetY;

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

      this.createLights();
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
    createLights() {
    
      let spotLight_top = new THREE.SpotLight(0xffffff, 0.5, 0, 0.314, 0.26, 1);
      spotLight_top.position.set(-159, 2000, -120);
      this._scene.add(spotLight_top);
  
      let spotLight_bottom = new THREE.SpotLight(0xffffff, 0.5, 0, 0.314, 0.26, 1);
      spotLight_bottom.position.set(159, -2000, 120);
      this._scene.add(spotLight_bottom);
  
      let ambientLight = new THREE.AmbientLight(0x0D0D0D, 10);
      this._scene.add(ambientLight);
      
      if (!this.gui) {
        this.gui = new window.dat.GUI();
      }

      let lightParamsFolder = this.gui.addFolder('lights');

      let topSpotLightParamsFolder = lightParamsFolder.addFolder('spot light - top');
      topSpotLightParamsFolder.add(spotLight_top, 'intensity', 0, 1);
      topSpotLightParamsFolder.add(spotLight_top.position, 'x', -2000, 2000);
      topSpotLightParamsFolder.add(spotLight_top.position, 'y', -2000, 2000);
      topSpotLightParamsFolder.add(spotLight_top.position, 'z', -2000, 2000);

      let bottomSpotLightParamsFolder = lightParamsFolder.addFolder('spot light - bottom');
      bottomSpotLightParamsFolder.add(spotLight_bottom, 'intensity', 0, 1);
      bottomSpotLightParamsFolder.add(spotLight_bottom.position, 'x', -2000, 2000);
      bottomSpotLightParamsFolder.add(spotLight_bottom.position, 'y', -2000, 2000);
      bottomSpotLightParamsFolder.add(spotLight_bottom.position, 'z', -2000, 2000);

      let ambientLightParamsFolder = lightParamsFolder.addFolder('ambient light');
      ambientLightParamsFolder.add(ambientLight, 'intensity', 0, 10);
    };
  
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
        // this._sleeve.setCoveredRatio(0.8, { duration: 1 });
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
  
      this.gui = new window.dat.GUI();

      let generalParamsFolder = this.gui.addFolder('general');
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
        self._sleeve.setVisibility(value);
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
        if (!self._sleeve) {
          return;
        }
  
        self._sleeve.setBumpScale(value);
      });
  
      vinylBumpScaleController.onChange(function (value) {
        if (0 === self._vinyls.length) {
          return;
        }
  
        self._vinyl.setBumpScale(value);
      });
    };
  
    //--------------------------------------------------------------
    setCameraPosition(tx, ty, tz, opts, callback) {

      if (!callback) {
        callback = null;
      }
  
      opts = opts || {
        durarion: 1000
      };
  
      opts.duration = undefined === opts.duration ? 1000 : opts.duration;
  
      new TWEEN.Tween(this._camera.position)
        .stop()
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
    setCameraRotation(tx, ty, tz, opts, callback) {

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
        this._vinyls[0].setOpacity(0, 300, 0),
        this._vinyls[1].setOpacity(0, 300, 0),
        this._sleeve.setOpacity(0, 300, 0),
      ]);

      await Promise.all([
        this._vinyls[0].loadModelForSize(size),
        this._vinyls[1].loadModelForSize(size),
        this._sleeve.loadModelForSize(sleeveSize)
      ]);

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
        }

        this.setGatefoldCoverAngle(this._sleeve.getCurrentGatefoldAngle() * (180 / Math.PI));
      } else if (Sleeve.Format.DOUBLE === format) {
        firstOffsetY = 0.6;
        secondOffsetY = -0.6;
      }

      this._vinyls[0].setCoveredRatio(this._vinyls[0].getCoveredRatio(), 0, firstOffsetY);
      this._vinyls[1].setCoveredRatio(this._vinyls[0].getCoveredRatio() * 2, 0, secondOffsetY);

      this._vinyls[0].setOpacity(this._vinyls[0]._material.opacity, 250, 100);
      this._vinyls[1].setOpacity(this._vinyls[1]._material.opacity, 250, 100);
      this._sleeve.setOpacity(1.0, 250, 100);

      return this;
    };
  
    //--------------------------------------------------------------
    flip(value) {
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
    cover(value, opts) {
  
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
          offsetY = this._containerObject.getObjectByName('Back').getWorldPosition().y;

          if (Sleeve.Size.SIZE_7 === this._sleeve.getSize()) {
            offsetY += 0.15;
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
        .to({ ratio: value }, opts.durarion || 500)
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
    updateView(type, opts, callback) {
  
      opts = opts || {
        duration: 2000
      };
  
      opts.duration = undefined !== opts.duration ? opts.duration : 2000;

      let reset = true;
  
      switch (Number(type)) {
        case 0:  // for capture rendered image
          const rate = 0.9;
          this.setCameraPosition(212 * rate, 288 * rate, 251 * rate, opts, callback);
          this._flip = true;
          this.flip();
          this.cover(0.25, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.5, { duration: opts.duration, index: Vinyl.Index.SECOND });
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 1:
          this.setCameraPosition(62, 94, 105, opts, callback); // item detail rotation 1
          this._flip = true;
          this.flip();
          this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 2:
          this.setCameraPosition(0.01, 365, 10, opts, callback); // item detail rotation 2
          this._flip = true;
          this.flip();
          this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 3:
          this.setCameraPosition(0.01, 365, 50, opts, callback); // item detail rotation 3
          this._flip = false;
          this.flip();
          this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 4:
          this.setCameraPosition(0.01, 345, 400, opts, callback); // item detail rotation 4
          this._flip = false;
          this.flip();
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 5:
          this.setCameraPosition(0.01, 345, 400, opts, callback); // item detail rotation 5
          this._flip = true;
          this.flip();
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 6:
          this.setCameraPosition(212, 288, 251, opts, callback); // item detail rotation 6
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 7:
          this.setCameraPosition(212, 288, 251, opts, callback); // item detail rotation 7
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 8:
          this.setCameraPosition(212, 288, 251, opts, callback); // item detail rotation 8
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 9:
          this.setCameraPosition(148, 201, 175, opts, callback); // item detail rotation 9
          this._flip = true;
          this.flip();
          this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 10:
          this.setCameraPosition(0, 436, 1, opts, callback); // vinyl Side A
          this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 11:
          this.setCameraPosition(0, 170, 1, opts, callback); // label Side A
          this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 12:
          this.setCameraPosition(0, -170, -1, opts, callback); // label Side B
          this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 13:
          this.setCameraPosition(0, 400, 1, opts, callback); // sleeve Front
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 14:
          this.setCameraPosition(0, -400, -1, opts, callback); // sleeve Back
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
          
          if (reset) {
            this._controls.reset();
          }

          break;
        case 21:
          this.setPerspective();
          this._sleeve.setVisibility(true);
          this.setCameraPosition(190 * 0.8, 259 * 0.8, 226 * 0.8, { duration: opts.duration });
          this.cover(0.25, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.5, { duration: opts.duration, index: Vinyl.Index.SECOND });
          this._controls.target = new THREE.Vector3(-30, 0, 24);
          this._controls.update();
          break;
        case 22:
          this.setPerspective();
          this._sleeve.setVisibility(true);
          this.setCameraPosition(-250, 260, 260, { duration: opts.duration });
          this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
          this._controls.target = new THREE.Vector3(-30, -210, -140);
          this._controls.update();
          break;
        case 23:
          this.setOrthographic();
          this._sleeve.setVisibility(true);
          this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
          this._camera.position.set(-75, 500, 10);
          this._controls.target = new THREE.Vector3(-75, 0, 0);
          this._controls.update();
          break;
        case 24:
          this.setOrthographic();
          this._sleeve.setVisibility(true);
          this.cover(0.4, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.8, { duration: opts.duration, index: Vinyl.Index.SECOND });
          this._camera.position.set(-75, -500, -10);
          this._controls.target = new THREE.Vector3(-75, 0, 0);
          this._controls.update();
          break;
        case 25:
          this.setOrthographic();
          this._sleeve.setVisibility(true);
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
          this._camera.position.set(0, 500, 10);
          this._controls.target = new THREE.Vector3(0, 0, 0);
          this._controls.update();
          break;
        case 26:
          this.setOrthographic();
          this._sleeve.setVisibility(true);
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
          this._camera.position.set(0, -500, -10);
          this._controls.target = new THREE.Vector3(0, 0, 0);
          this._controls.update();
          break;
        case 27:
          this.setOrthographic();
          this._sleeve.setVisibility(false);
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
          this._camera.position.set(0, 400, 10);
          this._controls.target = new THREE.Vector3(0, 0, 0);
          this._camera.setZoom(320);
          this._controls.update();
          break;
        case 28:
          this.setOrthographic();
          this._sleeve.setVisibility(false);
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.FIRST });
          this.cover(0.0, { duration: opts.duration, index: Vinyl.Index.SECOND });
          this._camera.position.set(0, -328, -10);
          this._controls.target = new THREE.Vector3(0, 0, 0);
          this._camera.setZoom(320);
          this._controls.update();
          break;
        case 29:
          this.setOrthographic();
          this._sleeve.setVisibility(false);
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
  
      if (0 < this._vinyls.length) {
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
        
        this._vinyls.forEach(function (vinyl) {
          vinyl.update();
        });
      }
  
      this._controls.update();

      // console.log('direction', this._camera.getWorldDirection());
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
  
      await this._sleeve.setOpacity(0.0, 250);
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
        }
      } else if (Sleeve.Format.DOUBLE === newFormat) {
        firstOffsetY = 0.6;
        secondOffsetY = -0.6;
      } else {
        firstOffsetY = 0.0;
        secondOffsetY = 0.0;
      }

      this._vinyls[0].setCoveredRatio(this._vinyls[0].getCoveredRatio(), 0, firstOffsetY);
      this._vinyls[1].setCoveredRatio(this._vinyls[1].getCoveredRatio(), 0, secondOffsetY);

      await this._sleeve.setOpacity(1.0, 250);

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

      await this._sleeve.setOpacity(1.0, 100);

      return this;
    };
  }

  /**
   * Mixin `Emitter`.
   */

  Emitter(World.prototype);

  exports.World = World;

})(this, (this.qvv = (this.qvv || {})));