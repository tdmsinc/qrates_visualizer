
//= require tdmsinc-three.js
//= require_self

(function(global, exports) {

  exports.world = exports.world || {};
  exports.world.Vinyl = Vinyl;

  //--------------------------------------------------------------
  function Vinyl() {
  }

  /**
   * Constants
   */
  Vinyl.Size = {
    SIZE_7_SMALL_HALL: '7S',
    SIZE_7_LARGE_HALL: '7L',
    SIZE_10: '10',
    SIZE_12: '12'
  };

  Vinyl.ColorFormat = {
    BLACK: 'black',
    COLOR: 'color',
    SPLATTER: 'splatter'
  };

  Vinyl.Format = {
    NORMAL: 'normal',
    HEAVY: 'heavy',
    WITH_LABEL: 'with-label',
    HEAVY_WITH_LABEL: 'heavy-with-label'
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setup = function(scene, assets, opts, container) {
    opts = opts || {
      format: Vinyl.Format.NORMAL,
      size: Vinyl.Size.SIZE_7_SMALL_HALL,
      color: 0,
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

    var images = [];
    var cubeTexture = new THREE.CubeTexture(images);
    cubeTexture.flipY = false;

    for (var i = 0; i < 6; ++i) {
      cubeTexture.images[i] = assets['assetsTextureVinylEnvmap'];
    }
    cubeTexture.needsUpdate = true;

    this._container = container;
    this._size = opts.size;
    this._format = opts.format;
    this._colorFormat = opts.colorFormat;
    this._defaultColor = 0x000000;
    this._opacity = 0;
    this._rpm = opts.speed;
    this._heavy = opts.heavy;
    this._bumpScale = 0.3;
    this._enableRotate = false;
    this._opacityTweenDuration = 300;
    this._clock = new THREE.Clock();

    if (this._colorFormat === Vinyl.ColorFormat.SPLATTER) {
      this._materialParams = this._materialPresets[1];
      this._color = 0xffffff;
    } else if (this._colorFormat === Vinyl.ColorFormat.COLOR) {
      this._materialParams = this._materialPresets[opts.color];
      this._color = this._materialParams.color;
    } else {
      this._materialParams = this._materialPresets[0];
      this._color = 0;
    }

    // モデル
    this._models = {
      '7S': {
        'normal': assets['assetsModelVinylSmallHall-7'],
        'with-label': assets['assetsModelVinylSmallHallWithLabel-7'],
        'heavy': assets['assetsModelVinylSmallHallHeavy-7'],
        'heavy-with-label': assets['assetsModelVinylSmallHallHeavyWithLabel-7']
      },
      '7L': {
        'normal': assets['assetsModelVinylLargeHall-7'],
        'with-label': assets['assetsModelVinylLargeHallWithLabel-7'],
        'heavy': assets['assetsModelVinylLargeHallHeavy-7'],
        'heavy-with-label': assets['assetsModelVinylLargeHallHeavyWithLabel-7']
      },
      '10': {
        'normal': assets['assetsModelVinyl-10'],
        'with-label': assets['assetsModelVinylWithLabel-10'],
        'heavy': assets['assetsModelVinylHeavy-10'],
        'heavy-with-label': assets['assetsModelVinylHeavyWithLabel-10']
      },
      '12': {
        'normal': assets['assetsModelVinyl-12'],
        'with-label': assets['assetsModelVinylWithLabel-12'],
        'heavy': assets['assetsModelVinylHeavy-12'],
        'heavy-with-label': assets['assetsModelVinylHeavyWithLabel-12']
      }
    };

    // テクスチャー
    this._textures = {
      '7S': {
        'normal': {
          'alpha': assets['assetsTextureVinylAlphaSmallHall-7'],
          'ao': assets['assetsTextureVinylAoSmallHall-7'],
          'bumpmap': assets['assetsTextureVinylBumpmapSmallHall-7'],
          'color': assets['assetsTextureVinylColorSmallHall-7']
        },
        'with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylAoSmallHallWithLabel-7'],
            'bumpmap': assets['assetsTextureVinylBumpmapSmallHallWithLabel-7'],
            'color': assets['assetsTextureVinylColorSmallHallWithLabel-7']
          },
          'label': {
            'ao': assets['assetsTextureVinylAoSmallHallWithLabelForLabel-7'],
            'bumpmap': assets['assetsTextureVinylBumpmapSmallHallWithLabelForLabel-7'],
            'color': assets['assetsTextureVinylColorSmallHallWithLabelForLabel-7']
          }
        },
        'heavy': {
          'alpha': assets['assetsTextureVinylAlphaSmallHallHeavy-7'],
          'ao': assets['assetsTextureVinylAoSmallHallHeavy-7'],
          'bumpmap': assets['assetsTextureVinylBumpmapSmallHallHeavy-7'],
          'color': assets['assetsTextureVinylColorSmallHallHeavy-7']
        },
        'heavy-with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylAoSmallHallHeavyWithLabel-7'],
            'bumpmap': assets['assetsTextureVinylBumpmapSmallHallHeavyWithLabel-7'],
            'color': assets['assetsTextureVinylColorSmallHallHeavyWithLabel-7']
          },
          'label': {
            'ao': assets['assetsTextureVinylAoSmallHallHeavyWithLabelForLabel-7'],
            'bumpmap': assets['assetsTextureVinylBumpmapSmallHallHeavyWithLabelForLabel-7'],
            'color': assets['assetsTextureVinylColorSmallHallHeavyWithLabelForLabel-7']
          }
        }
      },
      '7L': {
        'normal': {
          'alpha': assets['assetsTextureVinylLargeHallAlpha-7'],
          'ao': assets['assetsTextureVinylLargeHallAo-7'],
          'bumpmap': assets['assetsTextureVinylLargeHallBumpmap-7'],
          'color': assets['assetsTextureVinylLargeHallColor-7']
        },
        'with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylLargeHallWithLabelAo-7'],
            'bumpmap': assets['assetsTextureVinylLargeHallWithLabelBumpmap-7'],
            'color': assets['assetsTextureVinylLargeHallWithLabelColor-7']
          },
          'label': {
            'ao': assets['assetsTextureVinylLargeHallWithLabelAoForLabel-7'],
            'bumpmap': assets['assetsTextureVinylLargeHallWithLabelBumpmapForLabel-7'],
            'color': assets['assetsTextureVinylLargeHallWithLabelColorForLabel-7']
          }
        },
        'heavy': {
          'alpha': assets['assetsTextureVinylLargeHallHeavyAlpha-7'],
          'ao': assets['assetsTextureVinylLargeHallHeavyAo-7'],
          'bumpmap': assets['assetsTextureVinylLargeHallHeavyBumpmap-7'],
          'color': assets['assetsTextureVinylLargeHallHeavyColor-7']
        },
        'heavy-with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylLargeHallHeavyWithLabelAo-7'],
            'bumpmap': assets['assetsTextureVinylLargeHallHeavyWithLabelBumpmap-7'],
            'color': assets['assetsTextureVinylLargeHallHeavyWithLabelColor-7']
          },
          'label': {
            'ao': assets['assetsTextureVinylLargeHallHeavyWithLabelAoForLabel-7'],
            'bumpmap': assets['assetsTextureVinylLargeHallHeavyWithLabelBumpmapForLabel-7'],
            'color': assets['assetsTextureVinylLargeHallHeavyWithLabelColorForLabel-7']
          }
        }
      },
      '10': {
        'normal': {
          'alpha': assets['assetsTextureVinylLargeHallAlpha-10'],
          'ao': assets['assetsTextureVinylLargeHallAo-10'],
          'bumpmap': assets['assetsTextureVinylLargeHallBumpmap-10'],
          'color': assets['assetsTextureVinylLargeHallColor-10']
        },
        'with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylWithLabelAo-10'],
            'bumpmap': assets['assetsTextureVinylWithLabelBumpmap-10'],
            'color': assets['assetsTextureVinylWithLabelColor-10']
          },
          'label': {
            'ao': assets['assetsTextureVinylWithLabelAoForLabel-10'],
            'bumpmap': assets['assetsTextureVinylWithLabelBumpmapForLabel-10'],
            'color': assets['assetsTextureVinylWithLabelColorForLabel-10']
          }
        },
        'heavy': {
          'alpha': assets['assetsTextureVinylHeavyAlpha-10'],
          'ao': assets['assetsTextureVinylHeavyAo-10'],
          'bumpmap': assets['assetsTextureVinylHeavyBumpmap-10'],
          'color': assets['assetsTextureVinylHeavyColor-10']
        },
        'heavy-with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylHeavyWithLabelAo-10'],
            'bumpmap': assets['assetsTextureVinylHeavyWithLabelBumpmap-10'],
            'color': assets['assetsTextureVinylHeavyWithLabelColor-10']
          },
          'label': {
            'ao': assets['assetsTextureVinylHeavyWithLabelAoForLabel-10'],
            'bumpmap': assets['assetsTextureVinylHeavyWithLabelBumpmapForLabel-10'],
            'color': assets['assetsTextureVinylHeavyWithLabelColorForLabel-10'],
            'color-ao': assets['assetsTextureVinylHeavyWithLabelColorAoForLabel-10']
          }
        }
      },
      '12': {
        'normal': {
          'alpha': assets['assetsTextureVinylAlpha-12'],
          'ao': assets['assetsTextureVinylAo-12'],
          'bumpmap': assets['assetsTextureVinylBumpmap-12'],
          'color': assets['assetsTextureVinylColor-12']
        },
        'with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylWithLabelAo-12'],
            'bumpmap': assets['assetsTextureVinylWithLabelBumpmap-12'],
            'color': assets['assetsTextureVinylWithLabelColor-12']
          },
          'label': {
            'ao': assets['assetsTextureVinylWithLabelAoForLabel-12'],
            'bumpmap': assets['assetsTextureVinylWithLabelBumpmapForLabel-12'],
            'color': assets['assetsTextureVinylWithLabelColorForLabel-12'],
            'color-ao': assets['assetsTextureVinylWithLabelColorAoForLabel-12']
          }
        },
        'heavy': {
          'alpha': assets['assetsTextureVinylHeavyAlpha-12'],
          'ao': assets['assetsTextureVinylHeavyAo-12'],
          'bumpmap': assets['assetsTextureVinylHeavyBumpmap-12'],
          'color': assets['assetsTextureVinylHeavyColor-12']
        },
        'heavy-with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylHeavyWithLabelAo-12'],
            'bumpmap': assets['assetsTextureVinylHeavyWithLabelBumpmap-12'],
            'color': assets['assetsTextureVinylHeavyWithLabelColor-12']
          },
          'label': {
            'ao': assets['assetsTextureVinylHeavyWithLabelAoForLabel-12'],
            'bumpmap': assets['assetsTextureVinylHeavyWithLabelBumpmapForLabel-12'],
            'color': assets['assetsTextureVinylHeavyWithLabelColorForLabel-12'],
            'color-ao': assets['assetsTextureVinylHeavyWithLabelColorAoForLabel-12']
          }
        }
      },
      // envMap: cubeTexture
    };

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

    this._position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this._opacityTween = new TWEEN.Tween(this);

    // マテリアルを初期化
    Object.keys(self._models).forEach(function(size) {
      Object.keys(self._models[size]).forEach(function(type) {

        var assetName = 'vinyl-' + size + '-' + type;

        if (self._textures[size][type]) {
          self._textures[size][type].assetName = assetName;
        }

        if (self._models[size][type]) {
          self._models[size][type].assetName = assetName;
          self._models[size][type].scene.assetName = assetName;

          var scale = 5.5;
          self._models[size][type].scene.scale.set(scale, scale, scale);

          self.initMaterial(self._models[size][type], self._textures[size][type]);
        }
      });
    });

    this.setOpacity(this._materialParams.opacity);

    this._currentObject = this._models[this._size][this._format];
    this._container.add(this._currentObject.scene);
    console.log('current vinyl', this._currentObject);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.initMaterial = function(model, textures) {
    
    if (!model || !model.scene) {
      return false;
    }

    var self = this;

    model.scene.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        self._bumpScale = 0.03;

        if (Vinyl.ColorFormat.COLOR === self._colorFormat) {
          self._bumpScale = 0.06;
        } else if (Vinyl.ColorFormat.SPLATTER === self._colorFormat) {
          self._bumpScale = 0.28;
        }
        
        child.material.bumpScale = self._bumpScale;
        child.material.opacity = self._colorFormat === Vinyl.ColorFormat.SPLATTER ? 0.7 : self._materialParams.opacity;
        child.material.reflectivity = self._colorFormat === Vinyl.ColorFormat.SPLATTER ? 0.1 : self._materialParams.reflectivity;
        child.material.reflectivity = self._materialParams.refractionRatio;
        child.material.shininess = self._materialParams.shininess;
        child.material.specular = new THREE.Color(0x363636);
        child.material.transparent = true;
        child.material.shading = THREE.SmoothShading;

        if (-1 < model.assetName.indexOf('with-label')) {
          if ('vinyl' === child.name) {
            child.material.aoMap = textures['vinyl']['ao'];
            if (child.material.aoMap) {
              child.material.aoMap.needsUpdate = true;
            }

            child.material.bumpMap = textures['vinyl']['bumpmap'];
            if (child.material.bumpMap) {
              child.material.bumpMap.needsUpdate = true;
            }

            child.material.map = textures['vinyl']['color'];
            if (child.material.map) {
              child.material.map.needsUpdate = true;
            }
          } else if ('label' === child.name) {
            child.material.aoMap = textures['label']['ao'];
            if (child.material.aoMap) {
              child.material.aoMap.needsUpdate = true;
            }

            child.material.bumpMap = textures['label']['bumpmap'];
            if (child.material.bumpMap) {
              child.material.bumpMap.needsUpdate = true;
            }

            child.material.map = textures['label']['color'];
            if (child.material.map) {
              child.material.map.needsUpdate = true;
            }
          }
        } else {
          child.material.alphaMap = textures['alpha'] || null;
          if (child.material.alphaMap) {
            child.material.alphaMap.needsUpdate = true;
          }

          child.material.aoMap = textures['ao'];
          if (child.material.aoMap) {
            child.material.aoMap.needsUpdate = true;
          }

          child.material.bumpMap = textures['bumpmap'];
          if (child.material.bumpMap) {
            child.material.bumpMap.needsUpdate = true;
          }

          child.material.map = textures['color'];
          if (child.material.map) {
            child.material.map.needsUpdate = true;
          }
        }

        child.geometry.computeVertexNormals();
      }
    });

    return model;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.updateTexture = function(tex, img) {
    if (!tex || !img) {
      return;
    }

    tex.image = img;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setTexture = function(sideA, sideB) {
    if (Vinyl.ColorFormat.SPLATTER !== this._colorFormat) {
      return false;
    }

    var self = this;

    if (sideA) {
      this.updateTexture(this._textures[self._size][self._format], sideA);

      Object.keys(self._models).forEach(function(size) {
        Object.keys(self._models[size]).forEach(function(type) {
          var tex = Vinyl.ColorFormat.SPLATTER === self._colorFormat ? self._textures[size][type] : new THREE.Texture();
          self.initMaterial(self._models[size][type], tex);
        });
      });
    }
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setSideABumpMapTexture = function(image) {
    this.updateTexture(this._textures.bumpMap['front-' + self._size], image);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setSideBBumpMapTexture = function(image) {
    this.updateTexture(this._textures.bumpMap['back-' + self._size], image);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setBumpScale = function(value) {
    var self = this;
    self._bumpScale = value;

    self._currentObject.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material.bumpScale = self._bumpScale;
      }
    });
  };

  //--------------------------------------------------------------
  Vinyl.prototype.getBumpScale = function() {
    return this._models[this._size][this._size].children[0].material.bumpScale;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setSize = function(size) {
    if (!size) {
      console.error('[Vinyl::setSize] no size specified');
      return;
    }

    this._container.remove(this._models[this._size][this._format].scene);

    this._size = size;

    var self = this;

    Object.keys(self._models).forEach(function(size) {
      Object.keys(self._models[size]).forEach(function(type) {
        var tex = Vinyl.ColorFormat.SPLATTER === self._colorFormat ? self._textures[size][type] : new THREE.Texture();
        self.initMaterial(self._models[size][type], tex);
      });
    });

    this._container.add(this._models[this._size][this._format].scene);

    this._opacity = 0;
    this.setOpacity(this._materialParams.opacity);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setFormat = function(format) {

  };

  //--------------------------------------------------------------
  Vinyl.prototype.setColorFormat = function(format) {
    if (!format) {
      return;
    }

    this._colorFormat = format;

    if (Vinyl.ColorFormat.SPLATTER === this._colorFormat) {
      this._materialParams = this._materialPresets[1];
    } else {
      this._materialParams = this._materialPresets[0];
    }

    this._color = this._materialParams.color;

    var self = this;

    Object.keys(self._models).forEach(function(size) {
      Object.keys(self._models[size]).forEach(function(type) {
        var tex = Vinyl.ColorFormat.SPLATTER === self._colorFormat ? self._textures[size][type] : new THREE.Texture();
        self.initMaterial(self._models[size][type], tex);
      });
    });

    this._opacity = 0;
    this.setOpacity(this._materialParams.opacity);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setType = function(colorType) {
    this.setColorFormat(colorType);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setColor = function(index) {
    this._materialParams = this._materialPresets[index];
    this._color = Vinyl.ColorFormat.SPLATTER === this._colorFormat ? 0xFFFFFF : this._materialParams.color;
    this._opacity = Vinyl.ColorFormat.SPLATTER === this._colorFormat ? 0.8 : this._materialParams.opacity;

    var self = this;

    Object.keys(self._models).forEach(function(size) {
      Object.keys(self._models[size]).forEach(function(type) {
        var tex = Vinyl.ColorFormat.SPLATTER === self._colorFormat ? self._textures[size][type] : null;
        self.initMaterial(self._models[size][type], tex);
      });
    });
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setOpacity = function(to, duration) {
    var self = this;

    duration = undefined !== duration ? duration : 300;

    this._opacityTween
      .stop()
      .to({ _opacity: to }, duration)
      .onUpdate(function() {
        console.log('size', self._size, 'type', self._format);
        self._models[self._size][self._format].scene.traverse(function(child) {
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

  //--------------------------------------------------------------
  Vinyl.prototype.setEnableRotate = function(yn) {
    this._enableRotate = yn;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setRPM = function(rpm) {
    this._rpm = rpm;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setHeavy = function(yn) {
    
    if (this._heavy === yn) {
      console.warn('heavy オプションはすでに有効です');
      return;
    }

    if (-1 !== this._format.indexOf('heavy')) {
      console.warn('heavy オプションはすでに有効です');
      return;
    }

    this._heavy = yn;

    // TODO: heavy オプションの適用
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setVisibility = function(yn, opts, callback) {
    this._models[this._size][this._format].scene.visible = yn;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.update = function() {

    if (!(this._models && this._models[this._size][this._format])) {
      return;
    }

    var amount = this._enableRotate ? this._clock.getDelta() * (Math.PI * (this._rpm / 60)) : 0;
    this.rotation.y -= amount;

    var self = this;

    Object.keys(self._models).forEach(function(size) {
      Object.keys(self._models[size]).forEach(function(type) {

        if (!self._models[size][type]) {
          return;
        }

        self._models[size][type].scene.position.set(self._position.x, self._position.y, self._position.z);
        self._models[size][type].scene.rotation.set(self.rotation.x, self.rotation.y, self.rotation.z);
      });
    });
  };

})(this, (this.qvv = (this.qvv || {})));
