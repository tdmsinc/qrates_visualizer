
//= require tdmsinc-three.js
//= require_self

(function(global, exports) {

  exports.world = exports.world || {};
  exports.world.Vinyl = Vinyl;

  //--------------------------------------------------------------
  function Vinyl() {
  }

  Vinyl.prototype.setup = function(scene, assets, opts, container) {
    opts = opts || {
      type: 1,
      size: 1,
      color: 0,
      holeSize: 0,
      heavy: false,
      speed: 45,
    };

    opts.color = opts.color || 0;

    this._materialPresets = [
      { color: 0x000000, opacity: 1.0, reflectivity: 1.0, refractionRatio: 0.98, shininess:  25, metal: true }, // CLASSIC BLACK
      { color: 0xFFFFFF, opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true }, // #1 WHITE
      { color: 0xfffd4d, opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true }, // #2 EASTER YELLOW
      { color: 0xcc0e00, opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true }, // #3 RED(ISH)
      { color: 0xff8c1a, opacity: 1.0, reflectivity:0.05, refractionRatio: 0.98, shininess:  15, metal: true }, // #4 HALLOWEEN ORANGE
      { color: 0x00b1dd, opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true }, // #5 CYAN BLUE
      { color: 0x593320, opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true }, // #6 DOOKIE BROWN
      { color: 0x41ff9f, opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true }, // #7 DOUBLEMINT
      { color: 0x9EA2A2, opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true }, // #8 GREY
      { color: 0x00b94e, opacity: 0.7, reflectivity: 0.6, refractionRatio: 1.98, shininess: 100, metal: true }, // #9 KELLY GREEN
      { color: 0xffed00, opacity: 0.8, reflectivity: 0.3, refractionRatio: 1.98, shininess:  80, metal: true }, // #10 PISS YELLOW
      { color: 0xc8000e, opacity: 0.8, reflectivity: 0.2, refractionRatio: 1.98, shininess:  60, metal: true }, // #11 BLOOD RED
      { color: 0x9a004c, opacity: 0.8, reflectivity: 0.3, refractionRatio: 1.98, shininess:  80, metal: true }, // #12 DEEP PURPLE
      { color: 0x0040b6, opacity: 0.8, reflectivity: 0.6, refractionRatio: 1.98, shininess: 100, metal: true }, // #13 ROYAL BLUE
      { color: 0xFFFFFF, opacity: 0.6, reflectivity: 0.6, refractionRatio: 1.98, shininess:  80, metal: true }, // #14 MILKY CLEAR
      { color: 0x615c30, opacity: 0.8, reflectivity: 0.3, refractionRatio: 1.98, shininess:  20, metal: true }, // P1 SWAMP GREEN
      { color: 0x187889, opacity: 0.8, reflectivity: 0.3, refractionRatio: 1.98, shininess:  20, metal: true }, // P2 SEA BLUE
      { color: 0xfbefd8, opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true }, // P3 BONE
      { color: 0x975d3b, opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  40, metal: true }, // P4 BRONZE
      { color: 0xddbd78, opacity: 0.7, reflectivity: 0.6, refractionRatio: 1.98, shininess: 100, metal: true }, // P5 BEER
      { color: 0xbbdcde, opacity: 0.7, reflectivity: 0.6, refractionRatio: 1.98, shininess: 100, metal: true }, // P6 ELECTRIC BLUE
      { color: 0x923b5d, opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true }, // P7 GRIMACE PURPLE
      { color: 0x962e3f, opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true }, // P8 OXBLOOD
      { color: 0xd4e0cb, opacity: 0.4, reflectivity: 0.6, refractionRatio: 1.98, shininess:  60, metal: true }, // P9 COKE BOTTLE GREEN
      { color: 0xf0773c, opacity: 0.7, reflectivity: 0.3, refractionRatio: 1.98, shininess:  20, metal: true }, // P10 ORANGE CRUSH
      { color: 0xd12b51, opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true }, // P11 HOT PINK / MAGENTA
      { color: 0xf5ccd4, opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true }, // P12 BABY PINK
      { color: 0x648044, opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true }, // P13 OLIVE GREEN
      { color: 0x18738e, opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true }, // P14 AQUA BLUE
      { color: 0xFFFFFF, opacity: 0.3, reflectivity: 0.6, refractionRatio: 1.98, shininess:  80, metal: true }, // P15 ULTRA CLEAR
      { color: 0xb1cbe5, opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true }, // P16 BABY BLUE
      { color: 0xe4e343, opacity: 0.4, reflectivity: 0.6, refractionRatio: 1.98, shininess:  80, metal: true }, // P17 HIGHLIGHTER YELLOW
      { color: 0x9d793a, opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  50, metal: true }, // P18 GOLD
      { color: 0xa7a8aa, opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  50, metal: true }, // P19 SILVER
      { color: 0xfed76f, opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true }, // P20 MUSTARD
    ];

    var sizes = ['7', '10', '12'];

    var images = [];
    var cubeTexture = new THREE.CubeTexture(images);
    cubeTexture.flipY = false;

    for (var i = 0; i < 6; ++i) {
      cubeTexture.images[i] = assets['assetsTextureVinylEnvmap'];
    }
    cubeTexture.needsUpdate = true;

    this.TYPE_BLACK    = 1;
    this.TYPE_COLOR    = 2;
    this.TYPE_SPLATTER = 3;

    this._container = container;
    this._size = sizes[opts.size - 1];
    this._type = opts.type;
    this._defaultColor = 0x000000;
    this._opacity = 0;
    this._rpm = opts.speed;
    this._heavy = opts.heavy;
    this._enableRotate = false;
    this._opacityTweenDuration = 300;
    this._clock = new THREE.Clock();

    if (this._type === this.TYPE_SPLATTER) {
      this._materialParams = this._materialPresets[1];
      this._color = 0xffffff;
    } else if (this._type === this.TYPE_COLOR) {
      this._materialParams = this._materialPresets[opts.color];
      this._color = this._materialParams.color;
    } else {
      this._materialParams = this._materialPresets[0];
      this._color = 0;
    }

    this._front = {
      '7'       : assets['assetsModelVinyl-7'],
      '10'      : assets['assetsModelVinyl-10'],
      '12'      : assets['assetsModelVinyl-12'],
      'heavy-7' : assets['assetsModelVinylHeavy-7'],
      'heavy-10': assets['assetsModelVinylHeavy-10'],
      'heavy-12': assets['assetsModelVinylHeavy-12']
    };

    this._back = {
      '7'       : assets['assetsModelVinyl-7'],
      '10'      : assets['assetsModelVinyl-10'],
      '12'      : assets['assetsModelVinyl-12'],
      'heavy-7' : assets['assetsModelVinylHeavy-7'],
      'heavy-10': assets['assetsModelVinylHeavy-10'],
      'heavy-12': assets['assetsModelVinylHeavy-12']
    };

    this._textures = {
      front: new THREE.Texture(),
      back: new THREE.Texture(),
      splatter: new THREE.Texture(),
      bumpMap: {
        'front-7' : new THREE.Texture(),
        'front-10': new THREE.Texture(),
        'front-12': new THREE.Texture(),
        'back-7'  : new THREE.Texture(),
        'back-10' : new THREE.Texture(),
        'back-12' : new THREE.Texture()
      },
      envMap: cubeTexture
    };

    this.updateTexture(this._textures.front, opts.sideATexture);
    this.updateTexture(this._textures.back,  opts.sideBTexture);
    this.updateTexture(this._textures.bumpMap['front-7'],  opts.sideABumpMapTexture || assets['assetsTextureVinylBumpmap-7']);
    this.updateTexture(this._textures.bumpMap['front-10'], opts.sideABumpMapTexture || assets['assetsTextureVinylBumpmap-10']);
    this.updateTexture(this._textures.bumpMap['front-12'], opts.sideABumpMapTexture || assets['assetsTextureVinylBumpmap-12']);
    this.updateTexture(this._textures.bumpMap['back-7'],   opts.sideBBumpMapTexture || assets['assetsTextureVinylBumpmap-7']);
    this.updateTexture(this._textures.bumpMap['back-10'],  opts.sideBBumpMapTexture || assets['assetsTextureVinylBumpmap-10']);
    this.updateTexture(this._textures.bumpMap['back-12'],  opts.sideBBumpMapTexture || assets['assetsTextureVinylBumpmap-12']);

    this._position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this._opacityTween = new TWEEN.Tween(this);

    if (this._heavy) {
      this._container.add(this._front['heavy-' + this._size]);
    } else {
      this._container.add(this._front[this._size]);
    }

    var self = this;

    Object.keys(self._front).forEach(function(key) {
      self.initMaterial(self._front[key], self._textures.front, self._textures.bumpMap['front-' + key]);
    });

    Object.keys(self._back).forEach(function(key) {
      self.initMaterial(self._back[key], self._textures.back, self._textures.bumpMap['back-' + key]);
    });

    this.setOpacity(this._materialParams.opacity);
  };

  Vinyl.prototype.initMaterial = function(obj, tex, bumpMapTex) {
    if (!obj) {
      return false;
    }

    obj.name = 'vinyl';

    var self = this;

    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        //var bumpScale = 0.02;
        var bumpScale = 0.03;

        if (self.TYPE_COLOR === self._type) {
          //bumpScale = 0.04;
          bumpScale = 0.06;
        } else if (self.TYPE_SPLATTER === self._type) {
          bumpScale = 0.28;
        }

        child.material = new THREE.MeshPhongMaterial({
          ambient: new THREE.Color(1, 1, 1),
          bumpMap: bumpMapTex,
          bumpScale: bumpScale,
          color: self._color,
          combine: THREE.Multiply,
          envMap: self._textures.envMap,
          map: self.TYPE_SPLATTER === self._type ? tex : null,
          needsUpdate: true,
          opacity: self.TYPE_SPLATTER === self._type ? 0.7 : self._materialParams.opacity,
          reflectivity: self.TYPE_SPLATTER === self._type ? 0.1 : self._materialParams.reflectivity,
          refractionRatio: self._materialParams.refractionRatio,
          shininess: self._materialParams.shininess,
          //side: THREE.DoubleSide,
          specular: 0x363636,
          transparent: true,
          metal: self._materialParams.metal,
          shading: THREE.SmoothShading,
        });

        child.geometry.computeVertexNormals();
      }
    });

    return obj;
  };

  Vinyl.prototype.updateTexture = function(tex, img) {
    if (!tex || !img) {
      return;
    }

    tex.image = img;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
  };

  Vinyl.prototype.setTexture = function(sideA, sideB) {
    if (this.TYPE_SPLATTER !== this._type) {
      return false;
    }

    var self = this;

    if (sideA) {
      this.updateTexture(this._textures.front, sideA);

      Object.keys(self._front).forEach(function(key) {
        var tex = self.TYPE_SPLATTER === self._type ? self._textures.front : new THREE.Texture();
        self.initMaterial(self._front[key], tex, self._textures.bumpMap['front-' + self._size]);
      });
    }

    if (sideB) {
      this.updateTexture(this._textures.back, sideB);

      Object.keys(self._back).forEach(function(key) {
        var tex = self.TYPE_SPLATTER === self._type ? self._textures.back : new THREE.Texture();
        self.initMaterial(self._back[key], tex, self._textures.bumpMap['back-' + self._size]);
      });
    }
  };

  Vinyl.prototype.setSideABumpMapTexture = function(image) {
    this.updateTexture(this._textures.bumpMap['front-' + self._size], image);
  };

  Vinyl.prototype.setSideBBumpMapTexture = function(image) {
    this.updateTexture(this._textures.bumpMap['back-' + self._size], image);
  };

  Vinyl.prototype.setBumpScale = function(value) {
    var self = this;

    Object.keys(self._front).forEach(function(key) {
      self._front[key].traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.bumpScale = value;
        }
      });
    });

    Object.keys(self._back).forEach(function(key) {
      self._back[key].traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.bumpScale = value;
        }
      });
    });
  };

  Vinyl.prototype.getBumpScale = function() {
    return this._front[this._size].children[0].material.bumpScale;
  };

  Vinyl.prototype.setSize = function(size) {
    if (!size) {
      console.error('[Vinyl::setSize] no size specified');
      return;
    }

    this._container.remove(this._front[this._size]);
    this._container.remove(this._front['heavy-' + this._size]);

    this._size = size;

    var self = this;

    Object.keys(self._front).forEach(function(key) {
      var tex = self.TYPE_SPLATTER === self._type ? self._textures.front : new THREE.Texture();
      self.initMaterial(self._front[key], tex, self._textures.bumpMap['front-' + self._size]);
    });

    Object.keys(self._back).forEach(function(key) {
      var tex = self.TYPE_SPLATTER === self._type ? self._textures.back : new THREE.Texture();
      self.initMaterial(self._back[key], tex, self._textures.bumpMap['back-' + self._size]);
    });

    if (this._heavy) {
      this._container.add(this._front['heavy-' + this._size]);
    } else {
      this._container.add(this._front[this._size]);
    }

    this._opacity = 0;
    this.setOpacity(this._materialParams.opacity);
  };

  Vinyl.prototype.setType = function(type) {
    if (!type) {
      return;
    }

    this._type = type;

    if (this.TYPE_SPLATTER === type) {
      this._materialParams = this._materialPresets[1];
    } else {
      this._materialParams = this._materialPresets[0];
    }

    this._color = this._materialParams.color;

    var self = this;

    Object.keys(self._front).forEach(function(key) {
      var tex = self.TYPE_SPLATTER === self._type ? self._textures.front : new THREE.Texture();
      self.initMaterial(self._front[key], tex, self._textures.bumpMap['front-' + self._size]);
    });

    Object.keys(self._back).forEach(function(key) {
      var tex = self.TYPE_SPLATTER === self._type ? self._textures.back : new THREE.Texture();
      self.initMaterial(self._back[key], tex, self._textures.bumpMap['back-' + self._size]);
    });

    this._opacity = 0;
    this.setOpacity(this._materialParams.opacity);
  };

  Vinyl.prototype.setColor = function(index) {
    this._materialParams = this._materialPresets[index];
    this._color = this.TYPE_SPLATTER === this._type ? 0xFFFFFF : this._materialParams.color;
    this._opacity = this.TYPE_SPLATTER === this._type ? 0.8 : this._materialParams.opacity;

    var self = this;

    Object.keys(self._front).forEach(function(key) {
      var tex = self.TYPE_SPLATTER === self._type ? self._textures.front : null;
      self.initMaterial(self._front[key], tex, self._textures.bumpMap['front-' + self._size]);
    });

    Object.keys(self._back).forEach(function(key) {
      var tex = self.TYPE_SPLATTER === self._type ? self._textures.back : null;
      self.initMaterial(self._front[key], tex, self._textures.bumpMap['back-' + self._size]);
    });
  };

  Vinyl.prototype.setOpacity = function(to, duration) {
    var self = this;

    duration = undefined !== duration ? duration : 300;

    this._opacityTween
      .stop()
      .to({ _opacity: to }, duration)
      .onUpdate(function() {
        self._front[self._size].traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.material.opacity = self._opacity;
          }

          if (child instanceof THREE.Object3D) {
            child.traverse(function(nextChild) {
              if (nextChild instanceof THREE.Mesh) {
                nextChild.material.opacity = self._opacity;
              }
            });
          }
        });
      })
      .start();
  };

  Vinyl.prototype.setEnableRotate = function(yn) {
    this._enableRotate = yn;
  };

  Vinyl.prototype.setRPM = function(rpm) {
    this._rpm = rpm;
  };

  Vinyl.prototype.setHeavy = function(yn) {
    if (this._heavy === yn) {
      return;
    }

    this._heavy = yn;

    var self = this;

    Object.keys(self._front).forEach(function(key) {
      var tex = self.TYPE_SPLATTER === self._type ? self._textures.front : new THREE.Texture();
      self.initMaterial(self._front[key], tex, self._textures.bumpMap['front-' + self._size]);
    });

    Object.keys(self._back).forEach(function(key) {
      var tex = self.TYPE_SPLATTER === self._type ? self._textures.back : new THREE.Texture();
      self.initMaterial(self._back[key], tex, self._textures.bumpMap['back-' + self._size]);
    });

    if (this._heavy) {
      console.log('heavy');
      this._container.remove(this._front[this._size]);
      this._container.add(this._front['heavy-' + this._size]);
    } else {
      console.log('not heavy');
      this._container.remove(this._front['heavy-' + this._size]);
      this._container.add(this._front[this._size]);
    }
  };

  Vinyl.prototype.setVisibility = function(yn, opts, callback) {
    this._front[this._size].visible = yn;
  };

  Vinyl.prototype.update = function() {
    if (!(this._front && this._front[this._size])) {
      return;
    }

    var amount = this._enableRotate ? this._clock.getDelta() * (Math.PI * (this._rpm / 60)) : 0;
    this.rotation.y -= amount;

    var self = this;

    Object.keys(this._front).forEach(function(key) {
      if (!self._front[key]) {
        return;
      }

      self._front[key].position.set(self._position.x, self._position.y, self._position.z);
      self._front[key].rotation.set(self.rotation.x, self.rotation.y, self.rotation.z);
    });
  };

})(this, (this.qvv = (this.qvv || {})));
