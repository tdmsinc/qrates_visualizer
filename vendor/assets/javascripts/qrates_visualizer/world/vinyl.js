
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
    SIZE_7_SMALL_HOLE: '7S',
    SIZE_7_LARGE_HOLE: '7L',
    SIZE_10: '10',
    SIZE_12: '12'
  };

  Vinyl.ColorFormat = {
    COLOR: 'color',
    TEXTURE: 'texture'
  };

  Vinyl.Weight = {
    NORMAL: 'normal',
    HEAVY: 'heavy'
  };

  Vinyl.Format = {
    NORMAL: 'normal',
    HEAVY: 'heavy',
    WITH_LABEL: 'with-label',
    HEAVY_WITH_LABEL: 'heavy-with-label'
  };

  Vinyl.Part = {
    VINYL: 'vinyl',
    LABEL: 'label'
  };

  Vinyl.Map = {
    ALPHA: 'alpha',
    AO: 'ao',
    BUMP: 'bump',
    COLOR: 'color'
  };

  Vinyl.Index = {
    FIRST: 'first',
    SECOND: 'second'
  }

  Vinyl.Color = {
    CLASSIC_BLACK: { color: new THREE.Color(0x000000), opacity: 1.0, reflectivity: 1.0, refractionRatio: 0.98, shininess:  25, metal: true },
    WHITE: { color: new THREE.Color(0xFFFFFF), opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true },
    EASTER_YELLOW: { color: new THREE.Color(0xfffd4d), opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true },
    RED: { color: new THREE.Color(0xcc0e00), opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true },
    HALLOWEEN_ORANGE: { color: new THREE.Color(0xff8c1a), opacity: 1.0, reflectivity:0.05, refractionRatio: 0.98, shininess:  15, metal: true },
    CYAN_BLUE: { color: new THREE.Color(0x00b1dd), opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true },
    DOOKIE_BROWN: { color: new THREE.Color(0x593320), opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true },
    DOUBLE_MINT: { color: new THREE.Color(0x41ff9f), opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true },
    GREY: { color: new THREE.Color(0x9EA2A2), opacity: 1.0, reflectivity: 0.1, refractionRatio: 0.98, shininess:  20, metal: true },
    KELLY_GREEN: { color: new THREE.Color(0x00b94e), opacity: 0.7, reflectivity: 0.6, refractionRatio: 1.98, shininess: 100, metal: true },
    PISS_YELLOW: { color: new THREE.Color(0xffed00), opacity: 0.8, reflectivity: 0.3, refractionRatio: 1.98, shininess:  80, metal: true },
    BLOOD_RED: { color: new THREE.Color(0xc8000e), opacity: 0.8, reflectivity: 0.2, refractionRatio: 1.98, shininess:  60, metal: true },
    DEEP_PURPLE: { color: new THREE.Color(0x9a004c), opacity: 0.8, reflectivity: 0.3, refractionRatio: 1.98, shininess:  80, metal: true },
    ROYAL_BLUE: { color: new THREE.Color(0x0040b6), opacity: 0.8, reflectivity: 0.6, refractionRatio: 1.98, shininess: 100, metal: true },
    MILKY_CLEAR: { color: new THREE.Color(0xFFFFFF), opacity: 0.6, reflectivity: 0.6, refractionRatio: 1.98, shininess:  80, metal: true },
    SWAMP_GREEN: { color: new THREE.Color(0x615c30), opacity: 0.8, reflectivity: 0.3, refractionRatio: 1.98, shininess:  20, metal: true },
    SEA_BLUE: { color: new THREE.Color(0x187889), opacity: 0.8, reflectivity: 0.3, refractionRatio: 1.98, shininess:  20, metal: true },
    BONE: { color: new THREE.Color(0xfbefd8), opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true },
    BRONZE: { color: new THREE.Color(0x975d3b), opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  40, metal: true },
    BEER: { color: new THREE.Color(0xddbd78), opacity: 0.7, reflectivity: 0.6, refractionRatio: 1.98, shininess: 100, metal: true },
    ELECTRIC_BLUE: { color: new THREE.Color(0xbbdcde), opacity: 0.7, reflectivity: 0.6, refractionRatio: 1.98, shininess: 100, metal: true },
    GRIMACE_PURPLE: { color: new THREE.Color(0x923b5d), opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true },
    OXBLOOD: { color: new THREE.Color(0x962e3f), opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true },
    COKE_BOTTLE_GREEN: { color: new THREE.Color(0xd4e0cb), opacity: 0.4, reflectivity: 0.6, refractionRatio: 1.98, shininess:  60, metal: true },
    ORANGE_CRUSH: { color: new THREE.Color(0xf0773c), opacity: 0.7, reflectivity: 0.3, refractionRatio: 1.98, shininess:  20, metal: true },
    HOT_PINK: { color: new THREE.Color(0xd12b51), opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true },
    BABY_PINK: { color: new THREE.Color(0xf5ccd4), opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true },
    OLIVE_GREEN: { color: new THREE.Color(0x648044), opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true },
    AQUA_BLUE: { color: new THREE.Color(0x18738e), opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true },
    ULTRA_CLEAR: { color: new THREE.Color(0xFFFFFF), opacity: 0.3, reflectivity: 0.6, refractionRatio: 1.98, shininess:  80, metal: true },
    BABY_BLUE: { color: new THREE.Color(0xb1cbe5), opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true },
    HIGHLIGHTER_YELLOW: { color: new THREE.Color(0xe4e343), opacity: 0.4, reflectivity: 0.6, refractionRatio: 1.98, shininess:  80, metal: true },
    GOLD: { color: new THREE.Color(0x9d793a), opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  50, metal: true },
    SILVER: { color: new THREE.Color(0xa7a8aa), opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  50, metal: true },
    MUSTARD: { color: new THREE.Color(0xfed76f), opacity: 1.0, reflectivity: 0.1, refractionRatio: 1.98, shininess:  20, metal: true }
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setup = function(scene, assets, opts, container) {

    opts = opts || {
      format: Vinyl.Format.NORMAL,
      size: Vinyl.Size.SIZE_7_SMALL_HOLE,
      color: Vinyl.Color.CLASSIC_BLACK,
      speed: 45,
      isEnableLabel: false
    };

    opts.color = opts.color || 0;

    var images = [];
    this._envMapTexture = new THREE.CubeTexture(images);
    this._envMapTexture.flipY = false;

    for (var i = 0; i < 6; ++i) {
      this._envMapTexture.images[i] = assets['assetsTextureVinylEnvmap'];
    }
    this._envMapTexture.needsUpdate = true;

    this._container = container;
    this._size = opts.size || Vinyl.Size.SIZE_12;
    this._weight = opts.weight || Vinyl.Weight.NORMAL;
    this._isEnableLabel = opts.isEnableLabel || false;
    this._colorFormat = opts.colorFormat || Vinyl.ColorFormat.BLACK;
    this._material = this._colorFormat === Vinyl.ColorFormat.COLOR ? Vinyl.Color.CLASSIC_BLACK : Vinyl.Color.WHITE;
    this._format = Vinyl.Format.NORMAL;
    this._defaultColor = 0x000000;
    this._opacity = 0;
    this._rpm = opts.speed;
    this._enableRotate = false;
    this._opacityTweenDuration = 300;
    this._clock = new THREE.Clock();
    this._boundingBox = null;
    this._sleeveFormat;
    this._index = opts.index || Vinyl.Index.FIRST;
    this._assetName = '';
    this._offsetY = Vinyl.Index.FIRST === this._index ? 0.6 : -0.6;

    // current object
    this._currentObject = {
      assetName: '',
      colorFormat: this._colorFormat,
      scene: null,
      format: '',
      label: this._isEnableLabel,
      material: this._colorFormat === Vinyl.ColorFormat.COLOR ? Vinyl.Color.CLASSIC_BLACK : Vinyl.Color.WHITE,
      opacity: 1,
      weight: this._weight,
      offsetX: 0
    }

    // weight と label の組み合わせで format を決定する
    this._currentObject.format = this.updateFormat(this._currentObject.weight, this._currentObject.label);
    this._format = this.updateFormat(this._weight, this._isEnableLabel);

    // this._currentObject が変更される度に反映する必要があるプロパティ
    this._bumpScale = 0.17;

    if (this._colorFormat === Vinyl.ColorFormat.SPECIAL) {
      this._material = Vinyl.Color.WHITE;
    }

    this._color = this._material.color;

    // モデル
    this._models = {
      '7S': {
        'normal': assets['assetsModelVinylSmallHole-7'],
        'with-label': assets['assetsModelVinylSmallHoleWithLabel-7'],
        'heavy': assets['assetsModelVinylSmallHoleHeavy-7'],
        'heavy-with-label': assets['assetsModelVinylSmallHoleHeavyWithLabel-7']
      },
      '7L': {
        'normal': assets['assetsModelVinylLargeHole-7'],
        'with-label': assets['assetsModelVinylLargeHoleWithLabel-7'],
        'heavy': assets['assetsModelVinylLargeHoleHeavy-7'],
        'heavy-with-label': assets['assetsModelVinylLargeHoleHeavyWithLabel-7']
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
          'alpha': assets['assetsTextureVinylAlphaSmallHole-7'],
          'ao': assets['assetsTextureVinylAoSmallHole-7'],
          'bump': assets['assetsTextureVinylBumpmapSmallHole-7'],
          'color': assets['assetsTextureVinylColorSmallHole-7']
        },
        'with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylAoSmallHoleWithLabel-7'],
            'bump': assets['assetsTextureVinylBumpmapSmallHoleWithLabel-7'],
            'color': assets['assetsTextureVinylColorSmallHoleWithLabel-7']
          },
          'label': {
            'ao': assets['assetsTextureVinylAoSmallHoleWithLabelForLabel-7'],
            'bump': assets['assetsTextureVinylBumpmapSmallHoleWithLabelForLabel-7'],
            'color': assets['assetsTextureVinylColorSmallHoleWithLabelForLabel-7']
          }
        },
        'heavy': {
          'alpha': assets['assetsTextureVinylAlphaSmallHoleHeavy-7'],
          'ao': assets['assetsTextureVinylAoSmallHoleHeavy-7'],
          'bump': assets['assetsTextureVinylBumpmapSmallHoleHeavy-7'],
          'color': assets['assetsTextureVinylColorSmallHoleHeavy-7']
        },
        'heavy-with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylAoSmallHoleHeavyWithLabel-7'],
            'bump': assets['assetsTextureVinylBumpmapSmallHoleHeavyWithLabel-7'],
            'color': assets['assetsTextureVinylColorSmallHoleHeavyWithLabel-7']
          },
          'label': {
            'ao': assets['assetsTextureVinylAoSmallHoleHeavyWithLabelForLabel-7'],
            'bump': assets['assetsTextureVinylBumpmapSmallHoleHeavyWithLabelForLabel-7'],
            'color': assets['assetsTextureVinylColorSmallHoleHeavyWithLabelForLabel-7']
          }
        }
      },
      '7L': {
        'normal': {
          'alpha': assets['assetsTextureVinylLargeHoleAlpha-7'],
          'ao': assets['assetsTextureVinylLargeHoleAo-7'],
          'bump': assets['assetsTextureVinylLargeHoleBumpmap-7'],
          'color': assets['assetsTextureVinylLargeHoleColor-7']
        },
        'with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylLargeHoleWithLabelAo-7'],
            'bump': assets['assetsTextureVinylLargeHoleWithLabelBumpmap-7'],
            'color': assets['assetsTextureVinylLargeHoleWithLabelColor-7']
          },
          'label': {
            'ao': assets['assetsTextureVinylLargeHoleWithLabelAoForLabel-7'],
            'bump': assets['assetsTextureVinylLargeHoleWithLabelBumpmapForLabel-7'],
            'color': assets['assetsTextureVinylLargeHoleWithLabelColorForLabel-7']
          }
        },
        'heavy': {
          'alpha': assets['assetsTextureVinylLargeHoleHeavyAlpha-7'],
          'ao': assets['assetsTextureVinylLargeHoleHeavyAo-7'],
          'bump': assets['assetsTextureVinylLargeHoleHeavyBumpmap-7'],
          'color': assets['assetsTextureVinylLargeHoleHeavyColor-7']
        },
        'heavy-with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylLargeHoleHeavyWithLabelAo-7'],
            'bump': assets['assetsTextureVinylLargeHoleHeavyWithLabelBumpmap-7'],
            'color': assets['assetsTextureVinylLargeHoleHeavyWithLabelColor-7']
          },
          'label': {
            'ao': assets['assetsTextureVinylLargeHoleHeavyWithLabelAoForLabel-7'],
            'bump': assets['assetsTextureVinylLargeHoleHeavyWithLabelBumpmapForLabel-7'],
            'color': assets['assetsTextureVinylLargeHoleHeavyWithLabelColorForLabel-7']
          }
        }
      },
      '10': {
        'normal': {
          'alpha': assets['assetsTextureVinylAlpha-10'],
          'ao': assets['assetsTextureVinylAo-10'],
          'bump': assets['assetsTextureVinylBumpmap-10'],
          'color': assets['assetsTextureVinylColor-10']
        },
        'with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylWithLabelAo-10'],
            'bump': assets['assetsTextureVinylWithLabelBumpmap-10'],
            'color': assets['assetsTextureVinylWithLabelColor-10']
          },
          'label': {
            'ao': assets['assetsTextureVinylWithLabelAoForLabel-10'],
            'bump': assets['assetsTextureVinylWithLabelBumpmapForLabel-10'],
            'color': assets['assetsTextureVinylWithLabelColorForLabel-10']
          }
        },
        'heavy': {
          'alpha': assets['assetsTextureVinylHeavyAlpha-10'],
          'ao': assets['assetsTextureVinylHeavyAo-10'],
          'bump': assets['assetsTextureVinylHeavyBumpmap-10'],
          'color': assets['assetsTextureVinylHeavyColor-10']
        },
        'heavy-with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylHeavyWithLabelAo-10'],
            'bump': assets['assetsTextureVinylHeavyWithLabelBumpmap-10'],
            'color': assets['assetsTextureVinylHeavyWithLabelColor-10']
          },
          'label': {
            'ao': assets['assetsTextureVinylHeavyWithLabelAoForLabel-10'],
            'bump': assets['assetsTextureVinylHeavyWithLabelBumpmapForLabel-10'],
            'color': assets['assetsTextureVinylHeavyWithLabelColorForLabel-10']
          }
        }
      },
      '12': {
        'normal': {
          'alpha': assets['assetsTextureVinylAlpha-12'],
          'ao': assets['assetsTextureVinylAo-12'],
          'bump': assets['assetsTextureVinylBumpmap-12'],
          'color': assets['assetsTextureVinylColor-12']
        },
        'with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylWithLabelAo-12'],
            'bump': assets['assetsTextureVinylWithLabelBumpmap-12'],
            'color': assets['assetsTextureVinylWithLabelColor-12']
          },
          'label': {
            'ao': assets['assetsTextureVinylWithLabelAoForLabel-12'],
            'bump': assets['assetsTextureVinylWithLabelBumpmapForLabel-12'],
            'color': assets['assetsTextureVinylWithLabelColorForLabel-12']
          }
        },
        'heavy': {
          'alpha': assets['assetsTextureVinylHeavyAlpha-12'],
          'ao': assets['assetsTextureVinylHeavyAo-12'],
          'bump': assets['assetsTextureVinylHeavyBumpmap-12'],
          'color': assets['assetsTextureVinylHeavyColor-12']
        },
        'heavy-with-label': {
          'vinyl': {
            'ao': assets['assetsTextureVinylHeavyWithLabelAo-12'],
            'bump': assets['assetsTextureVinylHeavyWithLabelBumpmap-12'],
            'color': assets['assetsTextureVinylHeavyWithLabelColor-12']
          },
          'label': {
            'ao': assets['assetsTextureVinylHeavyWithLabelAoForLabel-12'],
            'bump': assets['assetsTextureVinylHeavyWithLabelBumpmapForLabel-12'],
            'color': assets['assetsTextureVinylHeavyWithLabelColorForLabel-12']
          }
        }
      },
    };

    var self = this;

    // Image として読み込まれたテクスチャを THREE.Texture に変換する
    (function initTextures (obj, parentKey) {
      Object.keys(obj).forEach(function(key) {
        
        if (obj[key] instanceof Image) {
          if (!obj[key]) {
            console.error('texture ' + obj + ':' + key + ' is ' + obj[key]);
          }

          obj[key] = new THREE.Texture(obj[key]);
          obj[key].assetName = parentKey + '-' + key;
          obj[key].needsUpdate = true;
        } else if (obj[key] instanceof Object) {
          initTextures(obj[key], parentKey === undefined ? key : parentKey + '-' + key);
        }
      });
    })(this._textures);

    this._position = new THREE.Vector3(0, 0, 0);
    this._rotation = new THREE.Vector3(0, 0, 0);

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

    this._currentObject.scene = this._models[this._size][this._currentObject.format].scene.clone();
    this._currentObject.assetName = this._models[this._size][this._currentObject.format].assetName;

    this._currentObject.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = child.material.clone();
      }
    });

    var pos = this._currentObject.scene.position;
    this._currentObject.scene.position.set(pos.x, this._offsetY, pos.z);

    if (Vinyl.Weight.HEAVY === this._weight) {
      this._boundingBox = new THREE.Box3().setFromObject(this._models[Vinyl.Size.SIZE_12][Vinyl.Format.HEAVY].scene);
    } else {
      this._boundingBox = new THREE.Box3().setFromObject(this._models[Vinyl.Size.SIZE_12][Vinyl.Format.NORMAL].scene);
    }
    
    this._container.add(this._currentObject.scene);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.initMaterial = function(model, textures) {
    
    if (!model || !model.scene) {
      return false;
    }

    var self = this;

    model.scene.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        self._bumpScale = 0.3;

        if (Vinyl.ColorFormat.COLOR === self._colorFormat) {
          self._bumpScale = 0.17;
        } else if (Vinyl.ColorFormat.SPECIAL === self._colorFormat) {
          self._bumpScale = 0.28;
        }

        child.material = child.material.clone();
        child.material.bumpScale = self._bumpScale;
        child.material.combine = THREE.MultiplyOperation;
        child.material.color = self._material.color;
        child.material.opacity = self._material.opacity;
        child.material.specular = new THREE.Color(0x363636);
        child.material.transparent = true;
        child.material.shading = THREE.SmoothShading;
        child.material.side = THREE.FrontSide;
        child.material.envMap = self._envMapTexture;

        if (-1 < model.assetName.indexOf(Vinyl.Format.WITH_LABEL)) {          
          if (Vinyl.Part.VINYL === child.name) {

            child.material.reflectivity = self._material.reflectivity;
            child.material.refractionRatio = self._material.refractionRatio;
            child.material.shininess = self._material.shininess;

            if (textures) {
              child.material.alphaMap = textures[Vinyl.Part.VINYL][Vinyl.Map.ALPHA] || null;
              if (child.material.alphaMap) {
                child.material.alphaMap.needsUpdate = true;
              }

              child.material.aoMap = textures[Vinyl.Part.VINYL][Vinyl.Map.AO] || null;
              if (child.material.aoMap) {
                child.material.aoMap.needsUpdate = true;
              }

              child.material.bumpMap = textures[Vinyl.Part.VINYL][Vinyl.Map.BUMP] || null;
              if (child.material.bumpMap) {
                child.material.bumpMap.needsUpdate = true;
              }

              child.material.map = textures[Vinyl.Part.VINYL][Vinyl.Map.COLOR] || null;
              if (child.material.map) {
                child.material.map.needsUpdate = true;
              }
            }
          } else if (Vinyl.Part.LABEL === child.name) {

            child.material.color = new THREE.Color(0xffffff);
            child.material.reflectivity = 0;
            child.material.refractionRatio = 0;
            child.material.shininess = 5;

            if (textures) {
              child.material.aoMap = textures[Vinyl.Part.LABEL][Vinyl.Map.AO] || null;
              if (child.material.aoMap) {
                child.material.aoMap.needsUpdate = true;
              }

              child.material.bumpMap = textures[Vinyl.Part.LABEL][Vinyl.Map.BUMP] || null;
              if (child.material.bumpMap) {
                child.material.bumpMap.needsUpdate = true;
              }

              child.material.map = textures[Vinyl.Part.LABEL][Vinyl.Map.COLOR] || null;
              if (child.material.map) {
                child.material.map.needsUpdate = true;
              }
            }
          }
        } else {

          child.material.reflectivity = self._material.reflectivity;
          child.material.refractionRatio = self._material.refractionRatio;
          child.material.shininess = self._material.shininess;

          if (textures) {
            child.material.alphaMap = textures[Vinyl.Map.ALPHA] || null;
            if (child.material.alphaMap) {
              child.material.alphaMap.needsUpdate = true;
            }

            child.material.aoMap = textures[Vinyl.Map.AO] || null;
            if (child.material.aoMap) {
              child.material.aoMap.needsUpdate = true;
            }

            child.material.bumpMap = textures[Vinyl.Map.BUMP] || null;
            if (child.material.bumpMap) {
              child.material.bumpMap.needsUpdate = true;
            }

            child.material.map = textures[Vinyl.Map.COLOR] || null;
            if (child.material.map) {
              child.material.map.needsUpdate = true;
            }
          }
        }

        child.geometry.computeFaceNormals();
        child.geometry.computeVertexNormals();

        child.material.needsUpdate = true;
      }
    });

    return model;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.updateTexture = function(texture, image) {
    if (!texture || !image) {
      return;
    }

    texture.image = image;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setTexture = function(textures /* = {} */) {

    console.log('Vinyl.setTexture', textures);

    if (this._currentObject.colorFormat === Vinyl.ColorFormat.COLOR && textures.map) {
      console.error('Vinyl.setTexture: color map is only available when color format is set to "texture"');
      return;
    }

    var self = this;

    self._currentObject.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh && child.name === Vinyl.Part.VINYL) {
        Object.keys(textures).forEach(function (key) {
          child.material.alphaTest = 0.5;
          child.material[key] = new THREE.Texture();
          self.updateTexture(child.material[key], textures[key]);
          child.material.needsUpdate = true;
        });
      }
    });
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setLabelTexture = function(textures /* = {} */) {

    var self = this;

    self._currentObject.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh && child.name === Vinyl.Part.LABEL) {
        Object.keys(textures).forEach(function(key) {
          self.updateTexture(child.material[key], textures[key]);
        });
      }
    });
  };

  //--------------------------------------------------------------
  Vinyl.prototype.updateFormat = function(weight, isEnableLabel) {
    console.log(weight, isEnableLabel);
    if (weight === Vinyl.Weight.NORMAL) {
      if (isEnableLabel) {
        return Vinyl.Format.WITH_LABEL;
      } else {
        return Vinyl.Format.NORMAL;
      }
    } else if (weight === Vinyl.Weight.HEAVY) {
      if (isEnableLabel) {
        return Vinyl.Format.HEAVY_WITH_LABEL;
      } else {
        return Vinyl.Format.HEAVY;
      }
    }
  }

  //--------------------------------------------------------------
  Vinyl.prototype.updateCurrentObjectMaterial = function() {

    var self = this;

    if (!self._currentObject.scene) {
      return;
    }

    var pos = self._currentObject.scene.position;
    var format = self._currentObject.format;

    self._currentObject.scene.opacity = 0;

    self._container.remove(self._currentObject.scene);
    self.dispose();

    self._currentObject.scene = self._models[self._size][format].scene.clone();
    self._currentObject.scene.assetName = self._models[self._size][format].assetName;

    self._currentObject.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = child.material.clone();

        if (self._currentObject.format === Vinyl.Format.WITH_LABEL || self._currentObject.format === Vinyl.Format.HEAVY_WITH_LABEL) {
          if (Vinyl.Part.VINYL === child.name) {
            child.material.bumpScale = self._bumpScale;
            child.material.color = self._currentObject.material.color;
            child.material.reflectivity = self._currentObject.material.reflectivity;
            child.material.refractionRatio = self._currentObject.material.refractionRatio;
            child.material.shininess = self._currentObject.material.shininess;
          } else if (Vinyl.Part.LABEL === child.name) { 
            child.material.bumpScale = self._bumpScale;
            child.material.color = Vinyl.Color.WHITE.color;
            child.material.reflectivity = 0;
            child.material.refractionRatio = 0;
            child.material.shininess = 5;
          }
        } else {
          child.material.bumpScale = self._bumpScale;
          child.material.color = self._currentObject.material.color;
          child.material.reflectivity = self._currentObject.material.reflectivity;
          child.material.refractionRatio = self._currentObject.material.refractionRatio;
          child.material.shininess = self._currentObject.material.shininess;
        }
        
        
        child.material.needsUpdate = true;
      }
    });

    self._currentObject.scene.opacity = 0;
    self._currentObject.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material.needsUpdate = true;
      }
    });
    
    self._container.add(self._currentObject.scene);
    self._currentObject.scene.position.set(pos.x, pos.y, pos.z);

    self.setOpacity(self._currentObject.material.opacity, 1000, 250);
  }

  //--------------------------------------------------------------
  Vinyl.prototype.setBumpScale = function(value) {

    var self = this;
    self._bumpScale = value;

    self._currentObject.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material.bumpScale = self._bumpScale;
        child.material.needsUpdate = true;
      }
    });
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setAoMapIntensity = function(value) {

    var self = this;

    self._currentObject.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material.aoMapIntensity = value;
        child.material.needsUpdate = true;
      }
    });
  };

  //--------------------------------------------------------------
  Vinyl.prototype.getBumpScale = function() {
    return this._bumpScale;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setSize = function(size) {

    if (!size) {
      console.warn('Vinyl.setSize: no size specified');
      return;
    }

    if (-1 === Object.values(Vinyl.Size).indexOf(size)) {
      console.warn('Vinyl.setSize: invalid size "' + size + '"');
      return;
    }

    if (this._size === size) {
      console.info('Vinyl.setSize: already set to size ' + size);
      return;
    }

    this._size = size;
    this.updateCurrentObjectMaterial();
  };

  //--------------------------------------------------------------
  Vinyl.prototype.getSize = function () {

    return this._size;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setColorFormat = function(format) {

    if (-1 === Object.values(Vinyl.ColorFormat).indexOf(format)) {
      console.error('Vinyl.setColorFormat: invalid color format"' + format + '"');
      return;
    }

    if (this._currentObject.colorFormat === format) {
      return;
    }
    
    this._currentObject.colorFormat = format;

    if (Vinyl.ColorFormat.COLOR === this._currentObject.colorFormat) {
      this._currentObject.material = Vinyl.Color.CLASSIC_BLACK;
    } else {
      this._currentObject.material = Vinyl.Color.WHITE;
    } 

    var self = this;

    this.updateCurrentObjectMaterial();

    this.setOpacity(this._currentObject.material.opacity);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setColor = function(color) {

    if (Vinyl.ColorFormat.COLOR !== this._colorFormat) {
      console.warn('Vinyl.setColor: color option is valid when vinyl type = COLOR');
      return;
    }

    if (-1 === Object.keys(Vinyl.Color).indexOf(color)) {
      console.warn('Vinyl.setColor: unknown color "' + color + '"');
      return;
    }

    this._currentObject.material = Vinyl.Color[color];

    if (this._currentObject.colorFormat === Vinyl.ColorFormat.SPECIAL) {
      this._currentObject.material.color = 0xffffff;
      this._currentObject.material.opacity = 0.8;
      this._currentObject.material.reflectivity = 0.1;
    }

    this.updateCurrentObjectMaterial();
  };

  //--------------------------------------------------------------
  Vinyl.prototype.enableLabel = function () {

    this._currentObject.isEnableLabel = true;
    this._currentObject.format = this.updateFormat(this._currentObject.weight, this._currentObject.isEnableLabel);
    
    this.updateCurrentObjectMaterial();
  };

  //--------------------------------------------------------------
  Vinyl.prototype.disableLabel = function () {
    
    this._currentObject.isEnableLabel = false;
    this._currentObject.format = this.updateFormat(this._currentObject.weight, this._currentObject.isEnableLabel);
    
    this.updateCurrentObjectMaterial();
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setOpacity = function(to, duration, delay) {

    var self = this;

    duration = undefined !== duration ? duration : 1000;
    delay = undefined !== delay ? delay : 0;

    self._currentObject.scene.traverse(function (child) {
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
  Vinyl.prototype.setEnableRotate = function(yn) {
    this._enableRotate = yn;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setRPM = function(rpm) {
    this._rpm = rpm;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setWeight = function(weight) {

    if (-1 === Object.values(Vinyl.Weight).indexOf(weight)) {
      console.warn('Vinyl.setWeight: unknown weight value "' + weight + '"');
      return;
    }
    
    if (this._currentObject.weight === weight) {
      return;
    }

    this._currentObject.weight = weight;
    this._currentObject.format = this.updateFormat(this._currentObject.weight, this._currentObject.label);

    this.updateCurrentObjectMaterial();

    if (Vinyl.Weight.HEAVY === weight) {
      this._boundingBox = new THREE.Box3().setFromObject(this._models[Vinyl.Size.SIZE_12][Vinyl.Format.HEAVY].scene);
    } else {
      this._boundingBox = new THREE.Box3().setFromObject(this._models[Vinyl.Size.SIZE_12][Vinyl.Format.NORMAL].scene);
    }
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setVisibility = function(visibility) {

    this._currentObject.scene.visible = visibility;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setCoveredRatio = function (ratio, duration, delay, updateCallback, completeCallback) {

    if (undefined === duration) {
      duration = 500;
    } else {
      duration = Math.max(0, duration);
    }

    if (undefined === delay) {
      delay = 0;
    } else {
      delay = Math.max(0, delay);
    }

    var self = this;
    console.log('self._currentObject', self._currentObject);
    var tempObj = self._currentObject.scene.clone();
    tempObj.scale = 1.0;

    var offset = new THREE.Box3().setFromObject(tempObj).getSize().x;
    var tween = new TWEEN.Tween(this._currentObject.scene.position);

    tween
      .stop()
      .delay(delay)
      .to({ x: ratio * offset }, duration)
      .easing(TWEEN.Easing.Quartic.Out)
      .onUpdate(function(value) {
        self._currentObject.offsetX = this.x;
        if (updateCallback) updateCallback();
      })
      .onComplete(function(value) {
        self._currentObject.offsetX = this.x;
        if (completeCallback) completeCallback();
      })
      .onStop(function() {
        if (completeCallback) completeCallback();
      })
      .start();

    tempObj = null;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setRotationZ = function (angle /* in radians */) {

    var rotation = this._currentObject.scene.rotation.clone();
    var offsetX = this._boundingBox.max.x + this._currentObject.offsetX;

    this._currentObject.scene.translateX(-offsetX);
    this._currentObject.scene.rotation.set(rotation.x, rotation.y, angle);
    this._currentObject.scene.translateX(offsetX);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setOffsetY = function (value) {

    this._offsetY = value;

    var pos = this._currentObject.scene.position;
    this._currentObject.scene.position.set(pos.x, this._offsetY, pos.z);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.getCurrentProperties = function () {

    return {
      size: this._size,
      weight: this._weight,
      isEnableLabel: this._isEnableLabel,
      colorFormat: this._colorFormat,
      rpm: this._rpm
    };
  };

  //--------------------------------------------------------------
  Vinyl.prototype.removeFromContainer = function () {
    
    this._container.remove(this._currentObject.scene);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.dispose = function () {

    this._currentObject.scene.traverse(function (child) {
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
  Vinyl.prototype.update = function() {

    if (!(this._models && this._models[this._size][this._format])) {
      return;
    }

    if (this._enableRotate) {
      var amount = this._clock.getDelta() * (Math.PI * (this._rpm / 60));
      var rotation = this._currentObject.scene.rotation;
      rotation.y -= amount;
      this._currentObject.scene.rotation.set(rotation.x, rotation.y, rotation.z);
    }
  };

})(this, (this.qvv = (this.qvv || {})));
