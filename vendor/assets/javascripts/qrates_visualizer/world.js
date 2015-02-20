
//= require tdmsinc-three.js
//= require ./emitter
//= require_tree ./world
//= require_self

(function(global, exports) {

  var clock = new THREE.Clock();
  var delta = clock.getDelta(); // seconds.
  var container, stats;
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
    axes: false,
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

  Sleeve.prototype.setup = function(scene, opts) {
    opts = opts || {
      size: $('#container').data('size')
    };

    var self = this;

    self.scene = scene;
    self.body = null;
    self.face = null;
    self.back = null;
    self.spine = null;
    self.faceTexture = new THREE.Texture();
    self.backTexture = new THREE.Texture();
    self.spineTexture = new THREE.Texture();

    self.position = {
      x: 0,
      y: 0,
      z: 0,
      set: function(x, y, z) {
        self.position.x = x;
        self.position.y = y;
        self.position.z = z;

        self.update();
      }
    };

    self.rotation = {
      x: 0,
      y: 0,
      z: 0,
      set: function(x, y, z) {
        self.rotation.x = x;
        self.rotation.y = y;
        self.rotation.z = z;

        self.update();
      }
    };

    self.loadTextures(opts.size)
      .then(function() {
        return self.loadModels(opts.size);
      })
      .then(function() {
        // self.scene.add(self.body);
        self.scene.add(self.face);
        self.scene.add(self.back);
        self.scene.add(self.spine);

        self.update();
      });
  };

  Sleeve.prototype.loadTextures = function(size) {
    var self = this;

    return new Promise(function(resolve, reject) {
      var manager = new THREE.LoadingManager();

      manager.onLoad = function(){
        resolve();
      };

      manager.onError = function() {
        reject();
      };

      var loader = new THREE.TextureLoader(manager);

      loader.load($('#container').data('sleeve-texture-face').replace('%', size), function(texture) {
        self.faceTexture = texture;
        self.faceTexture.needsUpdate = true;
      });

      loader.load($('#container').data('sleeve-texture-back').replace('%', size), function(texture) {
        self.backTexture = texture;
        self.backTexture.needsUpdate = true;
      });

      loader.load($('#container').data('sleeve-texture-spine').replace('%', size), function(texture) {
        self.spineTexture = texture;
        self.spineTexture.needsUpdate = true;
      });
    });
  };

  Sleeve.prototype.loadModels = function(size, callback) {
    var self = this;

    return new Promise(function(resolve, reject) {
      var manager = new THREE.LoadingManager();

      manager.onLoad = function() {
        resolve();
      };

      manager.onError = function() {
        reject();
      };

      var loader = new THREE.OBJLoader(manager);
      loader.load($('#container').data('sleeve-obj-body').replace('%', size), function(obj) {
        self.body = obj;
      });

      loader.load($('#container').data('sleeve-obj-face').replace('%', size), function(obj) {
        obj.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({
              ambient: 0xFFFFFF,
              color: 0xFFFFFF,
              map: self.faceTexture,
              shininess: 35,
              specular: 0x363636,
            });
          }
        });

        obj.position.y = 1.5;
        self.face = obj;
      });

      loader.load($('#container').data('sleeve-obj-back').replace('%', size), function(obj) {
        obj.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({
              map: self.backTexture
            });
          }
        });

        obj.position.y = -1.5;
        self.back = obj;
      });

      loader.load($('#container').data('sleeve-obj-spine').replace('%', size), function(obj) {
        obj.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({
              map: self.spineTexture
            });
          }
        });

        obj.position.x = -157.4;
        obj.position.y = 0;
        obj.rotation.z = Math.PI / 2;
        self.spine = obj;
      });
    });
  };

  Sleeve.prototype.update = function() {
    if (!(this.body && this.face && this.back && this.spine)) {
      return;
    }

    this.body.position.set(this.position.x, this.position.y, this.position.z);
    this.body.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

    this.face.position.set(this.position.x, this.position.y + 1.5, this.position.z);
    this.face.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

    this.back.position.set(this.position.x, this.position.y - 1.5, this.position.z);
    this.back.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

    this.spine.position.set(this.position.x - 157.4, this.position.y, this.position.z);
    this.spine.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z + Math.PI / 2);
  };


  //--------------------------------------------------------------
  function loadModel(options) {
    if (0 > [7, 10, 12].indexOf(options.size)) {
      return;
    }

    return new Promise(function(resolve, reject) {
      var objLoader = new THREE.OBJLoader();

      var path;

      if ('label' == options.type) {
        path = 'models/vinyl_' + options.size + '_inner.obj';
      } else if ('vinyl' == options.type) {
        path = 'models/vinyl_' + options.size + '_outer.obj';
      } else if ('sleeve' == options.type) {
        path = 'models/sleeve_' + options.size + '.obj';
      }

      objLoader.load(path, function(obj) {
        obj.traverse(function(child) {
          if (child instanceof THREE.Mesh) {

            var material = new THREE.MeshPhongMaterial({
              map: options.map,
              ambient: options.ambient,
              bumpMap: options.bumpMap,
              bumpScale: options.bumpScale,
              color: options.color,
              emissive: 0,
              shininess: options.shininess,
              specular: options.specular,
              shading: THREE.SmoothShading,
              vertexColor: THREE.VertexColors
            });

            child.material = material;
            // child.castShadow = true;
          }
        });

        resolve(obj);
      });
    });
  }

  //--------------------------------------------------------------



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

  //--------------------------------------------------------------
  function init() {
    // $(window).on('resize', function(e) {
    //   camera.aspect = window.innerWidth / window.innerHeight;
    //   camera.updateProjectionMatrix();
    //
    //   renderer.setSize(window.innerWidth, window.innerHeight);
    //
    //   render();
    // });
    //
    // $(window).on('dragover', function(e) {
    //   if (0 === $('.overlay').length) {
    //     $('body').prepend('<div class="overlay"></div>');
    //   }
    //   return false;
    // });
    //
    // $(window).on('drop', function(e) {
    //   if (e.originalEvent.dataTransfer.files.length) {
    //     var file = e.originalEvent.dataTransfer.files[0];
    //
    //     if (file.type.match(/jpeg|png|gif|tiff/)) {
    //       var reader = new FileReader();
    //       reader.addEventListener('load', function(e) {
    //         var img = new Image();
    //
    //         img.onload = function() {
    //           if (file.name.match(/vinyl/)) {
    //             vinylTexture.image = img;
    //             vinylTexture.needsUpdate = true;
    //           } else if (file.name.match(/label/)) {
    //             labelTexture.image = img;
    //             labelTexture.needsUpdate = true;
    //           } else if (file.name.match(/sleeve/)) {
    //             sleeveTexture.image = img;
    //             sleeveTexture.needsUpdate = true;
    //           }
    //         };
    //
    //         img.src = e.target.result;
    //       });
    //
    //       reader.readAsDataURL(file);
    //     }
    //   }
    //
    //   $('.overlay').remove();
    //
    //   return false;
    // });
  }

  //--------------------------------------------------------------
  function update() {
    // controls.update();
    if (labelObj && vinylObj) {
      labelObj.rotation.y -= 0.03;
      vinylObj.rotation.y = labelObj.rotation.y;
    }
  }

  //--------------------------------------------------------------
  function animate() {
    update();
    render();
    requestAnimationFrame( animate );
  }

  //--------------------------------------------------------------
  function render() {
    renderer.render( scene, camera );
  }

  // init();
  // animate();

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

    var camera = this.camera = new THREE.PerspectiveCamera(
      props.fov, window.innerWidth / window.innerHeight, 1, 10000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.position.z = 30;

    var renderer = this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xFFFFFF, 1.0);
    // renderer.shadowMapType = THREE.PCFSoftShadowMap;
    // renderer.shadowMapEnabled = true;

    var axes = this.axes = buildAxes(200);
    axes.visible = false;
    scene.add(axes);

    // var controls = this.controls = new THREE.TrackballControls(camera, renderer.domElement);

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
    scene.add(ground);

    var labelTexture = this.labelTexture = new THREE.Texture();
    // labelTexture.image = image;
    labelTexture.needsUpdate = true;

    var vinylTexture = this.vinylTexture = new THREE.Texture();
    // vinylTexture.image = image;
    vinylTexture.needsUpdate = true;

    var sleeveTexture = this.sleeveTexture = new THREE.Texture();
    // sleeveTexture.image = image;
    sleeveTexture.needsUpdate = true;

    // changeVinylSize(12);
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
    var axesController = gui.add(props, 'axes');
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

    var axes = this.axes;
    var camera = this.camera;

    axesController.onChange(function(value) {
      axes.visible = value;
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
      camera.position.x = value;
    });

    cameraYController.onChange(function(value) {
      camera.position.y = value;
    });

    cameraZController.onChange(function(value) {
      camera.position.z = value;
    });

    rotateXController.onChange(function(value) {
      // sleeve.rotation.x = labelObj.rotation.x = vinylObj.rotation.x = value;
      labelObj.rotation.x = vinylObj.rotation.x = value;
    });

    rotateYController.onChange(function(value) {
      labelObj.rotation.y = vinylObj.rotation.y = value;
    });

    rotateZController.onChange(function(value) {
      // sleeve.rotation.z = labelObj.rotation.z = vinylObj.rotation.z = value;
      labelObj.rotation.z = vinylObj.rotation.z = value;
    });

    sleeveXController.onChange(function(value) {
      // sleeve.position.x = value;
    });

    bumpScaleController.onChange(function(value) {
      if (!vinylObj) {
        return;
      }

      vinylObj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.bumpScale = Number(value);
        }
      });
    });

    fovController.onChange(function(value) {
      // camera.setLens(value);
    });
  };

  World.prototype.changeVinylSize = function(size) {
    var scene = this.scene;
    var labelObj = this.labelObj;
    var vinylObj = this.vinylObj;

    scene.remove(labelObj);
    scene.remove(vinylObj);

    loadModel({
      ambient: 0xFFFFFF,
      color: 0xFFFFFF,
      map: labelTexture,
      size: Number(size),
      shininess: 5,
      specular: 0x363636,
      type: 'label'
    })
      .then(function(obj) {
        labelObj = obj;

        return loadModel({
          ambient: 0xFFFFFF,
          bumpMap: vinylTexture,
          bumpScale: props.bumpScale,
          color: 0,
          map: null,//vinylTexture,
          size: Number(size),
          shininess: 35,
          specular: 0x363636,
          type: 'vinyl'
        });
      })
      .then(function(obj) {
        vinylObj = obj;

        return loadModel({
          ambient: 0xFFFFFF,
          color: 0xFFFFFF,
          map: sleeveTexture,//vinylTexture,
          size: Number(size),
          shininess: 35,
          specular: 0x363636,
          type: 'sleeve'
        });
      })
      .then(function(obj) {
        sleeveObj = obj;

        scene.add(labelObj);
        scene.add(vinylObj);
        // scene.add(sleeveObj);

        labelObj.position.y = vinylObj.position.y = 18;

        sleeveObj.position.set(-15, 18, 0);

        camera.position.set(0, 17, 64);
        labelObj.rotation.set(props.rotateX, 0, 0);
        vinylObj.rotation.set(props.rotateX, 0, 0);
        // sleeveObj.rotation.set(props.rotateX, 0, 0);

        // sleeve = new Sleeve();
        // sleeve.setup(scene);
        // sleeve.position.set(-15, 18, 0);
        // sleeve.rotation.set(props.rotateX, 0, 0);
      });
  };

  /**
   *
   */

  World.prototype.start =
  World.prototype.resume = function() {
    return this;
  };

  /**
   *
   */

  World.prototype.pause = function() {
    return this;
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
    console.log(value);
  };

  World.prototype.onVinylColorChanged = function(value) {
    console.log(value);
  };

  World.prototype.onVinylSplatterColorChanged = function(value) {
    console.log(value);
  };

  World.prototype.onVinylHoleSizeChanged = function(value) {
    console.log(value);
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
