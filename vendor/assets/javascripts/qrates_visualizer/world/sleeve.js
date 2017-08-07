
//= require tdmsinc-three.js
//= require_self

(function(global, exports) {

  exports.world = exports.world || {};
  exports.world.Sleeve = Sleeve;

  //--------------------------------------------------------------
  function Sleeve() {
  }

  Sleeve.prototype.setup = function(scene, assets, opts, container) {

    // サイズ
    this.SIZE_7 = '7';
    this.SIZE_10 = '10';
    this.SIZE_12 = '12';

    // スリーブのタイプ
    this.SleeveFormat = {
      SINGLE_NO_SPINE: 'no-spine',
      SINGLE: 'single',
      DOUBLE: 'double',
      GATEFOLD: 'gatefold'
    };
    
    // ホールオプション用の定数
    this.NO_HOLED = 'normal';
    this.HOLED = 'holed';

    opts = opts || {
      glossFinish: false,
      hole: this.NO_HOLED,
      size: this.SIZE_7,
      format: this.SleeveFormat.SINGLE_NO_SPINE,
      textures: {

      }
    };

    console.log('opts', opts);

    this._container = container;
    this._size = opts.size;
    this._holed = opts.hole;
    this._format = opts.format;
    this._currentTextures = opts.textures;
    this._opacity = 0.0;
    this._coveredRatio = 0.0;
    this._bumpScale = 0.3;
    this._glossFinish = opts.glossFinish;
    this._opacityTweenDuration = 300;

    this._models = {
      '7': {
        'no-spine': {
          'normal': assets['assetsModelSleeveSingleNoSpine-7'],
          'holed': assets['assetsModelSleeveSingleNoSpineHoled-7']
        },
        'single': {
          'normal': assets['assetsModelSleeveSingle-7'],
          'holed': assets['assetsModelSleeveSingleHoled-7']
        },
        'double': {
          'normal': assets['assetsModelSleeveDouble-7'],
          'holed': assets['assetsModelSleeveDoubleHoled-7']
        },
        'gatefold': {
          'normal': assets['assetsModelSleeveGatefold-7']
        }
      },

      '10': {
        'no-spine': {
          'normal': assets['assetsModelSleeveSingleNoSpine-10'],
          'holed': assets['assetsModelSleeveSingleNoSpineHoled-10']
        },
        'single': {
          'normal': assets['assetsModelSleeveSingle-10'],
          'holed': assets['assetsModelSleeveSingleHoled-10']
        },
        'double': {
          'normal': assets['assetsModelSleeveDouble-10'],
          'holed': assets['assetsModelSleeveDoubleHoled-10']
        },
        'gatefold': {
          'normal': assets['assetsModelSleeveGatefold-10']
        }
      },

      '12': {
        'no-spine': {
          'normal': assets['assetsModelSleeveSingleNoSpine-12'],
          'holed': assets['assetsModelSleeveSingleNoSpineHoled-12']
        },
        'single': {
          'normal': assets['assetsModelSleeveSingle-12'],
          'holed': assets['assetsModelSleeveSingleHoled-12']
        },
        'double': {
          'normal': assets['assetsModelSleeveDouble-12'],
          'holed': assets['assetsModelSleeveDoubleHoled-12']
        },
        'gatefold': {
          'normal': assets['assetsModelSleeveGatefold-12']
        }
      }
    };

    this._textures = {
      '7': {
        'no-spine': {
          'normal': null,
          'holed': {
            'ao': assets['assetsTextureSleeveSingleNoSpineAo-7'],
            'bumpmap': assets['assetsTextureSleeveSingleNoSpineBumpmap-7'],
            'color': assets['assetsTextureSleeveSingleNoSpineColor-7'],
            'color-ao': assets['assetsTextureSleeveSingleNoSpineColorAndAo-7']
          }
        },
        'single': {
          'normal': null,
          'holed': {
            'ao': assets['assetsTextureSleeveSingleHoledAo-7'],
            'bumpmap': assets['assetsTextureSleeveSingleHoledBumpmap-7'],
            'color': assets['assetsTextureSleeveSingleHoledColor-7'],
            'color-ao': assets['assetsTextureSleeveSingleHoledColorAndAo-7']
          }
        },
        'double': {
          'normal': null,
          'holed': {
            'ao': assets['assetsTextureSleeveDoubleHoledAo-7'],
            'bumpmap': assets['assetsTextureSleeveDoubleHoledBumpmap-7'],
            'color': assets['assetsTextureSleeveDoubleHoledColor-7'],
            'color-ao': assets['assetsTextureSleeveDoubleHoledColorAndAo-7']
          }
        },
        'gatefold': {
          'normal': {
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
          'normal': null,
          'holed': {
            'ao': assets['assetsTextureSleeveSingleNoSpineAo-10'],
            'bumpmap': assets['assetsTextureSleeveSingleNoSpineBumpmap-10'],
            'color': assets['assetsTextureSleeveSingleNoSpineColor-10'],
            'color-ao': assets['assetsTextureSleeveSingleNoSpineColorAndAo-10']
          }
        },
        'single': {
          'normal': null,
          'holed': {
            'ao': assets['assetsTextureSleeveSingleHoledAo-10'],
            'bumpmap': assets['assetsTextureSleeveSingleHoledBumpmap-10'],
            'color': assets['assetsTextureSleeveSingleHoledColor-10'],
            'color-ao': assets['assetsTextureSleeveSingleHoledColorAndAo-10']
          }
        },
        'double': {
          'normal': null,
          'holed': {
            'ao': assets['assetsTextureSleeveDoubleHoledAo-10'],
            'bumpmap': assets['assetsTextureSleeveDoubleHoledBumpmap-10'],
            'color': assets['assetsTextureSleeveDoubleHoledColor-10'],
            'color-ao': assets['assetsTextureSleeveDoubleHoledColorAndAo-10']
          }
        },
        'gatefold': {
          'normal': {
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
        }
      },

      '12': {
        'no-spine': {
          'normal': null,
          'holed': {
            'ao': assets['assetsTextureSleeveSingleNoSpineAo-12'],
            'bumpmap': assets['assetsTextureSleeveSingleNoSpineBumpmap-12'],
            'color': assets['assetsTextureSleeveSingleNoSpineColor-12'],
            'color-ao': assets['assetsTextureSleeveSingleNoSpineColorAndAo-12']
          }
        },
        'single': {
          'normal': null,
          'holed': {
            'ao': assets['assetsTextureSleeveSingleHoledAo-12'],
            'bumpmap': assets['assetsTextureSleeveSingleHoledBumpmap-12'],
            'color': assets['assetsTextureSleeveSingleHoledColor-12'],
            'color-ao': assets['assetsTextureSleeveSingleHoledColorAndAo-12']
          }
        },
        'double': {
          'normal': null,
          'holed': {
            'ao': assets['assetsTextureSleeveDoubleHoledAo-12'],
            'bumpmap': assets['assetsTextureSleeveDoubleHoledBumpmap-12'],
            'color': assets['assetsTextureSleeveDoubleHoledColor-12'],
            'color-ao': assets['assetsTextureSleeveDoubleHoledColorAndAo-12']
          }
        },
        'gatefold': {
          'normal': {
            'front': {
              'ao': assets['assetsTextureSleeveGatefoldBackAo-12'],
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
          }
        }
      }
    };

    this._defaultTexture = assets['assetsTextureSleeveDefault'];

    var self = this;

    // Image として読み込まれたテクスチャを THREE.Texture に変換する
    (function initTextures (obj) {
      Object.keys(obj).forEach(function(key) {
        if (obj[key] instanceof Image) {
          if (!obj[key]) {
            console.error('texture ' + obj + ':' + key + ' is ' + obj[key]);
          }

          obj[key] = new THREE.Texture(obj[key]);
          obj[key].needsUpdate = true;
        } else if (obj[key] instanceof Object) {
          initTextures(obj[key]);
        }
      });
    })(this._textures);

    // プリントスリーブとしてテクスチャーが渡された場合
    if (opts.textures) {
      if (this._holed) {
        this.updateTexture(this._textures[this._size][this._format][this.HOLED], opts.textures);
      } else {
        this.updateTexture(this._textures[this._size][this._format][this.NO_HOLED], opts.textures);
      }
    }

    // モデルのマテリアルを初期化
    Object.keys(self._models).forEach(function(size) {
      Object.keys(self._models[size]).forEach(function(type) {
        Object.keys(self._models[size][type]).forEach(function(opt) {
          if (!self._models[size][type][opt]) {
            console.warn('model is ' + self._models[size][type][opt]);
            return;
          }

          if (!self._textures[size][type][opt]) {
            console.warn('textures are ' + self._textures[size][type][opt]);
          }

          var assetName = size + '-' + type + '-' + opt;

          if (self._textures[size][type][opt]) { 
            self._textures[size][type][opt].assetName = assetName;
          }

          if (self._models[size][type][opt]) {
            self._models[size][type][opt].assetName = assetName;
            self._models[size][type][opt].scene.assetName = assetName;

            var scale = 5.5;
            self._models[size][type][opt].scene.scale.set(scale, scale, scale);

            self.initMaterial(self._models[size][type][opt], self._textures[size][type][opt]);
          }

          console.log('------------------' + assetName + '-------------------');
          console.log('model', self._models[size][type][opt]);
          console.log('textures', self._textures[size][type][opt]);
        });
      });
    });


    // currentObject = ステージに配置されるオブジェクト
    if (this._holed) {
      this._currentObject = this._models[this._size][this._format][this.HOLED];
    } else {
      this._currentObject = this._models[this._size][this._format][this.NO_HOLED];
    }

    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this._positionTween = new TWEEN.Tween(this.position);
    this._opacityTween = new TWEEN.Tween(this);

    this.setType(this._format);

    this._currentObject.name = 'sleeve';

    this._container.add(this._currentObject.scene);
    console.log('this._currentObject.scene', this._currentObject.scene);

    this._opacity = 0;
    this.setOpacity(1);
  };

  Sleeve.prototype.initMaterial = function(model, textures) {

    if (!model || !textures) {
      return;
    }

    var self = this;
    
    if (-1 < model.assetName.toLowerCase().indexOf('gatefold')) {
      // TODO: ゲートフォールドの面ごとにマテリアルを設定する処理
    } else {
      model.scene.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material.bumpScale = self._bumpScale;
          child.material.color = new THREE.Color(0xffffff);
          child.material.shininess = self._glossFinish ? 15 : 5;
          child.material.specular = new THREE.Color(0x363636);
          child.material.shading = THREE.SmoothShading;
          child.material.transparent = true;

          child.material.aoMap = textures['ao'] || null;
          child.material.aoMap.needsUpdate = true;

          child.material.bumpMap = textures['bumpmap'] || null;
          child.material.bumpMap.needsUpdate = true;

          child.material.map = textures['color'] || null;
          child.material.map.needsUpdate = true;

          child.geometry.computeVertexNormals();
        }
      });
    }

    return model;
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

  Sleeve.prototype.setType = function(format) {

    var idx = [
      this.SleeveFormat.SINGLE_NO_SPINE, 
      this.SleeveFormat.SINGLE, 
      this.SleeveFormat.DOUBLE, 
      this.SleeveFormat.GATEFOLD
    ].indexOf(format);

    if (-1 === idx) {
      console.error('Sleeve.prototype.setType: specified format "' + format + '" not found');
      return;
    }

    if (this._format === format) {
      console.info('Sleeve.prototype.setType: specified format "' + format + '" is already set');
      return;
    }

    var lastType = this._format;
    this._format = format;

    var isOpaque = false;

    // TODO: 無地の指定はテクスチャーでおこなう
    // if (this.TYPE_BLACK === this._format || this.TYPE_WHITE === this._format) {

    //   this._glossFinish = false;
    //   isOpaque = true;

    // }

    var self = this;

    this._container.remove(this._currentObject.scene);
    
    if (this._holed) {
      this._currentObject = this._models[this._size][this._format][this.HOLED];
    } else {
      this._currentObject = this._models[this._size][this._format][this.NO_HOLED];
    }

    this._container.add(this._currentObject.scene);

    this.setOpacity(1.0, 0);

  };

  Sleeve.prototype.setSize = function(size) {
    if (!size) {
      console.error('[Sleeve::setSize] no size specified');
      return;
    }

    this._container.remove(this._currentObject.scene);

    this._size = size;

    if (this._format === this.TYPE_PRINT_SPINE) {
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
      self._container.add(self._currentObject.scene);

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
        self._currentObject.scene.traverse(function(child) {
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
    if (this.TYPE_BLACK === this._format || this.TYPE_WHITE === this._format) {
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

    var tempObj = this._currentObject.scene.clone();
    tempObj.scale = 1.0;

    var offset = new THREE.Box3().setFromObject(tempObj).getSize().x;

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

  Sleeve.prototype.setBumpScale = function(value) {
    var self = this;
    self._bumpScale = value;

    self._currentObject.scene.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.bumpScale = self._bumpScale;
      }
    });
  };

  Sleeve.prototype.setVisibility = function(yn, opts, callback) {
    this._currentObject.scene.visible = yn;
  };

  Sleeve.prototype.update = function() {
    var self = this;

    this._currentObject.scene.position.set(this.position.x, this.position.y, this.position.z);
    this._currentObject.scene.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

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
