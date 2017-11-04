
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
  Vinyl.prototype.setup = function(scene, assets, opts, container, loader, offsetY) {

    opts = opts || {
      format: Vinyl.Format.NORMAL,
      size: Vinyl.Size.SIZE_7_SMALL_HOLE,
      color: Vinyl.Color.CLASSIC_BLACK,
      speed: 45,
      isEnableLabel: false
    };

    opts.color = opts.color || 0;

    // 環境マップ
    let images = [];
    for (var i = 0; i < 6; ++i) {
      images.push('envmap.jpg');
    }

    let cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('assets/qrates_visualizer/vinyls/');

    this._envMapTexture = cubeTextureLoader.load(images);
    this._envMapTexture.flipY = false;
    this._envMapTexture.needsUpdate = true;

    // --------
    this._loader = loader;
    this._container = container;
    this._size = opts.size || Vinyl.Size.SIZE_12;
    this._weight = opts.weight || Vinyl.Weight.NORMAL;
    this._label = opts.label || false;
    this._colorFormat = opts.colorFormat || Vinyl.ColorFormat.BLACK;
    this._material = this._colorFormat === Vinyl.ColorFormat.COLOR ? Vinyl.Color.CLASSIC_BLACK : Vinyl.Color.WHITE;
    this._defaultColor = 0x000000;
    this._opacity = 0;
    this._rpm = opts.speed;
    this._enableRotate = false;
    this._clock = new THREE.Clock();
    this._boundingBox = null;
    this._sleeveFormat;
    this._index = opts.index || Vinyl.Index.FIRST;
    this._assetName = '';
    this._offsetX = 0;
    this._offsetY = opts.offsetY;
    this._visibility = opts.visibility;
    this._gatefoldAngle = 0;
    this._coveredRatio = 0;
    this._basePosition = new THREE.Vector3();
    this._transparent = opts.transparent;

    // weight と label の組み合わせで format を決定する
    this._format = this.updateFormat(this._weight, this._label);

    // this._currentObject が変更される度に反映する必要があるプロパティ
    this._bumpScale = 0.17;

    if (this._colorFormat === Vinyl.ColorFormat.SPECIAL) {
      this._material = Vinyl.Color.WHITE;
    }

    this._color = this._material.color;

    // モデル
    this._paths = {
      models: {
        '7S': {
          'normal': 'assetsModelVinylSmallHole-7',
          'with-label': 'assetsModelVinylSmallHoleWithLabel-7',
          'heavy': 'assetsModelVinylSmallHoleHeavy-7',
          'heavy-with-label': 'assetsModelVinylSmallHoleHeavyWithLabel-7'
        },
        '7L': {
          'normal': 'assetsModelVinylLargeHole-7',
          'with-label': 'assetsModelVinylLargeHoleWithLabel-7',
          'heavy': 'assetsModelVinylLargeHoleHeavy-7',
          'heavy-with-label': 'assetsModelVinylLargeHoleHeavyWithLabel-7'
        },
        '10': {
          'normal': 'assetsModelVinyl-10',
          'with-label': 'assetsModelVinylWithLabel-10',
          'heavy': 'assetsModelVinylHeavy-10',
          'heavy-with-label': 'assetsModelVinylHeavyWithLabel-10'
        },
        '12': {
          'normal': 'assetsModelVinyl-12',
          'with-label': 'assetsModelVinylWithLabel-12',
          'heavy': 'assetsModelVinylHeavy-12',
          'heavy-with-label': 'assetsModelVinylHeavyWithLabel-12'
        }
      },
    
      textures: {
        '7S': {
          'normal': {
            'alpha': 'assetsTextureVinylAlphaSmallHole-7',
            'ao': 'assetsTextureVinylAoSmallHole-7',
            'bump': 'assetsTextureVinylBumpmapSmallHole-7',
            'color': 'assetsTextureVinylColorSmallHole-7'
          },
          'with-label': {
            'vinyl': {
              'ao': 'assetsTextureVinylAoSmallHoleWithLabel-7',
              'bump': 'assetsTextureVinylBumpmapSmallHoleWithLabel-7',
              'color': 'assetsTextureVinylColorSmallHoleWithLabel-7'
            },
            'label': {
              'ao': 'assetsTextureVinylAoSmallHoleWithLabelForLabel-7',
              'bump': 'assetsTextureVinylBumpmapSmallHoleWithLabelForLabel-7',
              'color': 'assetsTextureVinylColorSmallHoleWithLabelForLabel-7'
            }
          },
          'heavy': {
            'alpha': 'assetsTextureVinylAlphaSmallHoleHeavy-7',
            'ao': 'assetsTextureVinylAoSmallHoleHeavy-7',
            'bump': 'assetsTextureVinylBumpmapSmallHoleHeavy-7',
            'color': 'assetsTextureVinylColorSmallHoleHeavy-7'
          },
          'heavy-with-label': {
            'vinyl': {
              'ao': 'assetsTextureVinylAoSmallHoleHeavyWithLabel-7',
              'bump': 'assetsTextureVinylBumpmapSmallHoleHeavyWithLabel-7',
              'color': 'assetsTextureVinylColorSmallHoleHeavyWithLabel-7'
            },
            'label': {
              'ao': 'assetsTextureVinylAoSmallHoleHeavyWithLabelForLabel-7',
              'bump': 'assetsTextureVinylBumpmapSmallHoleHeavyWithLabelForLabel-7',
              'color': 'assetsTextureVinylColorSmallHoleHeavyWithLabelForLabel-7'
            }
          }
        },
        '7L': {
          'normal': {
            'alpha': 'assetsTextureVinylLargeHoleAlpha-7',
            'ao': 'assetsTextureVinylLargeHoleAo-7',
            'bump': 'assetsTextureVinylLargeHoleBumpmap-7',
            'color': 'assetsTextureVinylLargeHoleColor-7'
          },
          'with-label': {
            'vinyl': {
              'ao': 'assetsTextureVinylLargeHoleWithLabelAo-7',
              'bump': 'assetsTextureVinylLargeHoleWithLabelBumpmap-7',
              'color': 'assetsTextureVinylLargeHoleWithLabelColor-7'
            },
            'label': {
              'ao': 'assetsTextureVinylLargeHoleWithLabelAoForLabel-7',
              'bump': 'assetsTextureVinylLargeHoleWithLabelBumpmapForLabel-7',
              'color': 'assetsTextureVinylLargeHoleWithLabelColorForLabel-7'
            }
          },
          'heavy': {
            'alpha': 'assetsTextureVinylLargeHoleHeavyAlpha-7',
            'ao': 'assetsTextureVinylLargeHoleHeavyAo-7',
            'bump': 'assetsTextureVinylLargeHoleHeavyBumpmap-7',
            'color': 'assetsTextureVinylLargeHoleHeavyColor-7'
          },
          'heavy-with-label': {
            'vinyl': {
              'ao': 'assetsTextureVinylLargeHoleHeavyWithLabelAo-7',
              'bump': 'assetsTextureVinylLargeHoleHeavyWithLabelBumpmap-7',
              'color': 'assetsTextureVinylLargeHoleHeavyWithLabelColor-7'
            },
            'label': {
              'ao': 'assetsTextureVinylLargeHoleHeavyWithLabelAoForLabel-7',
              'bump': 'assetsTextureVinylLargeHoleHeavyWithLabelBumpmapForLabel-7',
              'color': 'assetsTextureVinylLargeHoleHeavyWithLabelColorForLabel-7'
            }
          }
        },
        '10': {
          'normal': {
            'alpha': 'assetsTextureVinylAlpha-10',
            'ao': 'assetsTextureVinylAo-10',
            'bump': 'assetsTextureVinylBumpmap-10',
            'color': 'assetsTextureVinylColor-10'
          },
          'with-label': {
            'vinyl': {
              'ao': 'assetsTextureVinylWithLabelAo-10',
              'bump': 'assetsTextureVinylWithLabelBumpmap-10',
              'color': 'assetsTextureVinylWithLabelColor-10'
            },
            'label': {
              'ao': 'assetsTextureVinylWithLabelAoForLabel-10',
              'bump': 'assetsTextureVinylWithLabelBumpmapForLabel-10',
              'color': 'assetsTextureVinylWithLabelColorForLabel-10'
            }
          },
          'heavy': {
            'alpha': 'assetsTextureVinylHeavyAlpha-10',
            'ao': 'assetsTextureVinylHeavyAo-10',
            'bump': 'assetsTextureVinylHeavyBumpmap-10',
            'color': 'assetsTextureVinylHeavyColor-10'
          },
          'heavy-with-label': {
            'vinyl': {
              'ao': 'assetsTextureVinylHeavyWithLabelAo-10',
              'bump': 'assetsTextureVinylHeavyWithLabelBumpmap-10',
              'color': 'assetsTextureVinylHeavyWithLabelColor-10'
            },
            'label': {
              'ao': 'assetsTextureVinylHeavyWithLabelAoForLabel-10',
              'bump': 'assetsTextureVinylHeavyWithLabelBumpmapForLabel-10',
              'color': 'assetsTextureVinylHeavyWithLabelColorForLabel-10'
            }
          }
        },
        '12': {
          'normal': {
            'alpha': 'assetsTextureVinylAlpha-12',
            'ao': 'assetsTextureVinylAo-12',
            'bump': 'assetsTextureVinylBumpmap-12',
            'color': 'assetsTextureVinylColor-12'
          },
          'with-label': {
            'vinyl': {
              'ao': 'assetsTextureVinylWithLabelAo-12',
              'bump': 'assetsTextureVinylWithLabelBumpmap-12',
              'color': 'assetsTextureVinylWithLabelColor-12'
            },
            'label': {
              'ao': 'assetsTextureVinylWithLabelAoForLabel-12',
              'bump': 'assetsTextureVinylWithLabelBumpmapForLabel-12',
              'color': 'assetsTextureVinylWithLabelColorForLabel-12'
            }
          },
          'heavy': {
            'alpha': 'assetsTextureVinylHeavyAlpha-12',
            'ao': 'assetsTextureVinylHeavyAo-12',
            'bump': 'assetsTextureVinylHeavyBumpmap-12',
            'color': 'assetsTextureVinylHeavyColor-12'
          },
          'heavy-with-label': {
            'vinyl': {
              'ao': 'assetsTextureVinylHeavyWithLabelAo-12',
              'bump': 'assetsTextureVinylHeavyWithLabelBumpmap-12',
              'color': 'assetsTextureVinylHeavyWithLabelColor-12'
            },
            'label': {
              'ao': 'assetsTextureVinylHeavyWithLabelAoForLabel-12',
              'bump': 'assetsTextureVinylHeavyWithLabelBumpmapForLabel-12',
              'color': 'assetsTextureVinylHeavyWithLabelColorForLabel-12'
            }
          }
        }
      }
    };

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

    // Image として読み込まれたテクスチャを THREE.Texture に変換する
    (function initTextures (obj, parentKey) {
      Object.keys(obj).forEach((key) => {
        
        if (null === obj[key]) {
          obj[key] = new THREE.Texture();
        } else if (obj[key] instanceof Image) {
          if (!obj[key] || obj[key] === undefined) {
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

    return this._loadModel(this._size, this._format);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.initMaterial = function(model, textures) {
    
    if (!model || !model.scene) {
      return false;
    }

    model.scene.traverse((child) => {
      
      if (child instanceof THREE.Mesh) {
        this._bumpScale = 0.3;

        if (Vinyl.ColorFormat.COLOR === this._colorFormat) {
          this._bumpScale = 0.17;
        } else if (Vinyl.ColorFormat.SPECIAL === this._colorFormat) {
          this._bumpScale = 0.28;
        }

        child.material = child.material.clone();
        child.material.bumpScale = this._bumpScale;
        child.material.combine = THREE.MultiplyOperation;
        child.material.color = this._material.color;
        child.material.opacity = this._material.opacity;
        child.material.specular = new THREE.Color(0x363636);
        // child.material.transparent = true;
        child.material.transparent = this._transparent;
        child.material.shading = THREE.SmoothShading;
        child.material.side = THREE.FrontSide;
        child.material.envMap = this._envMapTexture;

        if (-1 < model.assetName.indexOf(Vinyl.Format.WITH_LABEL)) {          
          if (Vinyl.Part.VINYL === child.name) {

            child.material.reflectivity = this._material.reflectivity;
            child.material.refractionRatio = this._material.refractionRatio;
            child.material.shininess = this._material.shininess;

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

          child.material.reflectivity = this._material.reflectivity;
          child.material.refractionRatio = this._material.refractionRatio;
          child.material.shininess = this._material.shininess;

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
  Vinyl.prototype.updateBoundingBox = function () {

    this._boundingBox = new THREE.Box3().setFromObject(this._currentObject);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.updateTexture = function (texture, image) {

    if (!texture || !image) {
      return;
    }
    
    texture.image = image;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    return texture;
  };

  //--------------------------------------------------------------
  Vinyl.prototype._setTexture = function(part, type, image) {

    if (Vinyl.Part.VINYL === part) {
      if (Vinyl.ColorFormat.COLOR === this._colorFormat && 'color' === type) {
        console.error('Vinyl.setTexture: colormap is only available when color format is set to "texture"');
        return;
      }
    }

    this._currentObject.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (-1 < child.name.toLowerCase().indexOf(part)) {          
          if ('alpha' == type) {
            child.material.alphaMap = this.updateTexture(new THREE.Texture(), image);
          } else if ('ao' === type) {
            child.material.aoMap = this.updateTexture(new THREE.Texture(), image);
          } else if ('bumpmap' === type) {
            child.material.bumpMap = this.updateTexture(new THREE.Texture(), image);
          } else if ('color' == type) {
            child.material.map = this.updateTexture(new THREE.Texture(), image);
          } else {
            return;
          }
  
          child.material.needsUpdate = true;
        }
      }
    });
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setAlphaMap = function(image) {
    
    if (!image) {
      return;
    }

    this._setTexture(Vinyl.Part.VINYL, 'alpha', image);
  }

  //--------------------------------------------------------------
  Vinyl.prototype.setAoMap = function(image) {
    
    if (!image) {
      return;
    }

    this._setTexture(Vinyl.Part.VINYL, 'ao', image);
  }

  //--------------------------------------------------------------
  Vinyl.prototype.setBumpMap = function(image) {
    
    if (!image) {
      return;
    }

    this._setTexture(Vinyl.Part.VINYL, 'bumpmap', image);
  }

  //--------------------------------------------------------------
  Vinyl.prototype.setColorMap = function(image) {
    
    if (!image) {
      return;
    }

    this._setTexture(Vinyl.Part.VINYL, 'color', image);
  }

  //--------------------------------------------------------------
  Vinyl.prototype.setLabelAoMap = function(image) {
    
    if (!image) {
      return;
    }

    if (Vinyl.Format.NORMAL === this._format || Vinyl.Format.HEAVY === this._format) {
      console.error('Vinyl.setLabelAoMap: label texture is only available for formats with labels. current format is "' + this._format + '"');
      return;
    }

    this._setTexture(Vinyl.Part.LABEL, 'ao', image);
  }

  //--------------------------------------------------------------
  Vinyl.prototype.setLabelBumpMap = function(image) {
    
    if (!image) {
      return;
    }

    if (Vinyl.Format.NORMAL === this._format || Vinyl.Format.HEAVY === this._format) {
      console.error('Vinyl.setLabelBumpMap: label texture is only available for formats with labels. current format is "' + this._format + '"');
      return;
    }

    this._setTexture(Vinyl.Part.LABEL, 'bumpmap', image);
  }

  //--------------------------------------------------------------
  Vinyl.prototype.setLabelColorMap = function(image) {
    
    if (!image) {
      return;
    }

    if (Vinyl.Format.NORMAL === this._format || Vinyl.Format.HEAVY === this._format) {
      console.error('Vinyl.setLabelColorMap: label texture is only available for formats with labels. current format is "' + this._format + '"');
      return;
    }

    this._setTexture(Vinyl.Part.LABEL, 'color', image);
  }

  //--------------------------------------------------------------
  Vinyl.prototype.updateFormat = function(weight, isEnableLabel) {

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

    if (!this._currentObject) {
      return;
    }

    this._loadModel(this._size, this._format);
  }

  //--------------------------------------------------------------
  Vinyl.prototype.setBumpScale = function(value) {

    this._bumpScale = value;

    this._currentObject.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.bumpScale = this._bumpScale;
        child.material.needsUpdate = true;
      }
    });
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setAoMapIntensity = function(value) {

    this._currentObject.traverse((child) => {
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
      return Promise.reject(new Error('Vinyl.setSize: no size specified'));
    }

    size += '';

    if (-1 === Object.values(Vinyl.Size).indexOf(size)) {
      console.warn('Vinyl.setSize: invalid size "' + size + '"');
      return Promise.reject(new Error('Vinyl.setSize: invalid size "' + size + '"'));
    }

    if (this._size === size) {
      console.info('Vinyl.setSize: already set to size ' + size);
      return Promise.resolve(this);
    }

    this._size = size;

    return this._loadModel(this._size, this._format);
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

    if (this._colorFormat === format) {
      return;
    }
    
    this._colorFormat = format;

    if (Vinyl.ColorFormat.COLOR === this._colorFormat) {
      this._material = Vinyl.Color.CLASSIC_BLACK;
    } else {
      this._material = Vinyl.Color.WHITE;
    } 

    this._loadModel(this._size, this._format)
      .then(() => {
        this.setOpacity(this._material.opacity);
      });
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

    this._material = Vinyl.Color[color];

    if (this._colorFormat === Vinyl.ColorFormat.SPECIAL) {
      this._material.color = 0xffffff;
      this._material.opacity = 0.8;
      this._material.reflectivity = 0.1;
    }

    this._currentObject.traverse((child) => {

      if (child instanceof THREE.Mesh) {
        if ('vinyl' === child.name) {
          child.material.color = this._material.color;
          child.material.opacity = this._material.opacity;
          child.material.reflectivity = this._material.reflectivity;
          child.material.refractionRatio = this._material.refractionRatio;
          child.material.shininess = this._material.shininess;
        }
      }
    });
  };

  //--------------------------------------------------------------
  Vinyl.prototype.enableLabel = function () {

    this._label = true;
    this._format = this.updateFormat(this._weight, this._label);
    
    return this._loadModel(this._size, this._format);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.disableLabel = function () {
    
    this._label = false;
    this._format = this.updateFormat(this._weight, this._label);
    
    return this._loadModel(this._size, this._format);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setOpacity = function(to, duration, delay) {

    duration = undefined !== duration ? duration : 1000;
    delay = undefined !== delay ? delay : 0;

    this._currentObject.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        var tween = new TWEEN.Tween(child.material);
        child.material.opacity = 0;
        
        new TWEEN.Tween(child.material)
          .stop()
          .delay(delay)
          .to({ opacity: to }, duration)
          .onUpdate((progress) => {
            if ('label' === child.name) {
              child.material.opacity = progress;
            }

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
      return Promise.reject(new Error('Vinyl.setWeight: unknown weight value "' + weight + '"'));
    }
    
    if (this._weight === weight) {
      return Promise.resolve(this);
    }

    this._weight = weight;
    this._format = this.updateFormat(this._weight, this._label);

    return this._loadModel(this._size, this._format);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setVisibility = function(visibility) {

    this._currentObject.visible = visibility;
    this._visibility = visibility;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setCoveredRatio = function (ratio, offsetX, offsetY) {

    this._coveredRatio = Math.max(0, Math.min(1.0, ratio));
    this._offsetX = offsetX || 0;
    this._offsetY = offsetY || 0;
    
    const dist = this._boundingBox.max.x * (2 * this._coveredRatio + 1) - this._boundingBox.max.x;
    const x = this._basePosition.x + this._offsetX + dist * Math.cos(this._gatefoldAngle);
    const y = this._basePosition.y + this._offsetY + dist * Math.sin(this._gatefoldAngle);

    this._currentObject.position.set(x, y, this._basePosition.z);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.getCoveredRatio = function () {

    return this._coveredRatio;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setRotationZ = function (angle /* in radians */, offsetX, offsetY) {

    this._gatefoldAngle = angle;

    const rotation = this._currentObject.rotation

    this._currentObject.rotation.set(rotation.x, rotation.y, this._gatefoldAngle);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setOffsetY = function (value) {

    this._offsetY = value;
    
    const pos = this._currentObject.position;
    this._currentObject.position.set(pos.x, this._offsetY, pos.z);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.setFrontSleevePositionAndAngle = function (vector, angle, offsetX) {

    offsetX = offsetX || 0;
    
    this._basePosition = vector;
    this._gatefoldAngle = angle;

    const dist = this._boundingBox.max.x * (2 * this._coveredRatio + 1) - this._boundingBox.max.x;
    const x = this._basePosition.x + 0.08 + dist * Math.cos(this._gatefoldAngle);
    const y = this._basePosition.y + dist * Math.sin(this._gatefoldAngle);
    const rotation = this._currentObject.rotation
    
    this._currentObject.position.set(x, y, this._basePosition.z);
    this._currentObject.rotation.set(rotation.x, rotation.y, this._gatefoldAngle);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.resetRotation = function (angle /* in radians */, offsetX, offsetY) {
    
        this._gatefoldAngle = 0;
    
        const rotation = this._currentObject.rotation
    
        this._currentObject.rotation.set(rotation.x, rotation.y, this._gatefoldAngle);
      };

  //--------------------------------------------------------------
  Vinyl.prototype.getCurrentProperties = function () {

    return {
      size: this._size,
      weight: this._weight,
      isEnableLabel: this._label,
      colorFormat: this._colorFormat,
      rpm: this._rpm
    };
  };

  //--------------------------------------------------------------
  Vinyl.prototype.getFormat = function () {
    
    return this._format;
  };

  //--------------------------------------------------------------
  Vinyl.prototype.getAssetName = function () {

    return this._assetName;
  };

  //--------------------------------------------------------------
  Vinyl.prototype._setVinylScale = function (scale) {

    this._currentObject.scale.y = scale;

    if (Vinyl.Format.NORMAL === this._format || Vinyl.Format.HEAVY === this._format) {
      return;
    }

    this._currentObject.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (-1 < child.name.toLowerCase().indexOf('label')) {
          child.scale.set(1.0, 2.5, 1.0);
        }
      }
    });
  };

  //--------------------------------------------------------------
  Vinyl.prototype.removeFromContainer = function () {
    
    this._container.remove(this._currentObject);
  };

  //--------------------------------------------------------------
  Vinyl.prototype.dispose = function () {

    this._currentObject.traverse((child) => {
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

    if (!this._currentObject) {
      return;
    }

    if (this._enableRotate) {
      let target = this._currentObject;
      let amount = this._clock.getDelta() * (Math.PI * (this._rpm / 60));

      this._currentObject.children.forEach(function (child) {
        let rotation = child.rotation.clone();
        
        if ('label' == child.name) {
          rotation.y += amount;
        } else {
          rotation.y -= amount;
        }
        
        child.rotation.set(rotation.x, rotation.y, rotation.z);
      });
      
    }
  };

  //--------------------------------------------------------------
  Vinyl.prototype._loadModel = function (size, format) {

    return new Promise((resolve, reject) => {

      const targets = [];
  
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
      })(this._paths.textures[size][format]);
  
      // テクスチャをロード
      Promise.all(targets.map((target) => {
        return this._loader.loadAsset(target);
      }))
        .then((results) => {
          console.log('loaded textures  ------', results);
  
          results.forEach((result) => {
  
            const assetType = result['assetType'];
            const textureType = result['textureType'];
            const assetKey = result['key'];
    
            console.log('Vinyl.setup: asset loaded', assetType, textureType, assetKey);
  
            if ('texture' === assetType) {
              if (this._isWithLabel()) {
                if (-1 < assetKey.toLowerCase().indexOf('forlabel')) {
                  console.log('update texture - label part', this._loader.assets[assetKey]);
                  this.updateTexture(this._textures[size][format][Vinyl.Part.LABEL][textureType], this._loader.assets[assetKey]);
                } else {
                  console.log('update texture - vinyl part', this._loader.assets[assetKey]);
                  this.updateTexture(this._textures[size][format][Vinyl.Part.VINYL][textureType], this._loader.assets[assetKey]);
                }
              } else {
                console.log('update texture', this._loader.assets[assetKey]);
                this.updateTexture(this._textures[size][format][textureType], this._loader.assets[assetKey]);
              }
            }
          });
  
          return this._loader.loadAsset({
            'assetType': 'model',
            'key': this._paths.models[size][format]
          });
        })
        // モデルをロード
        .then((result) => {
          console.log('loaded model  ------', result);
          
          const assetType = result['assetType'];
          const textureType = result['textureType'];
          const assetKey = result['key'];
  
          if ('model' === assetType) {
            const obj = this._loader.assets[assetKey];
            
            const scale = 5.5;  
            const assetName = 'vinyl-' + size + '-' + format;
        
            this._opacity = 0;

            let position = new THREE.Vector3(0, 0, 0);
            
            if (this._currentObject) {
              position = this._currentObject.position;

              this.removeFromContainer();
              this.dispose();
            }

            obj.assetName = assetName;
            obj.scene.assetName = assetName;
        
            if (this._textures[size][format]) {
              this._textures[size][format].assetName = assetName;
            }
  
            this.initMaterial(obj, this._textures[size][format]);
        
            this._currentObject = obj.scene.clone();
            this._currentObject.scale.set(scale, scale, scale);
        
            this._currentObject.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = child.material.clone();
              }
            });
        
            this._setVinylScale(0.99);
            this.updateBoundingBox();
            this.setOffsetY(this._offsetY);
            this.setVisibility(this._visibility);

            this._currentObject.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = child.material.clone();
        
                if (this._isWithLabel()) {
                  if (Vinyl.Part.VINYL === child.name) {
                    child.material.bumpScale = this._bumpScale;
                    child.material.color = this._material.color;
                    child.material.reflectivity = this._material.reflectivity;
                    child.material.refractionRatio = this._material.refractionRatio;
                    child.material.shininess = this._material.shininess;
                  } else if (Vinyl.Part.LABEL === child.name) { 
                    child.material.bumpScale = this._bumpScale;
                    child.material.color = Vinyl.Color.WHITE.color;
                    child.material.reflectivity = 0;
                    child.material.refractionRatio = 0;
                    child.material.shininess = 5;
                  }
                } else {
                  child.material.bumpScale = this._bumpScale;
                  child.material.color = this._material.color;
                  child.material.reflectivity = this._material.reflectivity;
                  child.material.refractionRatio = this._material.refractionRatio;
                  child.material.shininess = this._material.shininess;
                }
                
                
                child.material.needsUpdate = true;
              }
            });

            this.setFrontSleevePositionAndAngle(this._basePosition, this._gatefoldAngle);
            
            this._container.add(this._currentObject);
            this._currentObject.position.set(position.x, position.y, position.z);
        
            this.setOpacity(this._material.opacity, 1000, 250);
          }

          resolve(this);
        });
    });
  };

  //--------------------------------------------------------------
  Vinyl.prototype._isWithLabel = function () {

    if (Vinyl.Format.WITH_LABEL === this._format || Vinyl.Format.HEAVY_WITH_LABEL === this._format) {
      return true;
    }

    return false;
  };

})(this, (this.qvv = (this.qvv || {})));
