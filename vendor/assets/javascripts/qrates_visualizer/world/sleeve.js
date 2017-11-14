
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
  Sleeve.prototype.setup = function(scene, assets, opts, container, loader) {

    opts = opts || {
      format: Sleeve.Format.SINGLE_WITHOUT_SPINE,
      ColorFormat: Sleeve.ColorFormat.WHITE,
      size: Sleeve.Size.SIZE_12,
      hole: Sleeve.Hole.NO_HOLED,
      finish: Sleeve.Finish.NORMAL,
      textures: {

      }
    };

    this._paths = {
      models: {
        '7': {
          'no-spine': {
            'normal': 'assetsModelSleeveSingleNoSpine-7',
            'holed': 'assetsModelSleeveSingleNoSpineHoled-7'
          },
          'single': {
            'normal': 'assetsModelSleeveSingle-7',
            'holed': 'assetsModelSleeveSingleHoled-7'
          },
          'double': {
            'normal': 'assetsModelSleeveDouble-7',
            'holed': 'assetsModelSleeveDoubleHoled-7'
          },
          'gatefold': {
            'normal': 'assetsModelSleeveGatefold-7'
          }
        },
  
        '10': {
          'no-spine': {
            'normal': 'assetsModelSleeveSingleNoSpine-10',
            'holed': 'assetsModelSleeveSingleNoSpineHoled-10'
          },
          'single': {
            'normal': 'assetsModelSleeveSingle-10',
            'holed': 'assetsModelSleeveSingleHoled-10'
          },
          'double': {
            'normal': 'assetsModelSleeveDouble-10',
            'holed': 'assetsModelSleeveDoubleHoled-10'
          },
          'gatefold': {
            'normal': 'assetsModelSleeveGatefold-10'
          }
        },
  
        '12': {
          'no-spine': {
            'normal': 'assetsModelSleeveSingleNoSpine-12',
            'holed': 'assetsModelSleeveSingleNoSpineHoled-12'
          },
          'single': {
            'normal': 'assetsModelSleeveSingle-12',
            'holed': 'assetsModelSleeveSingleHoled-12'
          },
          'double': {
            'normal': 'assetsModelSleeveDouble-12',
            'holed': 'assetsModelSleeveDoubleHoled-12'
          },
          'gatefold': {
            'normal': 'assetsModelSleeveGatefold-12',
            'holed': 'assetsModelSleeveGatefold-12'
          }
        }
      },

      textures: {
        '7': {
          'no-spine': {
            'normal': {
              'ao': 'assetsTextureSleeveSingleNoSpineAo-7',
              'bumpmap': 'assetsTextureSleeveSingleNoSpineBumpmap-7',
              'color': 'assetsTextureSleeveSingleNoSpineColor-7',
            },
            'holed': {
              'ao': 'assetsTextureSleeveSingleNoSpineHoledAo-7',
              'bumpmap': 'assetsTextureSleeveSingleNoSpineHoledBumpmap-7',
              'color': 'assetsTextureSleeveSingleNoSpineHoledColor-7',
            }
          },
          'single': {
            'normal': {
              'ao': 'assetsTextureSleeveSingleAo-7',
              'bumpmap': 'assetsTextureSleeveSingleBumpmap-7',
              'color': 'assetsTextureSleeveSingleColor-7',
            },
            'holed': {
              'ao': 'assetsTextureSleeveSingleHoledAo-7',
              'bumpmap': 'assetsTextureSleeveSingleHoledBumpmap-7',
              'color': 'assetsTextureSleeveSingleHoledColor-7',
            }
          },
          'double': {
            'normal': {
              'ao': 'assetsTextureSleeveDoubleAo-7',
              'bumpmap': 'assetsTextureSleeveDoubleBumpmap-7',
              'color': 'assetsTextureSleeveDoubleColor-7',
            },
            'holed': {
              'ao': 'assetsTextureSleeveDoubleHoledAo-7',
              'bumpmap': 'assetsTextureSleeveDoubleHoledBumpmap-7',
              'color': 'assetsTextureSleeveDoubleHoledColor-7',
            }
          },
          'gatefold': {
            'normal': {
              'front': {
                'ao': 'assetsTextureSleeveGatefoldFrontAo-7',
                'bumpmap': 'assetsTextureSleeveGatefoldFrontBumpmap-7',
                'color': 'assetsTextureSleeveGatefoldFrontColor-7'
              },
              'back': {
                'ao': 'assetsTextureSleeveGatefoldBackAo-7',
                'bumpmap': 'assetsTextureSleeveGatefoldBackBumpmap-7',
                'color': 'assetsTextureSleeveGatefoldBackColor-7'
              },
              'spine': {
                'ao': 'assetsTextureSleeveGatefoldSpineAo-7',
                'bumpmap': 'assetsTextureSleeveGatefoldSpineBumpmap-7',
                'color': 'assetsTextureSleeveGatefoldSpineColor-7'
              }
            },
            'holed': null
          }
        },
      
        '10': {
          'no-spine': {
            'normal': {
              'ao': 'assetsTextureSleeveSingleNoSpineAo-10',
              'bumpmap': 'assetsTextureSleeveSingleNoSpineBumpmap-10',
              'color': 'assetsTextureSleeveSingleNoSpineColor-10',
            },
            'holed': {
              'ao': 'assetsTextureSleeveSingleNoSpineHoledAo-10',
              'bumpmap': 'assetsTextureSleeveSingleNoSpineHoledBumpmap-10',
              'color': 'assetsTextureSleeveSingleNoSpineHoledColor-10',
            }
          },
          'single': {
            'normal': {
              'ao': 'assetsTextureSleeveSingleAo-10',
              'bumpmap': 'assetsTextureSleeveSingleBumpmap-10',
              'color': 'assetsTextureSleeveSingleColor-10',
            },
            'holed': {
              'ao': 'assetsTextureSleeveSingleHoledAo-10',
              'bumpmap': 'assetsTextureSleeveSingleHoledBumpmap-10',
              'color': 'assetsTextureSleeveSingleHoledColor-10',
            }
          },
          'double': {
            'normal': {
              'ao': 'assetsTextureSleeveDoubleAo-10',
              'bumpmap': 'assetsTextureSleeveDoubleBumpmap-10',
              'color': 'assetsTextureSleeveDoubleColor-10',
            },
            'holed': {
              'ao': 'assetsTextureSleeveDoubleHoledAo-10',
              'bumpmap': 'assetsTextureSleeveDoubleHoledBumpmap-10',
              'color': 'assetsTextureSleeveDoubleHoledColor-10',
            }
          },
          'gatefold': {
            'normal': {
              'front': {
                'ao': 'assetsTextureSleeveGatefoldFrontAo-10',
                'bumpmap': 'assetsTextureSleeveGatefoldFrontBumpmap-10',
                'color': 'assetsTextureSleeveGatefoldFrontColor-10'
              },
              'back': {
                'ao': 'assetsTextureSleeveGatefoldBackAo-10',
                'bumpmap': 'assetsTextureSleeveGatefoldBackBumpmap-10',
                'color': 'assetsTextureSleeveGatefoldBackColor-10'
              },
              'spine': {
                'ao': 'assetsTextureSleeveGatefoldSpineAo-10',
                'bumpmap': 'assetsTextureSleeveGatefoldSpineBumpmap-10',
                'color': 'assetsTextureSleeveGatefoldSpineColor-10'
              }
            },
          }
        },
      
        '12': {
          'no-spine': {
            'normal': {
              'ao': 'assetsTextureSleeveSingleNoSpineAo-12',
              'bumpmap': 'assetsTextureSleeveSingleNoSpineBumpmap-12',
              'color': 'assetsTextureSleeveSingleNoSpineColor-12',
            },
            'holed': {
              'ao': 'assetsTextureSleeveSingleNoSpineHoledAo-12',
              'bumpmap': 'assetsTextureSleeveSingleNoSpineHoledBumpmap-12',
              'color': 'assetsTextureSleeveSingleNoSpineHoledColor-12',
            }
          },
          'single': {
            'normal': {
              'ao': 'assetsTextureSleeveSingleAo-12',
              'bumpmap': 'assetsTextureSleeveSingleBumpmap-12',
              'color': 'assetsTextureSleeveSingleColor-12',
            },
            'holed': {
              'ao': 'assetsTextureSleeveSingleHoledAo-12',
              'bumpmap': 'assetsTextureSleeveSingleHoledBumpmap-12',
              'color': 'assetsTextureSleeveSingleHoledColor-12',
            }
          },
          'double': {
            'normal': {
              'ao': 'assetsTextureSleeveDoubleAo-12',
              'bumpmap': 'assetsTextureSleeveDoubleBumpmap-12',
              'color': 'assetsTextureSleeveDoubleColor-12',
            },
            'holed': {
              'ao': 'assetsTextureSleeveDoubleHoledAo-12',
              'bumpmap': 'assetsTextureSleeveDoubleHoledBumpmap-12',
              'color': 'assetsTextureSleeveDoubleHoledColor-12',
            }
          },
          'gatefold': {
            'normal': {
              'front': {
                'ao': 'assetsTextureSleeveGatefoldFrontAo-12',
                'bumpmap': 'assetsTextureSleeveGatefoldFrontBumpmap-12',
                'color': 'assetsTextureSleeveGatefoldFrontColor-12'
              },
              'back': {
                'ao': 'assetsTextureSleeveGatefoldBackAo-12',
                'bumpmap': 'assetsTextureSleeveGatefoldBackBumpmap-12',
                'color': 'assetsTextureSleeveGatefoldBackColor-12'
              },
              'spine': {
                'ao': 'assetsTextureSleeveGatefoldSpineAo-12',
                'bumpmap': 'assetsTextureSleeveGatefoldSpineBumpmap-12',
                'color': 'assetsTextureSleeveGatefoldSpineColor-12'
              }
            },
            'holed': {
              'front': {
                'ao': 'assetsTextureSleeveGatefoldFrontAo-12',
                'bumpmap': 'assetsTextureSleeveGatefoldFrontBumpmap-12',
                'color': 'assetsTextureSleeveGatefoldFrontColor-12'
              },
              'back': {
                'ao': 'assetsTextureSleeveGatefoldBackAo-12',
                'bumpmap': 'assetsTextureSleeveGatefoldBackBumpmap-12',
                'color': 'assetsTextureSleeveGatefoldBackColor-12'
              },
              'spine': {
                'ao': 'assetsTextureSleeveGatefoldSpineAo-12',
                'bumpmap': 'assetsTextureSleeveGatefoldSpineBumpmap-12',
                'color': 'assetsTextureSleeveGatefoldSpineColor-12'
              }
            }
          }
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
          },
          'holed': {
            'ao': assets['assetsTextureSleeveSingleNoSpineHoledAo-7'],
            'bumpmap': assets['assetsTextureSleeveSingleNoSpineHoledBumpmap-7'],
            'color': assets['assetsTextureSleeveSingleNoSpineHoledColor-7'],
          }
        },
        'single': {
          'normal': {
            'ao': assets['assetsTextureSleeveSingledAo-7'],
            'bumpmap': assets['assetsTextureSleeveSingleBumpmap-7'],
            'color': assets['assetsTextureSleeveSingleColor-7'],
          },
          'holed': {
            'ao': assets['assetsTextureSleeveSingleHoledAo-7'],
            'bumpmap': assets['assetsTextureSleeveSingleHoledBumpmap-7'],
            'color': assets['assetsTextureSleeveSingleHoledColor-7'],
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
              'ao': assets['assetsTextureSleeveGatefoldFrontAo-10'],
              'bumpmap': assets['assetsTextureSleeveGatefoldFrontBumpmap-10'],
              'color': assets['assetsTextureSleeveGatefoldFrontColor-10']
            },
            'back': {
              'ao': assets['assetsTextureSleeveGatefoldBackAo-10'],
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
              'color': assets['assetsTextureSleeveGatefoldFrontColor-12']
            },
            'back': {
              'ao': assets['assetsTextureSleeveGatefoldBackAo-12'],
              'bumpmap': assets['assetsTextureSleeveGatefoldBackBumpmap-12'],
              'color': assets['assetsTextureSleeveGatefoldBackColor-12']
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

    this._loader = loader;
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

    const self = this;
    // Image として読み込まれたテクスチャを THREE.Texture に変換する
    (function initTextures (obj) {
      Object.keys(obj).forEach((key) => {
        if (obj[key]) {
          if ('object' === typeof obj[key]) {
            initTextures(obj[key]);
            return;
          } else if (obj[key] instanceof Image || undefined === obj[key]) {
            if (undefined === obj[key]) {
              obj[key] = new Image();
            }
  
            let texture = new THREE.Texture();
            obj[key] = self.updateTexture(texture, obj[key]);
          }
        } else {
          let texture = new THREE.Texture();
          obj[key] = self.updateTexture(texture, new Image());
        }
      });
    })(this._textures);

    return new Promise((resolve, reject) => {

      this.setFormat(opts.format)
        .then(() => {
          // set initial textures
          if (opts.textures) {
            if (Sleeve.Format.GATEFOLD === this._format) {
              Object.keys(opts.textures).forEach(side => {
                Object.keys(opts.textures[side]).forEach(type => {
                  this._setTexture(type, opts.textures[side][type], side);
                });
              });
            } else {
              Object.keys(opts.textures).forEach(type => {
                this._setTexture(type, opts.textures[type]);
              });
            }
          }

          this._coveredRatio = 0;
          this.setCoveredRatio(this._coveredRatio);

          this._currentObject.traverse(child => {
            if (child instanceof THREE.Mesh) {
              child.material.opacity = 1.0;
              child.material.needsUpdate = true;
            }
          })

          resolve();
        })
    });
  };

  //--------------------------------------------------------------
  Sleeve.prototype.initMaterial = function(model, textures) {

    if (!model || !textures) {
      return;
    }
    
    if (-1 < model.assetName.toLowerCase().indexOf('gatefold')) {
      // TODO: ゲートフォールドの面ごとにマテリアルを設定する処理
    } else {
      model.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.bumpScale = this._bumpScale;
          child.material.color = new THREE.Color(0xffffff);
          child.material.shininess = this._shininess;
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
  Sleeve.prototype._loadTextures = function (size, format, hole) {

    return new Promise((resolve, reject) => {

      let targets = [];
      
      (function addTextureToTarget (obj, parentKey) {
        Object.keys(obj).forEach((key) => {
          if (typeof obj[key] === 'string') {
            targets.push({
              'assetType': 'texture',
              'textureType': key,
              'key': obj[key]
            });
          } else if (typeof obj[key] === 'object') {
            addTextureToTarget(obj[key], parentKey === undefined ? key : parentKey + '-' + key);
          }
        });
      })(this._paths.textures[size][format][hole]);
  
      Promise.all(targets.map((target) => {
        return this._loader.loadAsset(target);
      }))
        .then((assets) => {

          console.log('Sleeve.setFormat: loaded textures  ------', assets);
          
          assets.forEach((asset) => {
  
            const assetType = asset['assetType'];
            const textureType = asset['textureType'];
            const assetKey = asset['key'];
    
            console.log('Sleeve.setFormat: asset loaded', assetType, textureType, assetKey);
  
            if ('texture' === assetType) {
              if (Sleeve.Format.GATEFOLD === format) {
                let side;
  
                if (-1 < assetKey.toLowerCase().indexOf('front')) {
                  side = 'front';
                } else if (-1 < assetKey.toLowerCase().indexOf('back')) {
                  side = 'back';
                } else if (-1 < assetKey.toLowerCase().indexOf('spine')) {
                  side = 'spine';
                }
  
                console.log('update gatefold texture - ' + side, this._loader.assets[assetKey]);
                this.updateTexture(this._textures[size][format][hole][side][textureType], this._loader.assets[assetKey]);
              } else {
                console.log('update texture', this._loader.assets[assetKey]);
                this.updateTexture(this._textures[size][format][hole][textureType], this._loader.assets[assetKey]);
              }
            }
          });

          resolve(assets);
        });
    });
  };

  //--------------------------------------------------------------
  Sleeve.prototype._setTexture = function (type, image, side) {

    console.log('Sleeve._setTexture - size:', this._size, ', format:', this._format, ', hole:', this._hole, ', side:', side, ', type:', type);

    if (undefined === side) {
      console.log('try to update texture', this._textures[this._size][this._format][this._hole][type], image);
      this.updateTexture(this._textures[this._size][this._format][this._hole][type], image);
    } else {
      if (-1 === Object.values(Sleeve.GatefoldSide).indexOf(side)) {
        return;
      }

      this.updateTexture(this._textures[this._size][this._format][this._hole][side][type], image);

      this._currentObject.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (-1 < child.name.toLowerCase().indexOf(side)) {
            if ('ao' === type) {
              child.material.aoMap = this._textures[this._size][this._format][this._hole][side][type];
            } else if ('bumpmap' === type) {
              child.material.bumpMap = this._textures[this._size][this._format][this._hole][side][type];
            } else if ('color' == type) {
              child.material.map = this._textures[this._size][this._format][this._hole][side][type];
            }
          }

          child.material.needsUpdate = true;
        }
      });
    }
  };

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
  Sleeve.prototype.setColorMap = function (image, side) {
    
    if (!image) {
      return;
    }

    this._setTexture('color', image, side);
  }

  //--------------------------------------------------------------
  Sleeve.prototype.setFormat = function (format, callback) {

    if (!format) {
      console.warn('Sleeve.setFormat: no format specified');
      return Promise.reject(new Error('Sleeve.setFormat: no format specified'));
    }

    if (-1 === Object.values(Sleeve.Format).indexOf(format)) {
      console.error('Sleeve.setFormat: unknown format "' + format + '"');
      return Promise.reject(new Error('Sleeve.setFormat: unknown format "' + format + '"'));
    }

    if (format === Sleeve.Format.GATEFOLD && this._hole === Sleeve.Hole.HOLED) {
      console.warn('Sleeve.setFormat: forcibly disabled hole option because gatefold cannot have hole');

      this._hole = Sleeve.Hole.NO_HOLE;
    }

    return new Promise((resolve, reject) => {

      this._format = format;
        
      this._loadTextures(this._size, format, this._hole)
        .then((results) => {
          return this._loader.loadAsset({
            'assetType': 'model',
            'key': this._paths.models[this._size][this._format][this._hole]
          });
        })
        .then((result) => {
  
          const assetKey = result['key'];
          const obj = this._loader.assets[assetKey];
  
          console.log('Sleeve.setFormat: model loaded', assetKey, obj);
  
          const assetName = 'sleeve-' + this._size + '-' + this._format + '-' + this.hole;
      
          obj.assetName = assetName;
          obj.scene.assetName = assetName;
  
          if (this._currentObject) {
            this._container.remove(this._currentObject);
            this.dispose();
          }
  
          if (this._textures[this._size][this._format][this._hole]) { 
            this._textures[this._size][this._format][this._hole].assetName = assetName;
          }
  
          this.initMaterial(obj, this._textures[this._size][this._format][this._hole]);
  
          this._currentObject = obj.scene.clone();
          this._currentObject.name = 'sleeve';
      
          this._currentObject.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = child.material.clone();
              // child.material = new THREE.MeshBasicMaterial();
              // child.material = new THREE.MeshPhongMaterial();
              child.material.shininess = this._shininess;
              child.material.opacity = 0;
              child.material.needsUpdate = true;
            }
          });
      
          const position = this._currentObject.position;
          this._currentObject.position.set(0, position.y, position.z);
  
          const scale = 5.5;
          this._currentObject.scale.set(scale, scale, scale);
  
          this.updateBoundingBox();
          this.updateBoundingBoxMesh();
  
          if (Sleeve.Format.GATEFOLD === this._format) {
            this.setGatefoldCoverAngle(this._gatefoldAngle);
          }
  
          this._container.add(this._currentObject);
      
          // this.setOpacity(1.0, 0);
      
          resolve(this);
        });
    });
    
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

    return this.setFormat(this._format);
  };

  //--------------------------------------------------------------
  Sleeve.prototype.getSize = function () {

    return this._size;
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setOpacity = function(to, duration, delay) {

    duration = undefined !== duration ? duration : 1000;
    delay = undefined !== delay ? delay : 0;

    return new Promise((resolve, reject) => {

      this._currentObject.traverse(child => {
        if (child instanceof THREE.Mesh) {
          let tween = new TWEEN.Tween(child.material);
          
          tween
            .stop()
            .delay(delay)
            .to({ opacity: to }, duration)
            .onUpdate(function (value) {
              child.material.needsUpdate = true;
            })
            .onComplete(() => {
              resolve();
            })
            .start();
        }
      });
    });
  };

  //--------------------------------------------------------------
  Sleeve.prototype.setHole = function (value) {

    if ('boolean' === typeof value) {
      if (value) {
        value = Sleeve.Hole.HOLED;
      } else {
        value = Sleeve.Hole.NO_HOLE;
      }
    } else {
      if (!(value === Sleeve.Hole.NO_HOLE || value === Sleeve.Hole.HOLED)) {
        console.warn('Sleeve.setHole: invalid value. use Sleeve.Hole.NO_HOLE or Sleeve.Hole.HOLED');
        return Promise.reject(new Error('Sleeve.setHole: invalid value. use Sleeve.Hole.NO_HOLE or Sleeve.Hole.HOLED'));
      }
  
      if (value === Sleeve.Hole.HOLED && this._format === Sleeve.Format.GATEFOLD) {
        console.warn('Sleeve.setHole: gatefold has no-hole format only');
        return Promise.reject(new Error('Sleeve.setHole: gatefold has no-hole format only'));
      }
    }

    if (this._hole === value) {
      return Promise.resolve(this);
    }

    this._hole = value;

    return new Promise((resolve, reject) => {
      this.setOpacity(0.0, 250)
        .then(() => {
          return this.setFormat(this._format)
        })
        .then(() => {
          return this.setOpacity(1.0, 500);
        })
        .then(() => {
          resolve();
        });
    });
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

    this._finish = finish;
    this._shininess = Sleeve.Shininess[this._finish];

    this._currentObject.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.shininess = this._shininess;
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
  Sleeve.prototype.setBumpScale = function(value) {

    this._bumpScale = value;

    this._currentObject.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.bumpScale = this._bumpScale;
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

  //--------------------------------------------------------------
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

  //--------------------------------------------------------------
  Sleeve.prototype.loadModelForSize = function (size) {

    return new Promise((resolve, reject) => {
      
      this._loadTextures(size, this._format, this._hole)
        .then((results) => {
          return this._loader.loadAsset({
            'assetType': 'model',
            'key': this._paths.models[this._size][this._format][this._hole]
          });
        })
        .then((result) => {
  
          const assetKey = result['key'];
          const obj = this._loader.assets[assetKey];
  
          console.log('Sleeve.setFormat: model loaded', assetKey, obj);
  
          const assetName = 'sleeve-' + this._size + '-' + this._format + '-' + this.hole;
      
          obj.assetName = assetName;
          obj.scene.assetName = assetName;
  
          if (this._textures[size][this._format][this._hole]) { 
            this._textures[size][this._format][this._hole].assetName = assetName;
          }
  
          this.initMaterial(obj, this._textures[this._size][this._format][this._hole]);
      
          resolve(this);
        });
    });
  };

})(this, (this.qvv = (this.qvv || {})));