
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
    rotate: false,
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

  //--------------------------------------------------------------
  function Sleeve() {
  }

  Sleeve.prototype.setup = function(scene, assets, opts) {
    this.opts = opts || {
      size: 7
    };

    this.scene = scene;
    this.currentSize = this.opts.size.toString();
    // TODO: create models of each size.
    // ex.
    // this.front_7 = ...
    // this.front_10 = ... 
    this.body = null;

    this.front = {
      '7' : assets['assetsModelSleeveFront-7'],
      '10': assets['assetsModelSleeveFront-10'],
      '12': assets['assetsModelSleeveFront-12'],
    };

    this.back = {
      '7' : assets['assetsModelSleeveBack-7'],
      '10': assets['assetsModelSleeveBack-10'],
      '12': assets['assetsModelSleeveBack-12']
    };

    this.spine = {
      '7' : assets['assetsModelSleeveSpine-7'],
      '10': assets['assetsModelSleeveSpine-10'],
      '12': assets['assetsModelSleeveSpine-12']
    };

    this.textures = {
      front: new THREE.Texture(),
      back: new THREE.Texture(),
      spine: new THREE.Texture()
    };

    this.updateTexture(this.textures.front, assets['assetsTextureSleeveFront'] || assets['assetsTextureSleeveDefault']);
    this.updateTexture(this.textures.back, assets['assetsTextureSleeveBack'] || assets['assetsTextureSleeveDefault']);
    this.updateTexture(this.textures.spine, assets['assetsTextureSleeveSpine'] || assets['assetsTextureSleeveDefault']);

    this.initMaterial(this.front[this.currentSize], this.textures.front);
    this.initMaterial(this.back[this.currentSize], this.textures.back);
    this.initMaterial(this.spine[this.currentSize], this.textures.spine);

    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this.scene.add(this.front[this.currentSize]);
    this.scene.add(this.back[this.currentSize]);
    this.scene.add(this.spine[this.currentSize]);
  };

  Sleeve.prototype.initMaterial = function(obj, tex) {
    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          map: tex,
          ambient: 0xFFFFFF,
          color: 0xFFFFFF,
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

  Sleeve.prototype.setVisible = function(value) {
    this.front[this.currentSize].visible = this.back[this.currentSize].visible = this.spine[this.currentSize].visible = value;
  };

  Sleeve.prototype.update = function() {
    this.front[this.currentSize].position.set(this.position.x, this.position.y, this.position.z);
    this.front[this.currentSize].rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

    this.back[this.currentSize].position.set(this.position.x, this.position.y, this.position.z);
    this.back[this.currentSize].rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

    this.spine[this.currentSize].position.set(this.position.x, this.position.y, this.position.z);
    this.spine[this.currentSize].rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
  };


  //--------------------------------------------------------------
  function Vinyl() {

  }

  Vinyl.prototype.setup = function(scene, assets, opts) {
    this.opts = opts || {
      bumpScale: 0.36,
      color: 0x000000,
      size: 7
    };
console.log(assets);
    this._scene = scene;
    this._size = this.opts.size.toString();

    this.body = {
      '7': assets['assetsModelVinyl-7'],
      '10': assets['assetsModelVinyl-10'],
      '12': assets['assetsModelVinyl-12'],
    };

    this.textures = {
      splatter: new THREE.Texture(),
      bumpMap: {
        '7': new THREE.Texture(),
        '10': new THREE.Texture(),
        '12': new THREE.Texture()
      }
    };

    var self = this;

    Object.keys(self.textures.bumpMap).forEach(function(key) {
      self.updateTexture(self.textures.bumpMap[key], assets['assetsTextureVinylBumpmap-' + key]);
    });

    Object.keys(self.body).forEach(function(key) {
      self.initMaterial(self.body[key], self.textures.bumpMap[key]);
    });

    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this._scene.add(this.body[this._size]);
  };

  Vinyl.prototype.initMaterial = function(obj, tex) {
    var self = this;
console.log(self.opts);
    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          ambient: 0xFFFFFF,
          bumpMap: tex,
          bumpScale: 0.36,
          color: self.opts.color,
          map: tex,
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

    Object.keys(self.body).forEach(function(key) {
      self.body[key].traverse(function(child) {
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

    this._scene.remove(this.body[this._size]);

    this._size = size.toString();
    this._scene.add(this.body[this._size]);
  };

  Vinyl.prototype.setVisible = function(value) {
    this.body[this._size].visible = value;
  };

  Vinyl.prototype.update = function() {
    if (!(this.body && this.body[this._size])) {
      return;
    }

    this.body[this._size].position.set(this.position.x, this.position.y, this.position.z);
    this.body[this._size].rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
  };


  //--------------------------------------------------------------
  function Label() {

  }

  Label.prototype.setup = function(scene, assets, opts) {
    this.opts = opts || {
      size: 7
    };

    this._scene = scene;
    this._size = this.opts.size.toString();
    this._largeHole = false;

    this._smallHoleFront = assets['assetsModelLabelFrontSmall-7'];
    this._smallHoleBack = assets['assetsModelLabelBackSmall-7'];
    this._largeHoleFront = assets['assetsModelLabelFrontLarge-7'];
    this._largeHoleBack = assets['assetsModelLabelBackLarge-7'];

    this.front = {
      '7' : this._smallHoleFront,
      '10': assets['assetsModelLabelFront-10'],
      '12': assets['assetsModelLabelFront-12'],
      current: null
    };

    this.back = {
      '7' : this._smallHoleBack,
      '10': assets['assetsModelLabelBack-10'],
      '12': assets['assetsModelLabelBack-12'],
      current: null
    };

    this.front.current = this.front[this._size];
    this.back.current = this.back[this._size];

    this.frontTexture = new THREE.Texture();
    this.backTexture  = new THREE.Texture();

    this.updateTexture(this.frontTexture, assets['assetsTextureLabelFront']);
    this.updateTexture(this.backTexture, assets['assetsTextureLabelBack']);

    this.initMaterial(this.front.current, this.frontTexture);
    this.initMaterial(this.back.current, this.backTexture);

    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this._scene.add(this.front.current);
    this._scene.add(this.back.current);
    
    var self = this;
    Object.keys(this.back).forEach(function(key) {
      self.back[key].rotation.z = self.rotation.z + Math.PI;
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

    this._scene.remove(this.front.current);
    this._scene.remove(this.back.current);

    this._size = size.toString();

    this.front.current = this.front[this._size];
    this.back.current = this.back[this._size];

    this.initMaterial(this.front.current, this.frontTexture);
    this.initMaterial(this.back.current, this.backTexture);

    this._scene.add(this.front.current);
    this._scene.add(this.back.current);
  };

  Label.prototype.setLargeHole = function(value) {
    if ('7' !== this._size) {
      return;
    }

    this._scene.remove(this.front.current);
    this._scene.remove(this.back.current);

    this._largeHole = value;

    this.front['7'] = this._largeHole ? this._largeHoleFront : this._smallHoleFront;
    this.back['7'] = this._largeHole ? this._largeHoleBack : this._smallHoleBack;
    this.front.current = this.front['7'];
    this.back.current = this.back['7'];

    this.initMaterial(this.front.current, this.frontTexture);
    this.initMaterial(this.back.current, this.backTexture);

    this._scene.add(this.front.current);
    this._scene.add(this.back.current);
  };

  Label.prototype.setVisible = function(value) {
    this.front[this._size].visible = this.back[this._size].visible = value;
  };

  Label.prototype.update = function() {
    if (!(this.front && this.back)) {
      return;
    }

    this.front[this._size].position.set(this.position.x, this.position.y, this.position.z);
    this.back[this._size].position.set(this.position.x, this.position.y, this.position.z);
    this.front[this._size].rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    this.back[this._size].rotation.set(this.rotation.x, this.rotation.y, this.rotation.z + Math.PI);
  };

  //--------------------------------------------------------------
  function buildAxis( src, dst, colorHex, dashed ) {
    var geom = new THREE.Geometry(), mat;

    if(dashed) {
      mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
    } else {
      mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
    }

    geom.vertices.push( src.clone() );
    geom.vertices.push( dst.clone() );
    geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

    var axis = new THREE.Line( geom, mat, THREE.LinePieces );

    return axis;

  }

  //--------------------------------------------------------------
  function buildAxes(length) {
    var axes = new THREE.Object3D();

    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

    return axes;
  }

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
    this.parent = parent;
    this.assets = assets;
    this.opts = opts || {};

    // init
    var scene = this.scene = new THREE.Scene();

    var camera = this.camera = new THREE.PerspectiveCamera(this.opts.camera.fov, this.opts.camera.aspect, this.opts.camera.near, this.opts.camera.far);

    var renderer = this.renderer = new THREE.WebGLRenderer(this.opts.renderer);
    this.renderer.setSize(this.opts.width, this.opts.height);
    this.renderer.setClearColor(0xFFFFFF, 1.0);

    this.initGui();
    this.initLights();

    var shadowTexture = this.shadowTexture = new THREE.Texture();
    shadowTexture.image = assets['assetsTextureShadow'];
    shadowTexture.needsUpdate = true;
    var pgeometry = new THREE.PlaneGeometry(30, 30);
    var pmaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, map: shadowTexture });
    var ground = new THREE.Mesh(pgeometry, pmaterial);
    ground.position.set(0, 0, 0);
    ground.rotation.x = 90 * Math.PI / 180;
    // ground.receiveShadow = true;
    // scene.add(ground);

    var size = 12;

    this.enableRotate = false;
    this.rotationAmount = 0;

    this.sleeve = new Sleeve();
    this.sleeve.setup(this.scene, assets, { size: size });
    this.sleeve.position.x = -80;
    this.sleeve.setVisible(false);

    this.vinyl = new Vinyl();
    this.vinyl.setup(this.scene, assets, { size: size, color: 0xFFFFFF });

    this.label = new Label();
    this.label.setup(this.scene, assets, { size: size });

    this.camera.position.set(-200, 250, 200);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  /**
   * Mixin `Emitter`.
   */

  Emitter(World.prototype);

  /**
   *
   */

  World.prototype.initLights = function() {
    var scene = this.scene;

    var spotLight1 = new THREE.SpotLight(0xFFFFFF, 0.4, 0, 0.314, 10);
    spotLight1.position.set(100, 200, 150);
    scene.add(spotLight1);

    var spotLight2 = new THREE.SpotLight(0xFFFFFF, 0.4, 0, 0.314, 10);
    spotLight2.position.set(-76.36000061035156, 200, 150);
    // spotLight2.castShadow = true;
    // spotLight2.shadowMapWidth = spotLight2.shadowMapHeight = 2048;
    scene.add(spotLight2);

    var pointLight1 = new THREE.PointLight(0xFFFFFF, 0.4, 0);
    pointLight1.position.set(21.09000015258789, 213.86000061035156, -84.06999969482422);
    scene.add(pointLight1);

    var pointLight2 = new THREE.PointLight(0xFFFFFF, 0.4, 0);
    pointLight2.position.set(-2.059999942779541, -80.05000305175781, 10.65999984741211);
    scene.add(pointLight2);

    var hemisphereLight1 = new THREE.HemisphereLight(0x080E21, 0x2E1B11, 1.0);
    hemisphereLight1.position.set(-128.50999450683594, 243.4199981689453, 52.41999816894531);
    scene.add(hemisphereLight1);

    var hemisphereLight2 = new THREE.HemisphereLight(0x120C17, 0x220A0E, 1.0);
    hemisphereLight2.position.set(100, 244.38999938964844, 193.2899932861328);
    scene.add(hemisphereLight2);

    var ambientLight = new THREE.AmbientLight(0x0D0D0D);
    ambientLight.position.set(0, 20.049999237060547, 178.11000061035156);
    scene.add(ambientLight);
  };

  /**
   *
   */

  World.prototype.initGui = function() {
    var gui = this.gui = new dat.GUI();
    var rotationController = gui.add(props, 'rotate');
    var colorController = gui.add(props, 'color', ['Black', 'Blanc', 'Jaune', 'Rouge', 'Orange', 'Bleu', 'Brun', 'Vert', 'Gris', 'Vert(transparent)', 'Jaune(transparent)', 'Rouge(transparent)', 'Violet(transparent)', 'Bleu(transparent)', 'Transparent']);
    var sizeController = gui.add(props, 'size', [7, 10, 12]);
    var labelController = gui.add(props, 'label', [1, 2, 3, 4, 5, 6, 7, 8]);
    var cameraPositionController = gui.add(props, 'camera_pos', [1, 2, 3, 4]);
    var cameraXController = gui.add(cameraProps, 'x', -200, 200);
    var cameraYController = gui.add(cameraProps, 'y', -200, 200);
    var cameraZController = gui.add(cameraProps, 'z', -200, 200);
    var rotateXController = gui.add(props, 'rotateX', -Math.PI / 2, Math.PI / 2);
    var rotateYController = gui.add(props, 'rotateY', -Math.PI / 2, Math.PI / 2);
    var rotateZController = gui.add(props, 'rotateZ', -Math.PI / 2, Math.PI / 2);
    var sleeveXController = gui.add(props, 'sleeveX', -32, 0);
    var bumpScaleController = gui.add(props, 'bumpScale', 0, 1.0);
    var fovController = gui.add(props, 'fov', 20, 50);

    var self = this;
    var axes = this.axes;
    var camera = this.camera;

    rotationController.onChange(function(value) {
      self.enableRotate = value;
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
          camera.position.set(0, 17, 47);
          labelObj.rotation.set(1.4255541939532348, 0, 0);
          vinylObj.rotation.set(1.4255541939532348, 0, 0);
          break;
        case 2:
          camera.position.set(0, 17, 17);
          labelObj.rotation.set(1.323405880745912, 0, 0);
          vinylObj.rotation.set(1.323405880745912, 0, 0);
          break;
        case 3:
          camera.position.set(0, 17, 73);
          labelObj.rotation.set(1.3574553184816862, 0, 0);
          vinylObj.rotation.set(1.3574553184816862, 0, 0);
          break;
        case 4:
          camera.position.set(4, 17, 56);
          labelObj.rotation.set(1.3574553184816862, -0.20881881736392782, 0.43812049961578214);
          vinylObj.rotation.set(1.3574553184816862, -0.20881881736392782, 0.43812049961578214);
          break;
        default:
          break;
      }
    });

    cameraXController.onChange(function(value) {
      self.camera.position.x = value;
      self.camera.lookAt(new THREE.Vector3(0, 0, 0));
    });

    cameraYController.onChange(function(value) {
      self.camera.position.y = value;
      self.camera.lookAt(new THREE.Vector3(0, 0, 0));
    });

    cameraZController.onChange(function(value) {
      self.camera.position.z = value;
      self.camera.lookAt(new THREE.Vector3(0, 0, 0));
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
      self.camera.setLens(value);
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
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
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
    console.log('World::updateView');
    // TODO: process
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
    if (this.enableRotate) {
      this.rotationAmount = Math.min(this.rotationAmount + 0.001, 0.07);
    } else {
      this.rotationAmount = Math.max(this.rotationAmount - 0.001, 0);
    }

    if (this.sleeve) {
      this.sleeve.update();
    }

    if (this.vinyl) {
      if (this.enableRotate) {
        this.vinyl.rotation.y += this.rotationAmount;
      }
      this.vinyl.update();
    }

    if (this.label) {
      if (this.enableRotate) {
        this.label.rotation.y += this.rotationAmount;
      }
      this.label.update();
    }
  };

  /**
   *
   */
  World.prototype.draw = function() {
    this.update();
    this.renderer.render(this.scene, this.camera);
    this.request = requestAnimationFrame(this.draw.bind(this));
  };

  /**
   *
   */
  World.prototype.delegateEvents = function() {
    var parent = this.parent;

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
    parent.label.on('sideATexture', this.onLabelSideBTextureChanged.bind(this));

    parent.sleeve.on('type', this.onSleeveTypeChanged.bind(this));
    parent.sleeve.on('hole', this.onSleeveHoleChanged.bind(this));
    parent.sleeve.on('glossFinished', this.onSleeveGlossFinishedChanged.bind(this));
    parent.sleeve.on('frontTexture', this.onSleeveFrontTextureChanged.bind(this));
    parent.sleeve.on('backTexture', this.onSleeveBackTextureChanged.bind(this));
    parent.sleeve.on('spineTexture', this.onSleeveSpineTextureChanged.bind(this));

    return this;
  };

  World.prototype.undelegateEvents = function() {
    var parent = this.parent;

    return this;
  };

  World.prototype.onVinylTypeChanged = function(value) {
    console.log(value);
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

    this.vinyl.setSize(size);
    this.label.setSize(size);
  };

  World.prototype.onVinylColorChanged = function(value) {
    console.log(value);
  };

  World.prototype.onVinylSplatterColorChanged = function(value) {
    console.log(value);
  };

  World.prototype.onVinylHoleSizeChanged = function(value) {
    console.log('World::onVinylHoleSizeChanged', value);
    this.label.setLargeHole(0 === value ? false : true);
  };

  World.prototype.onVinylHeavyChanged = function(value) {
    console.log(value);
  };

  World.prototype.onVinylSpeedChanged = function(value) {
    console.log(value);
  };

  World.prototype.onVinylSideATextureChanged = function(value) {
    console.log(value);
  };

  World.prototype.onVinylSideBTextureChanged = function(value) {
    console.log(value);
  };

  World.prototype.onLabelTypeChanged = function(value) {
    console.log(value);
  };

  World.prototype.onLabelSideATextureChanged = function(value) {
    console.log(value);
  };

  World.prototype.onLabelSideBTextureChanged = function(value) {
    console.log(value);
  };

  World.prototype.onSleeveTypeChanged = function(value) {
    console.log(value);
  };

  World.prototype.onSleeveHoleChanged = function(value) {
    console.log(value);
  };

  World.prototype.onSleeveGlossFinishedChanged = function(value) {
    console.log(value);
  };

  World.prototype.onSleeveFrontTextureChanged = function(value) {
    console.log(value);
  };

  World.prototype.onSleeveBackTextureChanged = function(value) {
    console.log(value);
  };

  World.prototype.onSleeveSpineTextureChanged = function(value) {
    console.log(value);
  };

})(this, (this.qvv = (this.qvv || {})));
