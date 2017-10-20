
//= require tdmsinc-three.js
//= require_self

(function(global, exports) {

  exports.world = exports.world || {};
  exports.world.Sleeve = Sleeve;

  //--------------------------------------------------------------
  function map(value, inputMin, inputMax, outputMin, outputMax, clamp) {
    if (Math.abs(inputMin - inputMax) < Number.EPSILON){
      return outputMin;
    } else {
      var outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
    
      if (clamp){
        if (outputMax < outputMin) {
          if (outVal < outputMax) {
            outVal = outputMax;
          } else if (outVal > outputMin) {
            outVal = outputMin;
          }
        } else {
          if (outVal > outputMax) {
            outVal = outputMax;
          } else if (outVal < outputMin) {
            outVal = outputMin;
          }
        }
      }
      return outVal;
    }
  }

  //--------------------------------------------------------------
  function Sleeve() {
  }

  /**
   * Constants
   */
  
  Sleeve.Size = {
    SIZE_7: '7',
    SIZE_10: '10',
    SIZE_12: '12'
  };

  Sleeve.Format = {
    SINGLE_WITHOUT_SPINE: 'no-spine',
    SINGLE: 'single',
    DOUBLE: 'double',
    GATEFOLD: 'gatefold'
  };

  Sleeve.ColorFormat = {
    WHITE: 'white',
    BLACK: 'black',
    PRINT: 'print'
  };

  Sleeve.Hole = {
    NO_HOLE: 'normal',
    HOLED: 'holed'
  };

  Sleeve.Finish = {
    NORMAL: 'normal',
    GLOSS: 'gloss'
  };

  Sleeve.Shininess = {
    'normal': 5,
    'gloss': 15
  };

  Sleeve.GatefoldSide = {
    FRONT: 'front',
    BACK: 'back',
    SPINE: 'spine'
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setup = function(scene, assets, opts, container) {

    opts = opts || {
      format: Sleeve.Format.SINGLE_WITHOUT_SPINE,
      ColorFormat: Sleeve.ColorFormat.WHITE,
      size: Sleeve.Size.SIZE_12,
      hole: Sleeve.Hole.NO_HOLED,
      finish: Sleeve.Finish.NORMAL,
      textures: {

      }
    };

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
          'normal': assets['assetsModelSleeveGatefold-12'],
          'holed': assets['assetsModelSleeveGatefold-12']
        }
      }
    };

    this._textures = {
      '7': {
        'no-spine': {
          'normal': {
            'ao': assets['assetsTextureSleeveSingleNoSpineAo-7'],
            'bumpmap': assets['assetsTextureSleeveSingleNoSpineBumpmap-7'],
            'color': assets['assetsTextureSleeveSingleNoSpineColor-7'],
            'color-ao': assets['assetsTextureSleeveSingleNoSpineColorAndAo-7']
          },
          'holed': {
            'ao': assets['assetsTextureSleeveSingleNoSpineHoledAo-7'],
            'bumpmap': assets['assetsTextureSleeveSingleNoSpineHoledBumpmap-7'],
            'color': assets['assetsTextureSleeveSingleNoSpineHoledColor-7'],
            'color-ao': assets['assetsTextureSleeveSingleNoSpineHoledColorAndAo-7']
          }
        },
        'single': {
          'normal': {
            'ao': assets['assetsTextureSleeveSingledAo-7'],
            'bumpmap': assets['assetsTextureSleeveSingleBumpmap-7'],
            'color': assets['assetsTextureSleeveSingleColor-7'],
            'color-ao': assets['assetsTextureSleeveSingleColorAndAo-7']
          },
          'holed': {
            'ao': assets['assetsTextureSleeveSingleHoledAo-7'],
            'bumpmap': assets['assetsTextureSleeveSingleHoledBumpmap-7'],
            'color': assets['assetsTextureSleeveSingleHoledColor-7'],
            'color-ao': assets['assetsTextureSleeveSingleHoledColorAndAo-7']
          }
        },
        'double': {
          'normal': {
            'ao': assets['assetsTextureSleeveDoubleAo-7'],
            'bumpmap': assets['assetsTextureSleeveDoubleBumpmap-7'],
            'color': assets['assetsTextureSleeveDoubleColor-7'],
          },
          'holed': {
            'ao': assets['assetsTextureSleeveDoubleHoledAo-7'],
            'bumpmap': assets['assetsTextureSleeveDoubleHoledBumpmap-7'],
            'color': assets['assetsTextureSleeveDoubleHoledColor-7'],
          }
        },
        'gatefold': {
          'normal': {
            'front': {
              'ao': assets['assetsTextureSleeveGatefoldFrontAo-7'],
              'bumpmap': assets['assetsTextureSleeveGatefoldFrontBumpmap-7'],
              'color': assets['assetsTextureSleeveGatefoldFrontColor-7']
            },
            'back': {
              'ao': assets['assetsTextureSleeveGatefoldBackAo-7'],
              'bumpmap': assets['assetsTextureSleeveGatefoldBackBumpmap-7'],
              'color': assets['assetsTextureSleeveGatefoldBackColor-7']
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
          'normal': {
            'ao': assets['assetsTextureSleeveSingleNoSpineAo-10'],
            'bumpmap': assets['assetsTextureSleeveSingleNoSpineBumpmap-10'],
            'color': assets['assetsTextureSleeveSingleNoSpineColor-10'],
          },
          'holed': {
            'ao': assets['assetsTextureSleeveSingleNoSpineHoledAo-10'],
            'bumpmap': assets['assetsTextureSleeveSingleNoSpineHoledBumpmap-10'],
            'color': assets['assetsTextureSleeveSingleNoSpineHoledColor-10'],
          }
        },
        'single': {
          'normal': {
            'ao': assets['assetsTextureSleeveSingleAo-10'],
            'bumpmap': assets['assetsTextureSleeveSingleBumpmap-10'],
            'color': assets['assetsTextureSleeveSingleColor-10'],
          },
          'holed': {
            'ao': assets['assetsTextureSleeveSingleHoledAo-10'],
            'bumpmap': assets['assetsTextureSleeveSingleHoledBumpmap-10'],
            'color': assets['assetsTextureSleeveSingleHoledColor-10'],
          }
        },
        'double': {
          'normal': {
            'ao': assets['assetsTextureSleeveDoubleAo-10'],
            'bumpmap': assets['assetsTextureSleeveDoubleBumpmap-10'],
            'color': assets['assetsTextureSleeveDoubleColor-10'],
          },
          'holed': {
            'ao': assets['assetsTextureSleeveDoubleHoledAo-10'],
            'bumpmap': assets['assetsTextureSleeveDoubleHoledBumpmap-10'],
            'color': assets['assetsTextureSleeveDoubleHoledColor-10'],
          }
        },
        'gatefold': {
          'normal': {
            'front': {
              'ao': assets['assetsTextureSleeveGatefoldFrontAo-1102'],
              'bumpmap': assets['assetsTextureSleeveGatefoldFrontBumpmap-10'],
              'color': assets['assetsTextureSleeveGatefoldFrontColor-10']
            },
            'back': {
              'ao': assets['assetsTextureSleeveGatefoldBackAo-1102'],
              'bumpmap': assets['assetsTextureSleeveGatefoldBackBumpmap-10'],
              'color': assets['assetsTextureSleeveGatefoldBackColor-10']
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
          'normal': {
            'ao': assets['assetsTextureSleeveSingleNoSpineAo-12'],
            'bumpmap': assets['assetsTextureSleeveSingleNoSpineBumpmap-12'],
            'color': assets['assetsTextureSleeveSingleNoSpineColor-12'],
          },
          'holed': {
            'ao': assets['assetsTextureSleeveSingleNoSpineHoledAo-12'],
            'bumpmap': assets['assetsTextureSleeveSingleNoSpineHoledBumpmap-12'],
            'color': assets['assetsTextureSleeveSingleNoSpineHoledColor-12'],
          }
        },
        'single': {
          'normal': {
            'ao': assets['assetsTextureSleeveSingleAo-12'],
            'bumpmap': assets['assetsTextureSleeveSingleBumpmap-12'],
            'color': assets['assetsTextureSleeveSingleColor-12'],
          },
          'holed': {
            'ao': assets['assetsTextureSleeveSingleHoledAo-12'],
            'bumpmap': assets['assetsTextureSleeveSingleHoledBumpmap-12'],
            'color': assets['assetsTextureSleeveSingleHoledColor-12'],
          }
        },
        'double': {
          'normal': {
            'ao': assets['assetsTextureSleeveDoubleAo-12'],
            'bumpmap': assets['assetsTextureSleeveDoubleBumpmap-12'],
            'color': assets['assetsTextureSleeveDoubleColor-12'],
          },
          'holed': {
            'ao': assets['assetsTextureSleeveDoubleHoledAo-12'],
            'bumpmap': assets['assetsTextureSleeveDoubleHoledBumpmap-12'],
            'color': assets['assetsTextureSleeveDoubleHoledColor-12'],
          }
        },
        'gatefold': {
          'normal': {
            'front': {
              'ao': assets['assetsTextureSleeveGatefoldFrontAo-12'],
              'bumpmap': assets['assetsTextureSleeveGatefoldFrontBumpmap-12'],
              'color': assets['assetsTextureSleeveGatefoldFrontColorAndAo-12']
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

    const self = this;

    this._container = container;
    this._size = opts.size;
    this._finish = opts.finish || Sleeve.Finish.NORMAL;
    this._currentTextures = opts.textures;
    this._coveredRatio = 0.0;
    this._bumpScale = 0.3;
    this._shininess = Sleeve.Shininess[this._finish];
    this._boundingBox = null;
    this._gatefoldAngle = 0;
    this._globalObjectScale = 1.0;

    // hole
    if (Sleeve.Format.GATEFOLD === opts.format) {
      this._hole = Sleeve.Hole.NO_HOLE;
    } else  {
      if (opts.hole) {
        this._hole = Sleeve.Hole.HOLED;
      } else {
        this._hole = Sleeve.Hole.NO_HOLE;
      }
    }

    // Image として読み込まれたテクスチャを THREE.Texture に変換する
    (function initTextures (obj) {
      Object.keys(obj).forEach(function(key) {
        if (obj[key] instanceof Image || obj[key] === undefined) {
          if (obj[key] === undefined) {
            // console.error('texture', obj, ':' + key + ' is ' + obj[key]);
            obj[key] = new Image();
          }

          let texture = new THREE.Texture();
          obj[key] = self.updateTexture(texture, obj[key]);
        } else if (obj[key] instanceof Object) {
          initTextures(obj[key]);
        }
      });
    })(this._textures);

    // モデルのマテリアルを初期化
    Object.keys(self._models).forEach(function(size) {
      Object.keys(self._models[size]).forEach(function(type) {
        Object.keys(self._models[size][type]).forEach(function(opt) {
          if (!self._models[size][type][opt]) {
            console.warn('model["' + size + '"]["' + type + '"]["' + opt + '"] is ' + self._models[size][type][opt]);
            return;
          }

          if (!self._textures[size][type][opt]) {
            console.warn('textures["' + size + '"]["' + type + '"]["' + opt + '"] are ' + self._textures[size][type][opt]);
          }

          let assetName = size + '-' + type + '-' + opt;

          if (self._textures[size][type][opt]) { 
            self._textures[size][type][opt].assetName = assetName;
          }

          if (self._models[size][type][opt]) {
            self._models[size][type][opt].assetName = assetName;
            self._models[size][type][opt].scene.assetName = assetName;

            let scale = 5.5;
            self._models[size][type][opt].scene.scale.set(scale, scale, scale);

            self.initMaterial(self._models[size][type][opt], self._textures[size][type][opt]);
          }
        });
      });
    });

    this.setFormat(opts.format);
    this.updateBoundingBox();
    this.updateBoundingBoxMesh();

    // set initial textures
    if (opts.textures) {
      if (Sleeve.Format.GATEFOLD === this._format) {
        Object.keys(opts.textures).forEach(function (side) {
          Object.keys(opts.textures[side]).forEach(function (type) {
            self._setTexture(type, opts.textures[side][type], side);
          });
        });
      } else {
        Object.keys(opts.textures).forEach(function (type) {
          self._setTexture(type, opts.textures[type]);
        });
      }
    }

    this._coveredRatio = 0;
    this.setCoveredRatio(this._coveredRatio);
    this.setOpacity(1, 0);
  };

  //--------------------------------------------------------------
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
          child.material.shininess = self._shininess;
          child.material.specular = new THREE.Color(0x363636);
          child.material.shading = THREE.SmoothShading;
          child.material.transparent = true;

          child.material.aoMap = textures['ao'] || null;
          if (child.material.aoMap) {
            child.material.aoMap.needsUpdate = true;
          }
          
          child.material.bumpMap = textures['bumpmap'] || null;
          if (child.material.bumpMap) {
            child.material.bumpMap.needsUpdate = true;
          }
          
          child.material.map = textures['color'] || null;
          if (child.material.map) {
            child.material.map.needsUpdate = true;
          }

          child.geometry.computeFaceNormals();

          child.material.needsUpdate = true;
        }
      });
    }

    return model;
  };
  
  //--------------------------------------------------------------
  Sleeve.prototype.updateBoundingBox = function () {

    this._boundingBox = new THREE.Box3().setFromObject(this._currentObject);
  };

  //--------------------------------------------------------------
  Sleeve.prototype.updateTexture = function(texture, image) {

    if (!texture || !image) {
      return;
    }

    if (!(texture instanceof THREE.Texture)) {
      console.error('Sleeve.updateTexture: texture is not instance of THREE.Texture');
      return;
    }

    texture.image = image;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    
    return texture;
  };

  //--------------------------------------------------------------
  Sleeve.prototype._setTexture = function (type, image, side) { // for internal use

    if (undefined === side) {
      this.updateTexture(this._textures[this._size][this._format][this._hole][type], image);
    } else {
      if (-1 === Object.values(Sleeve.GatefoldSide).indexOf(side)) {
        return;
      }

      console.log(this._textures[this._size][this._format][this._hole][side][type].image);
      this.updateTexture(this._textures[this._size][this._format][this._hole][side][type], image);
      console.log(this._textures[this._size][this._format][this._hole][side][type].image);

      const self = this;
      this._currentObject.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          if (-1 < child.name.toLowerCase().indexOf(side)) {
            if ('ao' === type) {
              child.material.aoMap = self._textures[self._size][self._format][self._hole][side][type];
            } else if ('bumpmap' === type) {
              child.material.bumpMap = self._textures[self._size][self._format][self._hole][side][type];
            } else if ('color' == type) {
              child.material.map = self._textures[self._size][self._format][self._hole][side][type];
            }
          }
          child.material.needsUpdate = true;
        }
      });
    }
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setColorMap = function(image, side) {
    
    if (!image) {
      return;
    }

    this._setTexture('color', image, side);
  }

  //--------------------------------------------------------------
  Sleeve.prototype.setAoMap = function(image, side) {
    
    if (!image) {
      return;
    }

    this._setTexture('ao', image, side);
  }

  //--------------------------------------------------------------
  Sleeve.prototype.setBumpMap = function(image, side) {
    
    if (!image) {
      return;
    }

    this._setTexture('bumpmap', image, side);
  }

  //--------------------------------------------------------------
  Sleeve.prototype.setFormat = function(format) {

    if (!format) {
      console.warn('Sleeve.setFormat: no format specified');
      return;
    }

    const self = this;

    if (-1 === Object.values(Sleeve.Format).indexOf(format)) {
      console.error('Sleeve.setFormat: unknown format "' + format + '"');
      return;
    }

    if (self._format === format) {
      console.info('Sleeve.setFormat: specified format "' + format + '" is already applied');
      return;
    }

    if (format === Sleeve.Format.GATEFOLD && self._hole === Sleeve.Hole.HOLED) {
      console.warn('Sleeve.setFormat: forcibly disabled hole option because gatefold cannot have hole');

      self._hole = Sleeve.Hole.NO_HOLE;
    }

    self._format = format;

    if (self._currentObject) {
      self.removeFromContainer();
      self.dispose();
    }
    
    self._currentObject = self._models[self._size][self._format][self._hole].scene.clone();
    self._currentObject.name = 'sleeve';

    let position = self._currentObject.position;
    self._currentObject.position.set(0, position.y, position.z);
    
    self.updateBoundingBox();
    self.updateBoundingBoxMesh();

    self._currentObject.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material.shininess = self._shininess;
        child.material.needsUpdate = true;
      }
    });

    self._container.add(self._currentObject);

    self.setOpacity(1.0, 0);
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setType = function(format) {

    console.warn('Sleeve.setType(format) is deprecated. use Sleeve.setFormat(format) instead.');
    this.setFormat(format);
  };

  //--------------------------------------------------------------
  Sleeve.prototype.getFormat = function () {

    return this._format;
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setSize = function(size, scale) {

    if (!size) {
      console.warn('Sleeve.setSize: no size specified');
      return;
    }

    size += '';

    if (-1 === Object.values(Sleeve.Size).indexOf(size)) {
      console.error('Sleeve.setSize: specified size "' + size + '" not found');
      return;
    }

    if (this._size === size) {
      console.info('Sleeve.setSize: specified size "' + size + '" is already applied');
      return;
    }

    this._size = size;
    this._globalObjectScale = scale;

    this.removeFromContainer();
    this.dispose();

    this._currentObject = this._models[this._size][this._format][this._hole].scene.clone();
    this.updateBoundingBox();

    if (Sleeve.Format.GATEFOLD === this._format) {
      this.setGatefoldCoverAngle(this._gatefoldAngle);
    }

    this._container.add(this._currentObject);
    this.setOpacity(1.0, 0);
  };

  //--------------------------------------------------------------
  Sleeve.prototype.getSize = function () {

    return this._size;
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setOpacity = function(to, duration, delay) {

    var self = this;

    duration = undefined !== duration ? duration : 1000;
    delay = undefined !== delay ? delay : 0;

    this._currentObject.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        var tween = new TWEEN.Tween(child.material);
        child.material.opacity = 0;
        
        tween
          .stop()
          .delay(delay)
          .to({ opacity: to }, duration)
          .onUpdate(function (value) {
            child.material.needsUpdate = true;
          })
          .start();
      }
    });
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setHole = function(value) {

    if (!(value === Sleeve.Hole.NO_HOLE || value === Sleeve.Hole.HOLED)) {
      console.warn('Sleeve.setHole: invalid value. use Sleeve.Hole.NO_HOLE or Sleeve.Hole.HOLED');
      return;
    }

    if (value === Sleeve.Hole.HOLED && this._format === Sleeve.Format.GATEFOLD) {
      console.warn('Sleeve.setHole: gatefold has no-hole format only');
      return;
    }
    
    if (this._hole === value) {
      return;
    }

    this._hole = value;

    this.removeFromContainer();
    this.dispose();
    
    this._currentObject = this._models[this._size][this._format][this._hole].scene.clone();
    this.updateBoundingBox();
    this.updateBoundingBoxMesh();

    this._container.add(this._currentObject);

    this.setOpacity(1.0, 0);
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setFinish = function (finish) {

    if (!finish) {
      return;
    }

    if (-1 === Object.values(Sleeve.Finish).indexOf(finish)) {
      console.error('Sleeve.setFinish: unknown value "' + finish + '"');
      return;
    }

    if (this._finish === finish) {
      return;
    }

    var self = this;
    self._finish = finish;
    self._shininess = Sleeve.Shininess[self._finish];

    self._currentObject.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material.shininess = self._shininess;
        child.material.needsUpdate = true;
      }
    });
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setCoveredRatio = function(ratio) {
    
    if (Sleeve.Format.GATEFOLD === this._format || Sleeve.Format.DOUBLE === this._format) {
      return;
    }

    this._coveredRatio = Math.max(0, Math.min(1.0, ratio));

    const offset = this._coveredRatio * -this._boundingBox.getSize().x;
    const position = this._currentObject.position;
    this._currentObject.position.set(offset, position.y, position.z);
  };

  //--------------------------------------------------------------
  Sleeve.prototype.getCoveredRatio = function () {

    return this._coveredRatio;
  };

  //--------------------------------------------------------------
  Sleeve.prototype.resetCoveredRatio = function () {

    var position = this._currentObject.position;
    this._currentObject.position.set(position.x, position.y, position.z);
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setGatefoldCoverAngle = function (angle /* in radians */) {

    if (Sleeve.Format.GATEFOLD !== this._format) {
      console.error('Sleeve.setGatefoldCoverAngle: not viable for sleeve type "' + this._format + '"');
      return;
    }

    this._gatefoldAngle = angle;

    var offsetX = this._boundingBox.max.x;
    var offsetY = this._boundingBox.max.y * 0.1;
    this._currentObject.translateX(-offsetX);
    this._currentObject.rotation.set(0, 0, angle);
    this._currentObject.translateX(offsetX);

    this._currentObject.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        if (-1 < child.name.toLowerCase().indexOf('front')) {
          var rotation = child.rotation;
          child.rotation.set(rotation.x, rotation.y, angle);
          child.updateMatrix();
        } else if (-1 < child.name.toLowerCase().indexOf('back')) {
          var rotation = child.rotation;
          child.rotation.set(rotation.x, rotation.y, -angle);
          child.updateMatrix();
        }
      }
    });
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setGatefoldFrontRotation = function (value) {

    if (Sleeve.Format.GATEFOLD !== this._format) {
      console.log('Sleeve.setGatefoldDegree: not viable for sleeve type "' + this._format + '"');
      return;
    }

    var rad = value * (Math.PI / 180);

    this._currentObject.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        if (-1 < child.name.toLowerCase().indexOf('front')) {
          var rotation = child.rotation;
          child.rotation.set(rotation.x, rotation.y, rad);
        } else if (-1 < child.name.toLowerCase().indexOf('back')) {
          var rotation = child.rotation;
          child.rotation.set(rotation.x, rotation.y, -rad);
        }
      }
    });

    var offsetX = this._boundingBox.max.x - 0.5;
    this._currentObject.translateX(-offsetX);
    this._currentObject.rotation.set(0, 0, rad);
    this._currentObject.translateX(offsetX);

    var pos = this._currentObject.position;
    this._currentObject.position.set(0, pos.y, pos.z);
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setGatefoldBackRotation = function (value) {

    if (Sleeve.Format.GATEFOLD !== this._format) {
      console.error('Sleeve.setGatefoldDegree: not viable for sleeve type "' + this._format + '"');
      return;
    }

    var rad = value * (Math.PI / 180);

    this._currentObject.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        if (-1 < child.name.toLowerCase().indexOf('back')) {
          var rotation = child.rotation;
          child.rotation.set(rotation.x, rotation.y, -rad);
        }
      }
    });
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setBumpScale = function(value) {

    var self = this;
    self._bumpScale = value;

    self._currentObject.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material.bumpScale = self._bumpScale;
        child.material.needsUpdate = true;
      }
    });
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setAoMapIntensity = function(value) {

    var self = this;

    self._currentObject.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material.aoMapIntensity = value;
        child.material.needsUpdate = true;
      }
    });
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setVisibility = function(yn, opts, callback) {

    this._currentObject.visible = yn;
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setObjectScale = function (scale) {

    this._globalObjectScale = scale;
  };

  //--------------------------------------------------------------
  Sleeve.prototype.getCurrentGatefoldAngle = function () {
    
    return this._gatefoldAngle;
  };

  //--------------------------------------------------------------
  Sleeve.prototype.removeFromContainer = function () {
    
    this._container.remove(this._currentObject);
  };

  //--------------------------------------------------------------
  Sleeve.prototype.dispose = function () {

    this._currentObject.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        child.material.dispose();
        child.parent = null;

        // dispose textures
        if (child.material.alphaMap) child.material.alphaMap.dispose();
        if (child.material.aoMap) child.material.aoMap.dispose();
        if (child.material.bumpMap) child.material.bumpMap.dispose();
        if (child.material.map) child.material.map.dispose();
        if (child.material.envMap) child.material.envMap.dispose();
      }
    });
  };

  Sleeve.prototype.updateBoundingBoxMesh = function () {

    return;

    var name = 'bounding box';
    var mesh = this._container.getObjectByName(name);
    if (mesh) {
      this._container.remove(mesh);

      mesh.geometry.dispose();
      mesh.material.dispose();
    }

    // const bounds = this._boundingBox;
    
    const targetName = 'Front';
    if (!this._container.getObjectByName(targetName)) {
      return;
    }
    this._container.getObjectByName('spine').visible = false;
    this._container.updateMatrix();
    this._container.updateMatrixWorld();
    this._currentObject.updateMatrix();
    this._currentObject.updateMatrixWorld();

    const object = this._container.getObjectByName(targetName);
    object.updateMatrixWorld();
    const bounds = new THREE.Box3().setFromBufferAttribute(object.geometry.attributes.position);
    console.log('------------------------------------');
    // console.log('position', object.position);
    // console.log('world position', object.getWorldPosition());
    // console.log('bounding box', bounds);

    var geometry = new THREE.BoxGeometry(
      bounds.getSize().x * 5.5,
      bounds.getSize().y * 5.5,
      bounds.getSize().z * 5.5,
      2, 2, 2
    );

    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;

    let vec = object.getWorldPosition();
    vec.divideScalar(this._globalObjectScale);
    let ratio = this._gatefoldAngle / (Math.PI * 0.5);
    let size = bounds.getSize();
    size.multiplyScalar(5.5);

    console.log(vec);

    let x = vec.x + (size.x * 0.5) + size.x * 0.5 * Math.cos(this._gatefoldAngle * 2) - (size.x * 0.5);
    let y = (vec.y + ((size.y * 0.15) * (ratio * 2 - 1))) + size.x * 0.5 * Math.sin(this._gatefoldAngle * 2);
    mesh.position.set(x, y, vec.z);
    this._container.add(mesh);
  };

  //--------------------------------------------------------------
  Sleeve.prototype.getGatefoldFrontCoverPosition = function () {

    if (Sleeve.Format.GATEFOLD !== this._format) {
      return new THREE.Vector3(0, 0, 0);
    }

    if (!this._container.getObjectByName('Front')) {
      return new THREE.Vector3(0, 0, 0);;
    }

    const object = this._container.getObjectByName('Front');
    const bounds = new THREE.Box3().setFromBufferAttribute(object.geometry.attributes.position);
    
    const size = bounds.getSize();
    size.multiplyScalar(5.5);

    const worldPosition = object.getWorldPosition();
    worldPosition.divideScalar(this._globalObjectScale);

    const ratio = this._gatefoldAngle / (Math.PI * 0.5);

    let vector = new THREE.Vector3();
    
    vector.x = (worldPosition.x + (size.x * 0.5)) + size.x * 0.5 * Math.cos(this._gatefoldAngle * 2) - (size.x * 0.5);
    vector.y = (worldPosition.y + (size.y * (0.15 * (ratio * 2 - 1)))) + size.x * 0.5 * Math.sin(this._gatefoldAngle * 2);

    return vector;
  };

  //--------------------------------------------------------------
  Sleeve.prototype.update = function() {
    
  };

})(this, (this.qvv = (this.qvv || {})));