
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
      type: 1
    };

    var sizes = ['7', '10', '12'];

    // スリーブのタイプ
    this.TYPE_BLACK       = 1;
    this.TYPE_WHITE       = 2;
    this.TYPE_PRINT       = 3;
    this.TYPE_PRINT_SPINE = 4;
    this.TYPE_GATEFOLD    = 5;

    this._container = container;
    this._size = sizes[opts.size - 1];
    this._holed = opts.hole;
    this._type = opts.type;
    this._opacity = 0.0;
    this._coveredRatio = 0.0;
    this._glossFinish = opts.glossFinish;
    this._opacityTweenDuration = 300;

    this._models = {
      '7': {
        'no-spine': {
          'default': assets['assetsModelSleeveSingleNoSpine-7'],
          'holed': assets['assetsModelSleeveSingleNoSpineHoled-7']
        },
        'single': {
          'default': assets['assetsModelSleeveSingleNoSpine-7'],
          'holed': assets['assetsModelSleeveSingleNoSpineHoled-7']
        },
        'double': {
          'default': assets['assetsModelSleeveSingleNoSpine-7'],
          'holed': assets['assetsModelSleeveSingleNoSpineHoled-7']
        },
        'gatefold': {
          'default': assets['assetsModelSleeveGatefold-7']
        }
      },

      '10': {
        'no-spine': {
          'default': assets['assetsModelSleeveSingleNoSpine-10'],
          'holed': assets['assetsModelSleeveSingleNoSpineHoled-10']
        },
        'single': {
          'default': assets['assetsModelSleeveSingleNoSpine-10'],
          'holed': assets['assetsModelSleeveSingleNoSpineHoled-10']
        },
        'double': {
          'default': assets['assetsModelSleeveSingleNoSpine-10'],
          'holed': assets['assetsModelSleeveSingleNoSpineHoled-10']
        },
        'gatefold': {
          'default': assets['assetsModelSleeveGatefold-10']
        }
      },

      '12': {
        'no-spine': {
          'default': assets['assetsModelSleeveSingleNoSpine-12'],
          'holed': assets['assetsModelSleeveSingleNoSpineHoled-12']
        },
        'single': {
          'default': assets['assetsModelSleeveSingleNoSpine-12'],
          'holed': assets['assetsModelSleeveSingleNoSpineHoled-12']
        },
        'double': {
          'default': assets['assetsModelSleeveSingleNoSpine-12'],
          'holed': assets['assetsModelSleeveSingleNoSpineHoled-12']
        },
        'gatefold': {
          'default': assets['assetsModelSleeveGatefold-12']
        }
      }
    };

    this._textures = {
      '7': {
        'no-spine': {
          'default': null,
          'holed': {
            'ao': assets['assetsTextureSleeveHoledNoSpineAo-7'],
            'bumpmap': assets['assetsTextureSleeveHoledNoSpineBumpmap-7'],
            'color': assets['assetsTextureSleeveHoledNoSpineColor-7'],
            'color-ao': assets['assetsTextureSleeveHoledNoSpineColorAndAo-7']
          }
        },
        'single': {
          'default': null,
          'holed': {
            'ao': assets['assetsTextureSleeveSingleHoledAo-7'],
            'bumpmap': assets['assetsTextureSleeveSingleHoledBumpmap-7'],
            'color': assets['assetsTextureSleeveSingleHoledColor-7'],
            'color-ao': assets['assetsTextureSleeveSingleHoledColorAndAo-7']
          }
        },
        'double': {
          'default': null,
          'holed': {
            'ao': assets['assetsTextureSleeveDoubleHoledAo-7'],
            'bumpmap': assets['assetsTextureSleeveDoubleHoledBumpmap-7'],
            'color': assets['assetsTextureSleeveDoubleHoledColor-7'],
            'color-ao': assets['assetsTextureSleeveDoubleHoledColorAndAo-7']
          }
        },
        'gatefold': {
          'default': {
            'front': {
              'ao': assets[''],
              'bumpmap': assets[''],
              'color': assets['']
            },
            'back': {
              'ao': assets['assetsTextureSleeveGatefoldBackAo-7'],
              'bumpmap': assets['assetsTextureSleeveGatefoldBackBumpmap-7'],
              'color': assets['assetsTextureSleeveGatefoldBackColorAndAo-7']
            },
            'spine': {
              'ao': assets['assetsTextureSleeveGatefoldSpineAo-7'],
              'bumpmap': assets['assetsTextureSleeveGatefoldSpineBumpmap-7'],
              'color': assets['assetsTextureSleeveGatefoldSpineColor-7']
            }
          },
          'holed': null
        }
      },

      '10': {
        'no-spine': {
          'default': null,
          'holed': {
            'ao': assets['assetsTextureSleeveHoledNoSpineAo-10'],
            'bumpmap': assets['assetsTextureSleeveHoledNoSpineBumpmap-10'],
            'color': assets['assetsTextureSleeveHoledNoSpineColor-10'],
            'color-ao': assets['assetsTextureSleeveHoledNoSpineColorAndAo-10']
          }
        },
        'single': {
          'default': null,
          'holed': {
            'ao': assets['assetsTextureSleeveSingleHoledAo-10'],
            'bumpmap': assets['assetsTextureSleeveSingleHoledBumpmap-10'],
            'color': assets['assetsTextureSleeveSingleHoledColor-10'],
            'color-ao': assets['assetsTextureSleeveSingleHoledColorAndAo-10']
          }
        },
        'double': {
          'default': null,
          'holed': {
            'ao': assets['assetsTextureSleeveDoubleHoledAo-10'],
            'bumpmap': assets['assetsTextureSleeveDoubleHoledBumpmap-10'],
            'color': assets['assetsTextureSleeveDoubleHoledColor-10'],
            'color-ao': assets['assetsTextureSleeveDoubleHoledColorAndAo-10']
          }
        },
        'gatefold': {
          'default': {
            'front': {
              'ao': assets[''],
              'bumpmap': assets[''],
              'color': assets['']
            },
            'back': {
              'ao': assets['assetsTextureSleeveGatefoldBackAo-1102'],
              'bumpmap': assets['assetsTextureSleeveGatefoldBackBumpmap-10'],
              'color': assets['assetsTextureSleeveGatefoldBackColorAndAo-10']
            },
            'spine': {
              'ao': assets['assetsTextureSleeveGatefoldSpineAo-10'],
              'bumpmap': assets['assetsTextureSleeveGatefoldSpineBumpmap-10'],
              'color': assets['assetsTextureSleeveGatefoldSpineColor-10']
            }
          },
          'holed': null
        }
      },

      '12': {
        'no-spine': {
          'default': null,
          'holed': {
            'ao': assets['assetsTextureSleeveHoledNoSpineAo-12'],
            'bumpmap': assets['assetsTextureSleeveHoledNoSpineBumpmap-12'],
            'color': assets['assetsTextureSleeveHoledNoSpineColor-12'],
            'color-ao': assets['assetsTextureSleeveHoledNoSpineColorAndAo-12']
          }
        },
        'single': {
          'default': null,
          'holed': {
            'ao': assets['assetsTextureSleeveSingleHoledAo-12'],
            'bumpmap': assets['assetsTextureSleeveSingleHoledBumpmap-12'],
            'color': assets['assetsTextureSleeveSingleHoledColor-12'],
            'color-ao': assets['assetsTextureSleeveSingleHoledColorAndAo-12']
          }
        },
        'double': {
          'default': null,
          'holed': {
            'ao': assets['assetsTextureSleeveDoubleHoledAo-12'],
            'bumpmap': assets['assetsTextureSleeveDoubleHoledBumpmap-12'],
            'color': assets['assetsTextureSleeveDoubleHoledColor-12'],
            'color-ao': assets['assetsTextureSleeveDoubleHoledColorAndAo-12']
          }
        },
        'gatefold': {
          'default': {
            'front': {
              'ao': assets[''],
              'bumpmap': assets[''],
              'color': assets['']
            },
            'back': {
              'ao': assets['assetsTextureSleeveGatefoldBackAo-12'],
              'bumpmap': assets['assetsTextureSleeveGatefoldBackBumpmap-12'],
              'color': assets['assetsTextureSleeveGatefoldBackColorAndAo-12']
            },
            'spine': {
              'ao': assets['assetsTextureSleeveGatefoldSpineAo-12'],
              'bumpmap': assets['assetsTextureSleeveGatefoldSpineBumpmap-12'],
              'color': assets['assetsTextureSleeveGatefoldSpineColor-12']
            }
          },
          'holed': null
        }
      }
    };

    this._defaultTexture = assets['assetsTextureSleeveDefault'];

    var self = this;

    if (this.TYPE_PRINT === this._type || this.TYPE_PRINT_SPINE === this._type) {
      this.updateTexture(this._textures.front, opts.frontTexture || assets['assetsTextureSleeveDefault']);
      this.updateTexture(this._textures.back,  opts.backTexture  || assets['assetsTextureSleeveDefault']);
      this.updateTexture(this._textures.spine, opts.spineTexture || assets['assetsTextureSleeveDefault']);
    } else {
      Object.keys(this._textures).forEach(function(key) {
        self.updateTexture(self._textures[key], assets['assetsTextureSleeveDefault']);
      });
    }

    this.updateTexture(this._textures.bumpMap['gatefold-12'], assets['assetsTextureSleeveBumpmapGatefold-12']);

    Object.keys(this._front).forEach(function(key) {
      console.log('key', key, 'object', self._front[key]);

      if (!self._front[key]) {
        return;
      }

      self.initMaterial(self._front[key].scene, self._textures.front);
      if (self._front[key].scene) self._front[key].name = key;
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
      'gatefold-12': null
    };

    // collada models
    this._object['gatefold-12'] = this._front['gatefold-12'];

    // hole オプションが有効な場合
    if (this._holed) {
      if (this._type === this.TYPE_PRINT_SPINE) {
        // this._currentObject = this._object['spine-holed-' + this._size];
      } else {
        // this._currentObject = this._object['holed-' + this._size];
      }
    } else {
      this._currentObject = this._object['gatefold-12'];
    }

    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this._positionTween = new TWEEN.Tween(this.position);
    this._opacityTween = new TWEEN.Tween(this);

    this.setType(opts.type);

    this._currentObject.name = 'sleeve';

    this._container.add(this._currentObject.scene);

    this._opacity = 0;
    this.setOpacity(1);
  };

  Sleeve.prototype.initMaterial = function(obj, tex, bumpMapTex) {
    if (!obj) {
      return;
    }

    var self = this;

    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          map: tex,
          ambient: 0xFFFFFF,
          color: self.TYPE_BLACK === self._type ? 0 : 0xffffff,
          opacity: 0,
          shininess: self._glossFinish ? 15 : 5,
          side: THREE.DoubleSide,
          specular: 0x363636,
          shading: THREE.SmoothShading,
          transparent: true,
          vertexColor: THREE.VertexColors
        });

        if (bumpMapTex) {
          child.material.bumpMap = bumpMapTex;
        }

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

  Sleeve.prototype.clearTexture = function(side) {
    switch(side){
      case 'sideA':
        this.updateTexture(this._textures.front, this._defaultTexture);
        break;
      case 'sideB':
        this.updateTexture(this._textures.back, this._defaultTexture);
        break;
    }
  };

  Sleeve.prototype.setType = function(type) {

    var idx = [
      this.TYPE_BLACK, 
      this.TYPE_WHITE, 
      this.TYPE_PRINT, 
      this.TYPE_PRINT_SPINE,
      this.TYPE_GATEFOLD
    ].indexOf(type);

    if (-1 === idx) {

      return;

    }

    if (this._type === type) {

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
      self.initMaterial(self._front[key].scene, tex);
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

    if (this._type === this.TYPE_PRINT_SPINE) {

      if (this._holed) {

        this._currentObject = this._object['spine-holed-' + this._size];

      } else {

        this._currentObject = this._object['spine-' + this._size];

      }

    } else if (this._type === this.TYPE_BLACK || this._type === this.TYPE_WHITE || this._type === this.TYPE_PRINT) {

      if (this._holed) {

        this._currentObject = this._object['holed-' + this._size];

      } else {

        this._currentObject = this._object[this._size];

      }

    } else if (this._type === this.TYPE_GATEFOLD) {

      var scale = 5.5;
      this._object['gatefold-12'].scene.scale.set(scale, scale, scale);

      if (this._holed) {

        this._currentObject = this._object['gatefold-12'].scene;

      } else {

        this._currentObject = this._object['gatefold-12'].scene;

      }

    }

    this._container.add(this._currentObject);

    this.setOpacity(1.0, 0);

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

      self.setOpacity(1.0, 0);
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
      self._front[key].scene.traverse(function(child) {
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
