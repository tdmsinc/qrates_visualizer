
//= require tdmsinc-three.js
//= require_self

(function(global, exports) {

  exports.world = exports.world || {};
  exports.world.Sleeve = Sleeve;

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
    this._opacity = 1.0;

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
      '7' : assets['assetsModelSleeveSpine-7'] || new THREE.Object3D(),
      '10': assets['assetsModelSleeveSpine-10'] || new THREE.Object3D(),
      '12': assets['assetsModelSleeveSpine-12'] || new THREE.Object3D()
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
          side: THREE.DoubleSide,
          specular: 0x363636,
          shading: THREE.SmoothShading,
          transparent: true,
          vertexColor: THREE.VertexColors
        });

        child.geometry.computeVertexNormals();
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

  Sleeve.prototype.setGlossFinished = function(value) {

  };

  Sleeve.prototype.setVisible = function(yn, opts, callback) {
    if (TWEEN) {
      var to = yn ? 1 : 0;
      var dur = opts ? opts.duration || 500 : 500;
      var count = 0;

      var self = this;

      var opacityTween = new TWEEN.Tween(self)
        .to({ _opacity: to }, dur)
        .easing(TWEEN.Easing.Quartic.Out)
        .onComplete(function() {
          if (1 === ++count && callback) callback();
        });

      var positionTween = new TWEEN.Tween(self.position);

      opacityTween.start();
    }
    // this._front.current.visible = this._back.current.visible = this._spine[this._size].visible = value;
  };

  Sleeve.prototype.update = function() {
    var self = this;

    Object.keys(self._front).forEach(function(key) {
      self._front[key].position.set(self.position.x, self.position.y, self.position.z);
      self._front[key].rotation.set(self.rotation.x, self.rotation.y, self.rotation.z);
      self._front[key].children[0].material.opacity = self._opacity;
    });

    Object.keys(self._back).forEach(function(key) {
      self._back[key].position.set(self.position.x, self.position.y, self.position.z);
      self._back[key].rotation.set(self.rotation.x, self.rotation.y, self.rotation.z);
      self._back[key].children[0].material.opacity = self._opacity;
    });

    Object.keys(self._spine).forEach(function(key) {
      self._spine[key].position.set(self.position.x, self.position.y, self.position.z);
      self._spine[key].rotation.set(self.rotation.x, self.rotation.y, self.rotation.z);
      // self._spine[key].children[0].material.opacity = self._opacity;
    });
  };

})(this, (this.qvv = (this.qvv || {})));
