
//= require tdmsinc-three.js
//= require_self

(function(global, exports) {

  exports.world = exports.world || {};
  exports.world.Vinyl = Vinyl;

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
      front: new THREE.Texture(),
      back: new THREE.Texture(),
      splatter: new THREE.Texture(),
      bumpMap: {
        '7' : new THREE.Texture(),
        '10': new THREE.Texture(),
        '12': new THREE.Texture()
      }
    };

    // this.updateTexture(this._textures.front, assets['assetsTextureVinylBumpmap-' + key]);
    // this.updateTexture(this._textures.bumpMap[key], assets['assetsTextureVinylBumpmap-' + key]);

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
          map: null,
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

  Vinyl.prototype.setTexture = function(sideA, sideB) {
    if (sideA) {
      this.updateTexture(this._textures.front, sideA);
    }

    if (sideB) {
      this.updateTexture(this._textures.back, sideB);
    }
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

})(this, (this.qvv = (this.qvv || {})));
