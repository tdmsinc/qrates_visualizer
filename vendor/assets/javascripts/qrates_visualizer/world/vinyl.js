
//= require tdmsinc-three.js
//= require_self

(function(global, exports) {

  exports.world = exports.world || {};
  exports.world.Vinyl = Vinyl;

  //--------------------------------------------------------------
  function Vinyl() {
  }

  Vinyl.prototype.setup = function(scene, assets, opts) {
    opts = opts || {
      type: 1,
      size: 1,
      color: 0,
      splatterColor: 0,
      holeSize: 0,
      heavy: false,
      speed: 45,
    };

    this._colorPresets = [
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

    var sizes = ['7', '10', '12'];

    // color modes a.k.a. vinyl types
    this.TYPE_BLACK    = 1;
    this.TYPE_COLOR    = 2;
    this.TYPE_SPLATTER = 3;

    this._scene = scene;
    this._size = sizes[opts.size - 1];
    this._type = opts.type;
    this._defaultColor = 0x000000;
    this._color = this._colorPresets[opts.color].color;
    this._opacity = 1.0;
    this._rpm = opts.speed;
    this._heavy = opts.heavy;
    this._enableRotate = false;
    this.rotationAmount = 0;
    this._clock = new THREE.Clock();

    this._front = {
      '7' : assets['assetsModelVinyl-7'],
      '10': assets['assetsModelVinyl-10'],
      '12': assets['assetsModelVinyl-12'],
    };

    this._back = {
      '7' : assets['assetsModelVinyl-7'],
      '10': assets['assetsModelVinyl-10'],
      '12': assets['assetsModelVinyl-12'],
    };

    this._textures = {
      front: opts.sideATexture || new THREE.Texture(),
      back: opts.sideBTexture || new THREE.Texture(),
      splatter: opts.front_splatter || new THREE.Texture(),
      bumpMap: {
        '7' : new THREE.Texture(),
        '10': new THREE.Texture(),
        '12': new THREE.Texture()
      }
    };

    this._bumpMaps = {
      front: {
        '7': new THREE.Texture(),
        '10': new THREE.Texture(),
        '12': new THREE.Texture()
      },
      back: {
        '7': new THREE.Texture(),
        '10': new THREE.Texture(),
        '12': new THREE.Texture()
      }
    };

    var self = this;

    Object.keys(self._textures.bumpMap).forEach(function(key) {
      self.updateTexture(self._textures.bumpMap[key], assets['assetsTextureVinylBumpmap-' + key]);
    });

    Object.keys(self._front).forEach(function(key) {
      self.initMaterial(self._front[key], self._textures.front, self._textures.bumpMap[key]);
    });

    Object.keys(self._back).forEach(function(key) {
      self.initMaterial(self._back[key], self._textures.back, self._textures.bumpMap[key]);
    });

    this._position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this._scene.add(this._front[this._size]);
  };

  Vinyl.prototype.initMaterial = function(obj, tex, bumpMapTex) {
    if (!obj) {
      return false;
    }

    var self = this;

    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          ambient: 0xffffff,
          bumpMap: bumpMapTex,
          bumpScale: 0.36,
          color: self._color,
          map: self.TYPE_SPLATTER === self._type ? tex : null,
          opacity: self._opacity,
          shininess: 35,
          side: THREE.DoubleSide,
          specular: 0x363636,
          shading: THREE.SmoothShading,
          vertexColor: THREE.VertexColors
        });

        // child.geometry.computeVertexNormals();
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

  Vinyl.prototype.setTexture = function(sideA, sideB) {
    if (this.TYPE_SPLATTER !== this._type) {
      return false;
    }

    var self = this;

    if (sideA) {
      this.updateTexture(this._textures.front, sideA);

      Object.keys(self._front).forEach(function(key) {
        var tex = self.TYPE_SPLATTER === self._type ? self._textures.front : null;
        self.initMaterial(self._front[key], tex, self._textures.bumpMap[key]);
      });
    }

    if (sideB) {
      this.updateTexture(this._textures.back, sideB);

      Object.keys(self._back).forEach(function(key) {
        var tex = self.TYPE_SPLATTER === self._type ? self._textures.back : null;
        self.initMaterial(self._back[key], tex, self._textures.bumpMap[key]);
      });
    }
  };

  Vinyl.prototype.setBumpMapTexture = function(texture) {
    var self = this;

    Object.keys(self._textures.bumpMap).forEach(function(key) {
      self.updateTexture(self._textures.bumpMap[key], texture);
    });
  };

  Vinyl.prototype.setSideABumpMapTexture = function(texture) {
    this.setBumpMapTexture(texture);
  };

  Vinyl.prototype.setSideBBumpMapTexture = function(texture) {
    // TODO: A / B 面を分ける
    this.setBumpMapTexture(texture);
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

  Vinyl.prototype.setSize = function(size) {
    if (!size) {
      console.error('[Vinyl::setSize] no size specified');
      return;
    }

    this._scene.remove(this._front[this._size]);

    this._size = size;
    this._scene.add(this._front[this._size]);
  };

  Vinyl.prototype.setColorMode = function(mode) {
    if (!mode) {
      return;
    }

    this._type = mode;
    this._color = this.TYPE_SPLATTER === mode ? 0xFFFFFF : this._defaultColor;

    var self = this;

    Object.keys(self._front).forEach(function(key) {
      var tex = self.TYPE_SPLATTER === self._type ? self._textures.front : null;
      self.initMaterial(self._front[key], tex, self._textures.bumpMap[key]);
    });

    Object.keys(self._back).forEach(function(key) {
      var tex = self.TYPE_SPLATTER === self._type ? self._textures.back : null;
      self.initMaterial(self._back[key], tex, self._textures.bumpMap[key]);
    });
  };

  Vinyl.prototype.setColor = function(index) {
    this._color = this.TYPE_SPLATTER === this._type ? 0xFFFFFF : this._colorPresets[index].color;
    this._opacity = this.TYPE_SPLATTER === this._type ? 0.8 : 1.0;

    var self = this;

    Object.keys(self._front).forEach(function(key) {
      var tex = self.TYPE_SPLATTER === self._type ? self._textures.front : null;
      self.initMaterial(self._front[key], tex, self._textures.bumpMap[key]);
    });

    Object.keys(self._back).forEach(function(key) {
      var tex = self.TYPE_SPLATTER === self._type ? self._textures.back : null;
      self.initMaterial(self._front[key], tex, self._textures.bumpMap[key]);
    });
  };

  Vinyl.prototype.setEnableRotate = function(yn) {
    this._enableRotate = yn;
  };

  Vinyl.prototype.setRPM = function(rpm) {
    this._rpm = rpm;
  };

  Vinyl.prototype.setVisible = function(value) {
    this._front[this._size].visible = value;
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
