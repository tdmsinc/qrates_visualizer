
//= require tdmsinc-three.js
//= require ../emitter
//= require_tree .
//= require_self

(function(global, exports) {
  var container;
  var labelObj, vinylObj, sleeveObj;
  var sleeve;
  var labelTexture, vinylTexture, sleeveTexture, shadowTexture;
  var currentColor = 0x000000;
  var currentOpacity = 1.0;
  var gui, axes;

  var camera, scene, renderer, controls;

  var mouseX = 0, mouseY = 0;

  var props = {
    color: 0xFFFFFF,
    size: 12,
    label: null,
    render: true,
    rotate: false,
    out: false,
    camera_pos: 1,
    fov: 35,
    bumpScale: 0.282,
    rotateX: Math.PI / 2 - 0.3,
    rotateY: 0.0,
    rotateZ: 0.0,
    sleeveX: -15,
  };

  var cameraProps = {
    x:0.0, y: 17.0, z: 30.0,
  };

  var colors = [
    { color: 0x000000, opacity: 1.0 },
    { color: 0xFFFFFF, opacity: 1.0 },
    { color: 0xF6EB97, opacity: 1.0 },
    { color: 0xD12145, opacity: 1.0 },
    { color: 0xD8682A, opacity: 1.0 },
    { color: 0x009FD8, opacity: 1.0 },
    { color: 0x5D3031, opacity: 1.0 },
    { color: 0x66B07F, opacity: 1.0 },
    { color: 0x858588, opacity: 1.0 },
    { color: 0x156C3F, opacity: 0.85 },
    { color: 0xEDDC24, opacity: 0.85 },
    { color: 0x882125, opacity: 0.85 },
    { color: 0x28151F, opacity: 0.85 },
    { color: 0x1B3961, opacity: 0.85 },
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
      rpm: 45
    };

    console.log(assets);

    // init
    this._scene = new THREE.Scene();

    this._camera = new THREE.PerspectiveCamera(this._opts.camera.fov, this._opts.camera.aspect, this._opts.camera.near, this._opts.camera.far);
    this._camera.lookAt(new THREE.Vector3(0, 0, 0));
    this._camera.targetPosition = new THREE.Vector3(0, 409, 106);

    this._renderer = new THREE.WebGLRenderer(this._opts.renderer);
    this._renderer.setSize(this._opts.width, this._opts.height);
    this._renderer.setClearColor(0xFFFFFF, 1.0);

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
    this._sleeve.position.x = 0;
    this._sleeve.targetPosition = new THREE.Vector3(0);

    this._vinyl = new Vinyl();
    this._vinyl.setup(this._scene, assets, { size: size, color: 0xFFFFFF });
    this._vinyl.targetPosition = new THREE.Vector3(0);

    this._label = new Label();
    this._label.setup(this._scene, assets, { size: size });
    this._label.targetPosition = new THREE.Vector3(0);

    this._rpm = opts.defaults.vinyl.speed;
    this._clock = new THREE.Clock();
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
    spotLight1.position.set(100, 200, 150);
    lights.add(spotLight1);

    var spotLight2 = new THREE.SpotLight(0xFFFFFF, 0.4, 0, 0.314, 10);
    spotLight2.position.set(-76.36000061035156, 200, 150);
    lights.add(spotLight2);

    var pointLight1 = new THREE.PointLight(0xFFFFFF, 0.4, 0);
    pointLight1.position.set(21.09000015258789, 213.86000061035156, -84.06999969482422);
    lights.add(pointLight1);

    var pointLight2 = new THREE.PointLight(0xFFFFFF, 0.4, 0);
    pointLight2.position.set(-2.059999942779541, -80.05000305175781, 10.65999984741211);
    lights.add(pointLight2);

    var hemisphereLight1 = new THREE.HemisphereLight(0x080E21, 0x2E1B11, 1.0);
    hemisphereLight1.position.set(-128.50999450683594, 243.4199981689453, 52.41999816894531);
    lights.add(hemisphereLight1);

    var hemisphereLight2 = new THREE.HemisphereLight(0x120C17, 0x220A0E, 1.0);
    hemisphereLight2.position.set(100, 244.38999938964844, 193.2899932861328);
    lights.add(hemisphereLight2);

    var ambientLight = new THREE.AmbientLight(0x0D0D0D);
    ambientLight.position.set(0, 20.049999237060547, 178.11000061035156);
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

    var gui = this.gui = new window.dat.GUI();
    var renderController = gui.add(props, 'render');
    var rotationController = gui.add(props, 'rotate');
    var outFromSleeveController = gui.add(props, 'out');
    var colorController = gui.add(props, 'color', ['Black', 'Blanc', 'Jaune', 'Rouge', 'Orange', 'Bleu', 'Brun', 'Vert', 'Gris', 'Vert(transparent)', 'Jaune(transparent)', 'Rouge(transparent)', 'Violet(transparent)', 'Bleu(transparent)', 'Transparent']);
    var sizeController = gui.add(props, 'size', [7, 10, 12]);
    var labelController = gui.add(props, 'label', [1, 2, 3, 4, 5, 6, 7, 8]);
    var cameraPositionController = gui.add(props, 'camera_pos', [1, 2, 3, 4]);
    var cameraXController = gui.add(cameraProps, 'x', -1000, 1000);
    var cameraYController = gui.add(cameraProps, 'y', -1000, 1000);
    var cameraZController = gui.add(cameraProps, 'z', -1000, 1000);
    var rotateXController = gui.add(props, 'rotateX', -Math.PI / 2, Math.PI / 2);
    var rotateYController = gui.add(props, 'rotateY', -Math.PI / 2, Math.PI / 2);
    var rotateZController = gui.add(props, 'rotateZ', -Math.PI / 2, Math.PI / 2);
    var sleeveXController = gui.add(props, 'sleeveX', -32, 0);
    var bumpScaleController = gui.add(props, 'bumpScale', 0, 1.0);
    var fovController = gui.add(props, 'fov', 20, 50);

    var self = this;
    var axes = this.axes;
    var camera = this._camera;

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
      var offset = '7' === self._sleeve._size ? 80 : 120;

      self._sleeve.targetPosition.x = value ? -offset : 0;
      self._vinyl.targetPosition.x = value ? offset : 0;
      self._label.targetPosition.x = value ? offset : 0;
    });

    colorController.onChange(function(value) {
      if (!vinylObj) {
        return;
      }

      vinylObj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          switch (value) {
            case 'Black':
              currentColor = 0x000000;
              currentOpacity = 1.0;
              break;
            case 'Blanc':
              currentColor = 0xFFFFFF;
              currentOpacity = 1.0;
              break;
            case 'Jaune':
              currentColor = 0xF6EB97;
              currentOpacity = 1.0;
              break;
            case 'Rouge':
              currentColor = 0xD12145;
              currentOpacity = 1.0;
              break;
            case 'Orange':
              currentColor = 0xD8682A;
              currentOpacity = 1.0;
              break;
            case 'Bleu':
              currentColor = 0x009FD8;
              currentOpacity = 1.0;
              break;
            case 'Brun':
              currentColor = 0x5D3031;
              currentOpacity = 1.0;
              break;
            case 'Vert':
              currentColor = 0x66B07F;
              currentOpacity = 1.0;
              break;
            case 'Gris':
              currentColor = 0x858588;
              currentOpacity = 1.0;
              break;
            case 'Vert(transparent)':
              currentColor = 0x156C3F;
              currentOpacity = 0.85;
              break;
            case 'Jaune(transparent)':
              currentColor = 0xEDDC24;
              currentOpacity = 0.85;
              break;
            case 'Rouge(transparent)':
              currentColor = 0x882125;
              currentOpacity = 0.85;
              break;
            case 'Violet(transparent)':
              currentColor = 0x28151F;
              currentOpacity = 0.85;
              break;
            case 'Bleu(transparent)':
              currentColor = 0x1B3961;
              currentOpacity = 0.85;
              break;
            case 'Transparent':
              currentColor = 0xFFFFFF;
              currentOpacity = 0.85;
              break;
            default:
              break;
          }

          child.material.color.setHex(currentColor);
          child.material.opacity = currentOpacity;
        }
      });
    });

    sizeController.onChange(function(value) {
      changeVinylSize(value);
    });

    labelController.onChange(function(value) {
      THREE.ImageUtils.loadTexture('textures/label_' + value + '.jpg', THREE.UVMapping, function(tex) {
        labelObj.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.material.map = tex;
          }
        });
      });
    });

    cameraPositionController.onChange(function(value) {
      switch (Number(value)) {
        case 1:
          self._camera.targetPosition.set(0, 409, 106);
          break;
        case 2:
          self._camera.targetPosition.set(0, 149, 1);
          break;
        case 3:
          self._camera.targetPosition.set(127, 192, 214);
          break;
        case 4:
          self._camera.targetPosition.set(127, 0, 0);
          break;
        default:
          break;
      }
    });

    cameraXController.onChange(function(value) {
      self._camera.targetPosition.x = value;
    });

    cameraYController.onChange(function(value) {
      self._camera.targetPosition.y = value;
    });

    cameraZController.onChange(function(value) {
      self._camera.targetPosition.z = value;
    });

    rotateXController.onChange(function(value) {
      // labelObj.rotation.x = vinylObj.rotation.x = value;
    });

    rotateYController.onChange(function(value) {
      // labelObj.rotation.y = vinylObj.rotation.y = value;
    });

    rotateZController.onChange(function(value) {
      // labelObj.rotation.z = vinylObj.rotation.z = value;
    });

    sleeveXController.onChange(function(value) {
      // sleeve.position.x = value;
    });

    bumpScaleController.onChange(function(value) {
      if (!self._vinyl) {
        return;
      }

      self._vinyl.setBumpScale(value);
    });

    fovController.onChange(function(value) {
      self._camera.setLens(value);
    });
  };

  World.prototype.setVinylSize = function(size) {
    console.log('World::setVinylSize');
    // TODO: process
  };

  World.prototype.capture = function(opts, callback) {
    console.log('World::capture');
    // TODO: process
    if (callback) callback();
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
  World.prototype.updateView = function(type, otps, callback) {
    console.log('World::updateView', type);

    switch (Number(type)) {
      case 1:
        this._camera.targetPosition.set(0, 409, 106);
        break;
      case 2:
        this._camera.targetPosition.set(0, 149, 1);
        break;
      case 3:
        this._camera.targetPosition.set(127, 192, 214);
        break;
      case 4:
        this._camera.targetPosition.set(127, 0, 0);
        break;
      default:
        break;
    }

    if (callback) callback();
  };

  /**
   *
   */
  World.prototype.startRender =
  World.prototype.resumeRender = function() {
    console.log('World::startRender');
    this.request = requestAnimationFrame(this.draw.bind(this));
    return this;
  };

  /**
   *
   */
  World.prototype.stopRender = function() {
    this.request = cancelAnimationFrame(this.request);
    return this;
  };

  /**
   *
   */
  World.prototype.update = function() {
    // console.log(this._clock.getElapsedTime() - this._clock.oldTime);
    var amount = this._clock.getDelta() * (Math.PI * (this._rpm / 60));
    // console.log(this._clock.getDelta() * 198);

    if (this.enableRotate) {
      this.rotationAmount = Math.min(this.rotationAmount + 0.001, 0.07);
    } else {
      this.rotationAmount = Math.max(this.rotationAmount - 0.001, 0);
    }

    if (this._sleeve) {
      this._sleeve.position.x += (this._sleeve.targetPosition.x - this._sleeve.position.x) / 8;
      this._sleeve.update();
    }

    if (this._vinyl) {
      if (this.enableRotate) {
        this._vinyl.rotation.y -= amount;
      }
      this._vinyl.position.x += (this._vinyl.targetPosition.x - this._vinyl.position.x) / 8;
      this._vinyl.update();
    }

    if (this._label) {
      if (this.enableRotate) {
        this._label.rotation.y -= amount;
      }
      this._label.position.x += (this._label.targetPosition.x - this._label.position.x) / 8;
      this._label.update();
    }

    this._camera.position.x += (this._camera.targetPosition.x - this._camera.position.x) / 8;
    this._camera.position.y += (this._camera.targetPosition.y - this._camera.position.y) / 8;
    this._camera.position.z += (this._camera.targetPosition.z - this._camera.position.z) / 8;
    this._camera.lookAt(new THREE.Vector3(0, 0, 0));
  };

  /**
   *
   */
  World.prototype.draw = function() {
    this.update();
    this._renderer.render(this._scene, this._camera);
    this.request = requestAnimationFrame(this.draw.bind(this));
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
    parent.vinyl.on('sideATexture', this.onVinylSideBTextureChanged.bind(this));

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

    var offset = 7 === size ? 80 : 120;

    this._sleeve.targetPosition.x = value ? -offset : 0;
    this._vinyl.targetPosition.x = value ? offset : 0;
    this._label.targetPosition.x = value ? offset : 0;

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
    console.log('World::onVinylSideATextureChanged', value);
  };

  World.prototype.onVinylSideBTextureChanged = function(value) {
    console.log('World::onVinylSideBTextureChanged', value);
  };

  World.prototype.onLabelTypeChanged = function(value) {
    console.log('World::onLabelTypeChanged', value);

    var types = [this._label.TYPE_WHITE, this._label.TYPE_PRINT_MONOCHROME, this._label.TYPE_PRINT_COLOR];
    this._label.setType(types[value - 1]);
  };

  World.prototype.onLabelSideATextureChanged = function(value) {
    console.log('World::onLabelSideATextureChanged', value);

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
    console.log('World::onSleeveFrontTextureChanged', value);

    this._sleeve.setTexture(value, null);
  };

  World.prototype.onSleeveBackTextureChanged = function(value) {
    console.log('World::onSleeveBackTextureChanged', value);

    this._sleeve.setTexture(null, value);
  };

  World.prototype.onSleeveSpineTextureChanged = function(value) {
    console.log(value);
  };

})(this, (this.qvv = (this.qvv || {})));
