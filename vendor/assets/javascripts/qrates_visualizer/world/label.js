
//= require tdmsinc-three.js
//= require_self

(function(global, exports) {

  exports.world = exports.world || {};
  exports.world.Label = Label;

  //--------------------------------------------------------------
  function Label() {

  }

  Label.prototype.setup = function(scene, assets, opts, container) {
    this._opts = opts || {
      holeSize: 0,
      type: 1,
      size: 1,
      speed: 45
    };
    opts.type = 3;
    var sizes = ['7', '10', '12'];

    this.TYPE_WHITE            = 1;
    this.TYPE_PRINT_MONOCHROME = 2;
    this.TYPE_PRINT_COLOR      = 3;

    this._container = container;
    this._size = sizes[opts.size - 1];
    this._largeHole = opts.holeSize;
    this._type = opts.type;
    this._rpm = opts.speed;
    this._opacity = 0;
    this._enableRotate = false;
    this._clock = new THREE.Clock();

    this._smallHoleFront = assets['assetsModelLabelFrontSmall-7'];
    this._smallHoleBack = assets['assetsModelLabelBackSmall-7'];
    this._largeHoleFront = assets['assetsModelLabelFrontLarge-7'];
    this._largeHoleBack = assets['assetsModelLabelBackLarge-7'];

    this._front = {
      '7' : this._largeHole ? this._largeHoleFront : this._smallHoleFront,
      '10': assets['assetsModelLabelFront-10'],
      '12': assets['assetsModelLabelFront-12'],
      current: null
    };

    this._back = {
      '7' : this._largeHole ? this._largeHoleBack : this._smallHoleBack,
      '10': assets['assetsModelLabelBack-10'],
      '12': assets['assetsModelLabelBack-12'],
      current: null
    };

    this._textures = {
      default: new THREE.Texture(),
      front: new THREE.Texture(),
      back : new THREE.Texture()
    };

    this._front.current = this._front[this._size];
    this._back.current = this._back[this._size];

    // this._currentObject = new THREE.Object3D();
    // this._currentObject.add(this._front[this._size]);
    // this._currentObject.add(this._back[this._size]);

    this._defaultTexture = assets['assetsTextureLabelDefault'];

    this.updateTexture(this._textures.default, assets['assetsTextureLabelDefault']);
    this.updateTexture(this._textures.front, this.TYPE_WHITE === this._type ? assets['assetsTextureLabelDefault'] : opts.sideATexture || assets['assetsTextureLabelDefault']);
    this.updateTexture(this._textures.back,  this.TYPE_WHITE === this._type ? assets['assetsTextureLabelDefault'] : opts.sideBTexture || assets['assetsTextureLabelDefault']);

    this.initMaterial(this._front.current, this._textures.front);
    this.initMaterial(this._back.current, this._textures.back);

    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this._opacityTween = new TWEEN.Tween(this);

    this.setOpacity(0, 1);

    this._container.add(this._front.current);
    this._container.add(this._back.current);

    this.setOpacity(1.0);


    var self = this;
    Object.keys(this._back).forEach(function(key) {
      self._back[key].rotation.z = self.rotation.z + Math.PI;
    });
  };

  Label.prototype.initMaterial = function(obj, tex) {
    if (!obj) {
      return;
    }

    obj.name = 'label';

    var self = this;

    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          ambient: 0xFFFFFF,
          color: 0xFFFFFF,
          map: tex,
          opacity: self._opacity,
          shininess: 5,
          side: THREE.DoubleSide,
          specular: 0x363636,
          shading: THREE.SmoothShading,
          vertexColor: THREE.VertexColors
        });

        child.geometry.computeVertexNormals();
      }
    });

    return obj;
  };

  Label.prototype.updateTexture = function(tex, img) {
    if (!tex || !img) {
      return;
    }

    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearMipMapLinearFilter;
    tex.image = img;
    tex.needsUpdate = true;
  };

  Label.prototype.setSize = function(size) {
    if (!size) {
      console.error('[Label::setSize] no size specified');
      return;
    }

    this._container.remove(this._front.current);
    this._container.remove(this._back.current);

    this._size = size;

    this._front.current = this._front[this._size];
    this._back.current = this._back[this._size];

    this.initMaterial(this._front.current, this._textures.front);
    this.initMaterial(this._back.current, this._textures.back);

    this._container.add(this._front.current);
    this._container.add(this._back.current);

    this._opacity = 0;
    this.setOpacity(1.0);
  };

  Label.prototype.setLargeHole = function(yn) {
    if ('7' !== this._size) {
      return;
    }

    this._container.remove(this._front.current);
    this._container.remove(this._back.current);

    this._largeHole = yn;

    this._front['7'] = this._largeHole ? this._largeHoleFront : this._smallHoleFront;
    this._back['7'] = this._largeHole ? this._largeHoleBack : this._smallHoleBack;
    this._front.current = this._front['7'];
    this._back.current = this._back['7'];

    this.initMaterial(this._front.current, this._textures.front);
    this.initMaterial(this._back.current, this._textures.back);

    this._container.add(this._front.current);
    this._container.add(this._back.current);

    this._opacity = 0;
    this.setOpacity(1.0);
  };

  Label.prototype.setTexture = function(sideA, sideB) {
    if (this.TYPE_WHITE === this._type) {
      return;
    }

    var self = this;

    if (sideA) {
      this.updateTexture(this._textures.front, sideA);

      Object.keys(this._front).forEach(function(key) {
        var tex = self.TYPE_WHITE === self._type ? self._textures.default : self._textures.front;
        self.initMaterial(self._front[key], tex);
      });
    }

    if (sideB) {
      this.updateTexture(this._textures.back, sideB);

      Object.keys(this._back).forEach(function(key) {
        var tex = self.TYPE_WHITE === self._type ? self._textures.default : self._textures.back;
        self.initMaterial(self._back[key], tex);
      });
    }
  };

  Label.prototype.clearTexture = function(side) {
    switch(side){
      case 'sideA':
        this.setTexture(this._defaultTexture, null);
        break;
      case 'sideB':
        this.setTexture(null, this._defaultTexture);
        break;
    }
  };

  Label.prototype.setType = function(type) {
    if (-1 === [this.TYPE_WHITE, this.TYPE_PRINT_MONOCHROME, this.TYPE_PRINT_COLOR].indexOf(type)) {
      return;
    }

    this._type = type;

    var self = this;

    Object.keys(this._front).forEach(function(key) {
      var tex = self.TYPE_WHITE === type ? self._textures.default : self._textures.front;
      self.initMaterial(self._front[key], tex);
    });

    Object.keys(this._back).forEach(function(key) {
      var tex = self.TYPE_WHITE === type ? self._textures.default : self._textures.back;
      self.initMaterial(self._back[key], tex);
    });

    this._opacity = 0;
    this.setOpacity(1.0);
  };

  Label.prototype.setOpacity = function(to, duration) {
    var self = this;

    duration = undefined !== duration ? duration : 300;

    this._opacityTween
      .stop()
      .to({ _opacity: to }, duration)
      .onUpdate(function() {
        self._front.current.traverse(function(child) {
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

        self._back.current.traverse(function(child) {
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

  Label.prototype.setEnableRotate = function(yn) {
    this._enableRotate = yn;
  };

  Label.prototype.setRPM = function(rpm) {
    this._rpm = rpm;
  };

  Label.prototype.setVisibility = function(value) {
    this._front[this._size].visible = this._back[this._size].visible = value;
  };

  Label.prototype.update = function() {
    if (!(this._front && this._back)) {
      return;
    }

    var amount = this._enableRotate ? this._clock.getDelta() * (Math.PI * (this._rpm / 60)) : 0;

    this.rotation.y -= amount;

    this._front.current.position.set(this.position.x, this.position.y, this.position.z);
    this._back.current.position.set(this.position.x, this.position.y, this.position.z);

    this._front.current.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    this._back.current.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z + Math.PI);
  };

})(this, (this.qvv = (this.qvv || {})));
