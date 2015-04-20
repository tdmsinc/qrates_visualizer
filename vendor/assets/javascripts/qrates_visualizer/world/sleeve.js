
//= require tdmsinc-three.js
//= require_self

(function(global, exports) {

  exports.world = exports.world || {};
  exports.world.Sleeve = Sleeve;

  //--------------------------------------------------------------
  function Sleeve() {
  }

  Sleeve.prototype.setup = function(scene, assets, opts, container) {
    opts = opts || {
      glossFinish: false,
      hole: false,
      size: 1,
      type: 1,
    };

    var sizes = ['7', '10', '12'];

    this.TYPE_BLACK       = 1;
    this.TYPE_WHITE       = 2;
    this.TYPE_PRINT       = 3;
    this.TYPE_PRINT_SPINE = 4;

    this._container = container;
    this._size = sizes[opts.size - 1];
    this._holed = opts.hole;
    this._type = opts.type;
    this._opacity = 0.0;
    this._coveredRatio = 0.0;
    this._glossFinish = opts.glossFinish;
    this._opacityTweenDuration = 300;

    this._front = {
      current   : null,
      '7'       : assets['assetsModelSleeveFront-7'],
      '10'      : assets['assetsModelSleeveFront-10'],
      '12'      : assets['assetsModelSleeveFront-12'],
      'holed-7' : assets['assetsModelSleeveFrontHoled-7'],
      'holed-10': assets['assetsModelSleeveFrontHoled-10'],
      'holed-12': assets['assetsModelSleeveFrontHoled-12'],
      'spine-7' : assets['assetsModelSleeveFrontSpine-7'],
      'spine-10': assets['assetsModelSleeveFrontSpine-10'],
      'spine-12': assets['assetsModelSleeveFrontSpine-12'],
      'spine-holed-7' : assets['assetsModelSleeveFrontSpineHoled-7'],
      'spine-holed-10': assets['assetsModelSleeveFrontSpineHoled-10'],
      'spine-holed-12': assets['assetsModelSleeveFrontSpineHoled-12']
    };

    this._back = {
      current   : null,
      '7'       : assets['assetsModelSleeveBack-7'],
      '10'      : assets['assetsModelSleeveBack-10'],
      '12'      : assets['assetsModelSleeveBack-12'],
      'holed-7' : assets['assetsModelSleeveBackHoled-7'],
      'holed-10': assets['assetsModelSleeveBackHoled-10'],
      'holed-12': assets['assetsModelSleeveBackHoled-12'],
      'spine-7' : assets['assetsModelSleeveBackSpine-7'],
      'spine-10': assets['assetsModelSleeveBackSpine-10'],
      'spine-12': assets['assetsModelSleeveBackSpine-12'],
      'spine-holed-7' : assets['assetsModelSleeveBackSpineHoled-7'],
      'spine-holed-10': assets['assetsModelSleeveBackSpineHoled-10'],
      'spine-holed-12': assets['assetsModelSleeveBackSpineHoled-12']
    };

    this._spine = {
      '7' : assets['assetsModelSleeveSpine-7']  || new THREE.Object3D(),
      '10': assets['assetsModelSleeveSpine-10'] || new THREE.Object3D(),
      '12': assets['assetsModelSleeveSpine-12'] || new THREE.Object3D()
    };

    this._top = {
      '7' : assets['assetsModelSleeveTopSpine-7'],
      '10': assets['assetsModelSleeveTopSpine-10'],
      '12': assets['assetsModelSleeveTopSpine-12']
    };

    this._bottom = {
      '7' : assets['assetsModelSleeveBottomSpine-7'],
      '10': assets['assetsModelSleeveBottomSpine-10'],
      '12': assets['assetsModelSleeveBottomSpine-12']
    };

    this._textures = {
      front: new THREE.Texture(),
      back : new THREE.Texture(),
      spine: new THREE.Texture(),
      default: new THREE.Texture()
    };

    var self = this;

    if (this.TYPE_PRINT === this._type || this.TYPE_PRINT_SPINE === this._type) {
      this.updateTexture(this._textures.front, opts.frontTexture);
      this.updateTexture(this._textures.back,  opts.backTexture);
      this.updateTexture(this._textures.spine, opts.spineTexture);
    } else {
      Object.keys(this._textures).forEach(function(key) {
        self.updateTexture(self._textures[key], assets['assetsTextureSleeveDefault']);
      });
    }

    this._front.current = this._holed ? this._front['holed-' + this._size] : this._front[this._size];
    this._back.current  = this._holed ? this._back['holed-' + this._size]  : this._back[this._size];

    Object.keys(this._front).forEach(function(key){
      self.initMaterial(self._front[key], self._textures.front);
      if (self._front[key]) self._front[key].name = key;
    });

    Object.keys(this._back).forEach(function(key) {
      self.initMaterial(self._back[key], self._textures.back);
      if (self._back[key]) self._back[key].name = key;
    });

    Object.keys(this._spine).forEach(function(key) {
      self.initMaterial(self._spine[key], self._textures.spine);
      if (self._spine[key]) self._spine[key].name = key;
    });

    Object.keys(this._top).forEach(function(key) {
      self.initMaterial(self._top[key], null);
      if (self._top[key]) self._top[key].name = key;
    });

    Object.keys(this._bottom).forEach(function(key) {
      self.initMaterial(self._bottom[key], null);
      if (self._bottom[key]) self._bottom[key].name = key;
    });


    this._object = {
      '7'       : new THREE.Object3D(),
      '10'      : new THREE.Object3D(),
      '12'      : new THREE.Object3D(),
      'holed-7' : new THREE.Object3D(),
      'holed-10': new THREE.Object3D(),
      'holed-12': new THREE.Object3D(),
      'spine-7' : new THREE.Object3D(),
      'spine-10': new THREE.Object3D(),
      'spine-12': new THREE.Object3D(),
      'spine-holed-7' : new THREE.Object3D(),
      'spine-holed-10': new THREE.Object3D(),
      'spine-holed-12': new THREE.Object3D()
    };

    this._object['7'].add(this._front['7']);
    this._object['7'].add(this._back['7']);

    this._object['10'].add(this._front['10']);
    this._object['10'].add(this._back['10']);

    this._object['12'].add(this._front['12']);
    this._object['12'].add(this._back['12']);

    this._object['holed-7'].add(this._front['holed-7']);
    this._object['holed-7'].add(this._back['holed-7']);

    this._object['holed-10'].add(this._front['holed-10']);
    this._object['holed-10'].add(this._back['holed-10']);

    this._object['holed-12'].add(this._front['holed-12']);
    this._object['holed-12'].add(this._back['holed-12']);

    this._object['spine-7'].add(this._front['spine-7']);
    this._object['spine-7'].add(this._back['spine-7']);
    this._object['spine-7'].add(this._top['7'].clone());
    this._object['spine-7'].add(this._bottom['7']);
    this._object['spine-7'].add(this._spine['7']);

    this._object['spine-10'].add(this._front['spine-10']);
    this._object['spine-10'].add(this._back['spine-10']);
    this._object['spine-10'].add(this._top['10']);
    this._object['spine-10'].add(this._bottom['10']);
    this._object['spine-10'].add(this._spine['10']);

    this._object['spine-12'].add(this._front['spine-12']);
    this._object['spine-12'].add(this._back['spine-12']);
    this._object['spine-12'].add(this._top['12']);
    this._object['spine-12'].add(this._bottom['12']);
    this._object['spine-12'].add(this._spine['12']);

    this._object['spine-holed-7'].add(this._front['spine-holed-7']);
    this._object['spine-holed-7'].add(this._back['spine-holed-7']);
    this._object['spine-holed-7'].add(this._top['7'].clone());
    this._object['spine-holed-7'].add(this._bottom['7'].clone());
    this._object['spine-holed-7'].add(this._spine['7'].clone());

    this._object['spine-holed-10'].add(this._front['spine-holed-10']);
    this._object['spine-holed-10'].add(this._back['spine-holed-10']);
    this._object['spine-holed-10'].add(this._top['10'].clone());
    this._object['spine-holed-10'].add(this._bottom['10'].clone());
    this._object['spine-holed-10'].add(this._spine['10'].clone());

    this._object['spine-holed-12'].add(this._front['spine-holed-12']);
    this._object['spine-holed-12'].add(this._back['spine-holed-12']);
    this._object['spine-holed-12'].add(this._top['12'].clone());
    this._object['spine-holed-12'].add(this._bottom['10'].clone());
    this._object['spine-holed-12'].add(this._spine['12'].clone());


    if (this._holed) {
      if (this._type === this.TYPE_PRINT_SPINE) {
        this._currentObject = this._object['spine-holed-' + this._size];
      } else {
        this._currentObject = this._object['holed-' + this._size];
      }
    } else {
      this._currentObject = this._object[this._size];
    }

    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this._positionTween = new TWEEN.Tween(this.position);
    this._opacityTween = new TWEEN.Tween(this);

    this.setType(opts.type);

    this._currentObject.name = 'sleeve';

    this._container.add(this._currentObject);

    this._opacity = 0;
    this.setOpacity(1);
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
          opacity: 0,
          shininess: self._glossFinish ? 15 : 5,
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
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
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

    var lastType = this._type;
    this._type = type;

    var isOpaque = false;

    if (this.TYPE_BLACK === this._type || this.TYPE_WHITE === this._type) {
      this._glossFinish = false;
      isOpaque = true;
    }

    var self = this;

    Object.keys(this._front).forEach(function(key) {
      var tex = isOpaque ? self._textures.default : self._textures.front;
      self.initMaterial(self._front[key], tex);
    });

    Object.keys(this._back).forEach(function(key) {
      var tex = isOpaque ? self._textures.default : self._textures.back;
      self.initMaterial(self._back[key], tex);
    });

    Object.keys(this._spine).forEach(function(key) {
      var tex = isOpaque ? self._textures.default : self._textures.spine;
      self.initMaterial(self._spine[key], tex);
    });

    Object.keys(this._top).forEach(function(key) {
      self.initMaterial(self._top[key], null);
    });

    Object.keys(this._bottom).forEach(function(key) {
      self.initMaterial(self._bottom[key], null);
    });

    this._container.remove(this._currentObject);

    if (lastType !== this.TYPE_PRINT_SPINE && this._type === this.TYPE_PRINT_SPINE) {
      if (this._holed) {
        this._currentObject = this._object['spine-holed-' + this._size];
      } else {
        this._currentObject = this._object['spine-' + this._size];
      }

    } else if (lastType === this.TYPE_PRINT_SPINE && this._type !== this.TYPE_PRINT_SPINE) {
      if (this._holed) {
        this._currentObject = this._object['holed-' + this._size];
      } else {
        this._currentObject = this._object[this._size];
      }
    }

    this._container.add(this._currentObject);

    this._opacity = 0;
    this.setOpacity(1.0);
  };

  Sleeve.prototype.setSize = function(size) {
    if (!size) {
      console.error('[Sleeve::setSize] no size specified');
      return;
    }

    this._container.remove(this._currentObject);

    this._size = size;

    if (this._type === this.TYPE_PRINT_SPINE) {
      if (this._holed) {
        this._currentObject = this._object['spine-holed-' + this._size];
      } else {
        this._currentObject = this._object['spine-' + this._size];
      }
    } else {
      if (this._holed) {
        this._currentObject = this._object['holed-' + this._size];
      } else {
        this._currentObject = this._object[this._size];
      }
    }

    this._currentObject.name = 'sleeve';

    var self = this;

    this.setCoveredRatio(this._coveredRatio, { duration: 1 }, null, function() {
      self._container.add(self._currentObject);

      self._opacity = 0;
      self.setOpacity(1.0);
    });
  };

  Sleeve.prototype.setOpacity = function(to, duration) {
    var self = this;

    duration = undefined !== duration ? duration : 300;

    this._opacityTween
      .stop()
      .to({ _opacity: to }, duration)
      .onUpdate(function() {
        self._currentObject.traverse(function(child) {
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

  Sleeve.prototype.setHole = function(value) {
    this._holed = value;
    this.setSize(this._size);
  };

  Sleeve.prototype.setGlossFinish = function(yn) {
    if (this.TYPE_BLACK === this._type || this.TYPE_WHITE === this._type) {
      return;
    }

    this._glossFinish = '0' === yn ? false : true;

    var self = this;
    var shininess = self._glossFinish ? 15 : 5;

    Object.keys(self._front).forEach(function(key){
      self._front[key].traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.shininess = shininess;
        }
      });
    });

    Object.keys(self._back).forEach(function(key) {
      self._back[key].traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.shininess = shininess;
        }
      });
    });

    Object.keys(self._spine).forEach(function(key) {
      self._back[key].traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.shininess = shininess;
        }
      });
    });

    Object.keys(self._top).forEach(function(key) {
      self._back[key].traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.shininess = shininess;
        }
      });
    });

    Object.keys(self._bottom).forEach(function(key) {
      self._back[key].traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.shininess = shininess;
        }
      });
    });
  };

  Sleeve.prototype.setCoveredRatio = function(ratio, opts, updateCallback, completeCallback) {
    opts.duration = undefined !== opts.duration ? opts.duration : 500;
    opts.delay    = undefined !== opts.delay    ? opts.delay    : 0;

    var tempObj = this._currentObject.clone();
    tempObj.scale = 1.0;

    var offset = new THREE.Box3().setFromObject(tempObj).size().x;

    this._coveredRatio = Math.max(0, Math.min(1.0, ratio));

    this._positionTween
      .stop()
      .delay(opts.delay)
      .to({ x: this._coveredRatio * -offset }, opts.duration)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function() {
        if (updateCallback) updateCallback();
      })
      .onComplete(function() {
        if (completeCallback) completeCallback();
      })
      .onStop(function() {
        if (completeCallback) completeCallback();
      })
      .start();

    tempObj = null;
  };

  Sleeve.prototype.setVisibility = function(yn, opts, callback) {
    this._currentObject.visible = yn;
  };

  Sleeve.prototype.update = function() {
    var self = this;

    this._currentObject.position.set(this.position.x, this.position.y, this.position.z);
    this._currentObject.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

    // Object.keys(self._front).forEach(function(key) {
    //   self._front[key].position.set(self.position.x, self.position.y, self.position.z);
    //   self._front[key].rotation.set(self.rotation.x, self.rotation.y, self.rotation.z);
    //   self._front[key].children[0].material.opacity = self._opacity;
    // });

    // Object.keys(self._back).forEach(function(key) {
    //   self._back[key].position.set(self.position.x, self.position.y, self.position.z);
    //   self._back[key].rotation.set(self.rotation.x, self.rotation.y, self.rotation.z);
    //   self._back[key].children[0].material.opacity = self._opacity;
    // });

    // Object.keys(self._spine).forEach(function(key) {
    //   self._spine[key].position.set(self.position.x, self.position.y, self.position.z);
    //   self._spine[key].rotation.set(self.rotation.x, self.rotation.y, self.rotation.z);
    //   // self._spine[key].children[0].material.opacity = self._opacity;
    // });
  };

})(this, (this.qvv = (this.qvv || {})));
