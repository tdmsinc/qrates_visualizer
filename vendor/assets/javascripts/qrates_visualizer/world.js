
//= require tdmsinc-three.js
//= require ./emitter
//= require_tree ./world
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

  //--------------------------------------------------------------
  function Sleeve() {
  }

  Sleeve.prototype.setup = function(scene, assets, opts) {
    this._opts = opts || {
      size: 7
    };

    this.TYPE_BLACK       = 'black';
    this.TYPE_WHITE       = 'white';
    this.TYPE_PRINT       = 'print';
    this.TYPE_PRINT_SPINE = 'spine';

    this._scene = scene;
    // this._size = this._opts.size.toString();
    this._size = '7';
    this._holed = false;
    this._type = this.TYPE_BLACK;
    
    this._front = {
      current   : null,
      '7'       : assets['assetsModelSleeveFront-7'],
      '10'      : assets['assetsModelSleeveFront-10'],
      '12'      : assets['assetsModelSleeveFront-12'],
      'holed-7' : assets['assetsModelSleeveFrontHoled-7'],
      'holed-10': assets['assetsModelSleeveFrontHoled-10'],
      'holed-12': assets['assetsModelSleeveFrontHoled-12']
    };

    this._back = {
      current   : null,
      '7'       : assets['assetsModelSleeveBack-7'],
      '10'      : assets['assetsModelSleeveBack-10'],
      '12'      : assets['assetsModelSleeveBack-12'],
      'holed-7' : assets['assetsModelSleeveBackHoled-7'],
      'holed-10': assets['assetsModelSleeveBackHoled-10'],
      'holed-12': assets['assetsModelSleeveBackHoled-12']
    };

    this._spine = {
      '7' : assets['assetsModelSleeveSpine-7'],
      '10': assets['assetsModelSleeveSpine-10'],
      '12': assets['assetsModelSleeveSpine-12']
    };

    this._textures = {
      front: new THREE.Texture(),
      back : new THREE.Texture(),
      spine: new THREE.Texture()
    };

    this.updateTexture(this._textures.front, assets['assetsTextureSleeveDefault']);
    this.updateTexture(this._textures.back, assets['assetsTextureSleeveDefault']);
    this.updateTexture(this._textures.spine, assets['assetsTextureSleeveDefault']);

    var self = this;

    Object.keys(this._front).forEach(function(key){
      self.initMaterial(self._front[key], self._textures.front);
    });

    Object.keys(this._back).forEach(function(key) {
      self.initMaterial(self._back[key], self._textures.back);
    });

    Object.keys(this._spine).forEach(function(key) {
      self.initMaterial(self._spine[key], self._textures.spine);
    });

    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this._front.current = this._front[this._size];
    this._back.current = this._back[this._size];

    this._scene.add(this._front.current);
    this._scene.add(this._back.current);
    this._scene.add(this._spine[this._size]);
  };

  Sleeve.prototype.initMaterial = function(obj, tex) {
    if (!obj) {
      return;
    }

    var self = this;

    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          map: tex,
          ambient: 0xFFFFFF,
          color: self.TYPE_BLACK === self._type ? 0x000000 : 0xFFFFFF,
          shininess: 35,
          specular: 0x363636,
          shading: THREE.SmoothShading,
          vertexColor: THREE.VertexColors
        });
      }
    });

    return obj;
  };

  Sleeve.prototype.updateTexture = function(tex, img) {
    if (!tex || !img) {
      return;
    }

    tex.image = img;
    tex.needsUpdate = true;
  };

  Sleeve.prototype.setTexture = function(sideA, sideB, spine) {
    if (sideA) {
      this.updateTexture(this._textures.front, sideA);
    }

    if (sideB) {
      this.updateTexture(this._textures.back, sideB);
    }

    if (spine) {
      this.updateTexture(this._textures.spine, spine);
    }
  };

  Sleeve.prototype.setType = function(type) {

    if (-1 === [this.TYPE_BLACK, this.TYPE_WHITE, this.TYPE_PRINT, this.TYPE_PRINT_SPINE].indexOf(type)) {
      return;
    }

    this._type = type;

    var self = this;

    Object.keys(this._front).forEach(function(key) {
      var tex = self.TYPE_BLACK === self._type || self.TYPE_WHITE === type ? null : self._textures.front;
      self.initMaterial(self._front[key], tex);
    });

    Object.keys(this._back).forEach(function(key) {
      var tex = self.TYPE_BLACK === self._type || self.TYPE_WHITE === type ? null : self._textures.back;
      self.initMaterial(self._back[key], tex);
    });

    Object.keys(this._spine).forEach(function(key) {
      var tex = self.TYPE_BLACK === self._type || self.TYPE_WHITE === type ? null : self._textures.spine;
      self.initMaterial(self._spine[key], tex);
    });
  };

  Sleeve.prototype.setSize = function(size) {
    if (!size) {
      return;
    }

    this._scene.remove(this._front.current);
    this._scene.remove(this._back.current);
    this._scene.remove(this._spine[this._size]);

    this._size = size.toString();

    if (this._holed) {
      this._front.current = this._front['holed-' + this._size];
      this._back.current = this._back['holed-' + this._size];
    } else {
      this._front.current = this._front[this._size];
      this._back.current = this._back[this._size];
    }

    this._scene.add(this._front.current);
    this._scene.add(this._back.current);
    this._scene.add(this._spine[this._size]);
  };

  Sleeve.prototype.setHole = function(value) {
    this._holed = value;
    this.setSize(this._size);
  };

  Sleeve.prototype.setVisible = function(value) {
    this._front.current.visible = this._back.current.visible = this._spine[this._size].visible = value;
  };

  Sleeve.prototype.update = function() {
    this._front.current.position.set(this.position.x, this.position.y, this.position.z);
    this._front.current.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

    this._back.current.position.set(this.position.x, this.position.y, this.position.z);
    this._back.current.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

    this._spine[this._size].position.set(this.position.x, this.position.y, this.position.z);
    this._spine[this._size].rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
  };


  //--------------------------------------------------------------
  function Vinyl() {
  }

  Vinyl.prototype.setup = function(scene, assets, opts) {
    this._opts = opts || {
      bumpScale: 0.36,
      color: 0x000000,
      size: 7
    };

    // color modes a.k.a. vinyl types
    this.COLOR_MODE_BLACK    = 'black';
    this.COLOR_MODE_COLOR    = 'color';
    this.COLOR_MODE_SPLATTER = 'splatter';

    this._scene = scene;
    this._size = this._opts.size.toString();
    this._colorMode = this.COLOR_MODE_BLACK;
    this._color = 0x000000;
    this._opacity = 1.0;

    this._body = {
      '7' : assets['assetsModelVinyl-7'],
      '10': assets['assetsModelVinyl-10'],
      '12': assets['assetsModelVinyl-12'],
    };

    this._textures = {
      splatter: new THREE.Texture(),
      bumpMap: {
        '7' : new THREE.Texture(),
        '10': new THREE.Texture(),
        '12': new THREE.Texture()
      }
    };

    var self = this;

    Object.keys(self._textures.bumpMap).forEach(function(key) {
      self.updateTexture(self._textures.bumpMap[key], assets['assetsTextureVinylBumpmap-' + key]);
    });

    Object.keys(self._body).forEach(function(key) {
      self.initMaterial(self._body[key], self._textures.bumpMap[key]);
    });

    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this._scene.add(this._body[this._size]);
  };

  Vinyl.prototype.initMaterial = function(obj, tex) {
    var self = this;

    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          ambient: 0xFFFFFF,
          bumpMap: tex,
          bumpScale: 0.36,
          color: self._color,
          emissive: 0,
          map: tex,
          opacity: self.opacity,
          shininess: 35,
          specular: 0x363636,
          shading: THREE.SmoothShading,
          vertexColor: THREE.VertexColors
        });
      }
    });

    return obj;
  };

  Vinyl.prototype.updateTexture = function(tex, img) {
    if (!tex || !img) {
      return;
    }

    tex.image = img;
    tex.needsUpdate = true;
  };

  Vinyl.prototype.setBumpScale = function(value) {
    var self = this;

    Object.keys(self._body).forEach(function(key) {
      self._body[key].traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.bumpScale = value;
        }
      });
    });
  };

  Vinyl.prototype.setSize = function(size) {
    if (!size) {
      return;
    }

    this._scene.remove(this._body[this._size]);

    this._size = size.toString();
    this._scene.add(this._body[this._size]);
  };

  Vinyl.prototype.setColorMode = function(mode) {
    if (!mode) {
      return;
    }

    if (this.COLOR_MODE_BLACK === mode) {
      this._colorMode = this.COLOR_MODE_BLACK;
      this.setColor(0x000000, 1.0);
    } else if (this.COLOR_MODE_COLOR === mode) {
      this._colorMode = this.COLOR_MODE_COLOR;
      this.setColor(self.color, 1.0);
    } else if (this.COLOR_MODE_SPLATTER === mode) {
      this._colorMode = this.COLOR_MODE_SPLATTER;
      this.setColor(self._color, 0.8);
    }
  };

  Vinyl.prototype.setColor = function(hexColor) {
    if (this._colorMode === this.COLOR_MODE_BLACK) {
      this._color = 0x000000;
      this.opacity = 1.0;
    } else if (this._colorMode === this.COLOR_MODE_COLOR) {
      this._color = hexColor;
      this._opacity = 1.0;
    } else if (this._colorMode === this.COLOR_MODE_SPLATTER) {
      this._color = hexColor;
      this._opacity = 0.8;
    }

    var self = this;
    Object.keys(self._body).forEach(function(key) {
      self._body[key].traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.color.setHex(self._color);
          child.material.opacity = self._opacity;
        }
      });
    });
  };

  Vinyl.prototype.setVisible = function(value) {
    this._body[this._size].visible = value;
  };

  Vinyl.prototype.update = function() {
    if (!(this._body && this._body[this._size])) {
      return;
    }

    this._body[this._size].position.set(this.position.x, this.position.y, this.position.z);
    this._body[this._size].rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
  };


  //--------------------------------------------------------------
  function Label() {

  }

  Label.prototype.setup = function(scene, assets, opts) {
    this._opts = opts || {
      size: 7
    };

    this._scene = scene;
    this._size = this._opts.size.toString();
    this._largeHole = false;

    this._smallHoleFront = assets['assetsModelLabelFrontSmall-7'];
    this._smallHoleBack = assets['assetsModelLabelBackSmall-7'];
    this._largeHoleFront = assets['assetsModelLabelFrontLarge-7'];
    this._largeHoleBack = assets['assetsModelLabelBackLarge-7'];

    this._front = {
      '7' : this._smallHoleFront,
      '10': assets['assetsModelLabelFront-10'],
      '12': assets['assetsModelLabelFront-12'],
      current: null
    };

    this._back = {
      '7' : this._smallHoleBack,
      '10': assets['assetsModelLabelBack-10'],
      '12': assets['assetsModelLabelBack-12'],
      current: null
    };

    this._front.current = this._front[this._size];
    this._back.current = this._back[this._size];

    this._frontTexture = new THREE.Texture();
    this._backTexture  = new THREE.Texture();

    this.updateTexture(this._frontTexture, assets['assetsTextureLabelFront']);
    this.updateTexture(this._backTexture, assets['assetsTextureLabelBack']);

    this.initMaterial(this._front.current, this._frontTexture);
    this.initMaterial(this._back.current, this._backTexture);

    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this._scene.add(this._front.current);
    this._scene.add(this._back.current);

    var self = this;
    Object.keys(this._back).forEach(function(key) {
      self._back[key].rotation.z = self.rotation.z + Math.PI;
    });
  };

  Label.prototype.initMaterial = function(obj, tex) {
    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          ambient: 0xFFFFFF,
          color: 0xFFFFFF,
          map: tex,
          shininess: 5,
          specular: 0x363636,
          shading: THREE.SmoothShading,
          vertexColor: THREE.VertexColors
        });
      }
    });

    return obj;
  };

  Label.prototype.updateTexture = function(tex, img) {
    if (!tex || !img) {
      return;
    }

    tex.image = img;
    tex.needsUpdate = true;
  };

  Label.prototype.setSize = function(size) {
    if (!size) {
      return;
    }

    console.log('Label::setSize', size);

    this._scene.remove(this._front.current);
    this._scene.remove(this._back.current);

    this._size = size.toString();

    this._front.current = this._front[this._size];
    this._back.current = this._back[this._size];

    this.initMaterial(this._front.current, this._frontTexture);
    this.initMaterial(this._back.current, this._backTexture);

    this._scene.add(this._front.current);
    this._scene.add(this._back.current);
  };

  Label.prototype.setLargeHole = function(value) {
    if ('7' !== this._size) {
      return;
    }

    this._scene.remove(this._front.current);
    this._scene.remove(this._back.current);

    this._largeHole = value;

    this._front['7'] = this._largeHole ? this._largeHoleFront : this._smallHoleFront;
    this._back['7'] = this._largeHole ? this._largeHoleBack : this._smallHoleBack;
    this._front.current = this._front['7'];
    this._back.current = this._back['7'];

    this.initMaterial(this._front.current, this._frontTexture);
    this.initMaterial(this._back.current, this._backTexture);

    this._scene.add(this._front.current);
    this._scene.add(this._back.current);
  };

  Label.prototype.setTexture = function(sideA, sideB) {
    if (sideA) {
      this.updateTexture(this._frontTexture, sideA);
    }

    if (sideB) {
      this.updateTexture(this._backTexture, sideB);
    }
  };

  Label.prototype.setVisible = function(value) {
    this._front[this._size].visible = this._back[this._size].visible = value;
  };

  Label.prototype.update = function() {
    if (!(this._front && this._back)) {
      return;
    }

    this._front[this._size].position.set(this.position.x, this.position.y, this.position.z);
    this._back[this._size].position.set(this.position.x, this.position.y, this.position.z);
    this._front[this._size].rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    this._back[this._size].rotation.set(this.rotation.x, this.rotation.y, this.rotation.z + Math.PI);
  };

  /**
   * Module dependencies.
   */

  var Emitter = exports.Emitter;

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
      if (!self.vinyl) {
        return;
      }

      self.vinyl.setBumpScale(value);
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
