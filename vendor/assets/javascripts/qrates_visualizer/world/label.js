
//= require tdmsinc-three.js
//= require_self

(function(global, exports) {

  exports.world = exports.world || {};
  exports.world.Label = Label;

  //--------------------------------------------------------------
  function Label() {

  }

  Label.prototype.setup = function(scene, assets, opts) {
    this._opts = opts || {
      size: 7
    };

    this._scene = scene;
    this._size = this._opts.size.toString();
    this._largeHole = false;

    this._smallHoleFront = assets['assetsModelLabelFrontSmall-7'];
    this._smallHoleBack = assets['assetsModelLabelBackSmall-7'];
    this._largeHoleFront = assets['assetsModelLabelFrontLarge-7'];
    this._largeHoleBack = assets['assetsModelLabelBackLarge-7'];

    this._front = {
      '7' : this._smallHoleFront,
      '10': assets['assetsModelLabelFront-10'],
      '12': assets['assetsModelLabelFront-12'],
      current: null
    };

    this._back = {
      '7' : this._smallHoleBack,
      '10': assets['assetsModelLabelBack-10'],
      '12': assets['assetsModelLabelBack-12'],
      current: null
    };

    this._front.current = this._front[this._size];
    this._back.current = this._back[this._size];

    this._frontTexture = new THREE.Texture();
    this._backTexture  = new THREE.Texture();

    this.updateTexture(this._frontTexture, assets['assetsTextureLabelFront']);
    this.updateTexture(this._backTexture, assets['assetsTextureLabelBack']);

    this.initMaterial(this._front.current, this._frontTexture);
    this.initMaterial(this._back.current, this._backTexture);

    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);

    this._scene.add(this._front.current);
    this._scene.add(this._back.current);

    var self = this;
    Object.keys(this._back).forEach(function(key) {
      self._back[key].rotation.z = self.rotation.z + Math.PI;
    });
  };

  Label.prototype.initMaterial = function(obj, tex) {
    obj.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({
          ambient: 0xFFFFFF,
          color: 0xFFFFFF,
          map: tex,
          shininess: 5,
          specular: 0x363636,
          shading: THREE.SmoothShading,
          vertexColor: THREE.VertexColors
        });
      }
    });

    return obj;
  };

  Label.prototype.updateTexture = function(tex, img) {
    if (!tex || !img) {
      return;
    }

    tex.image = img;
    tex.needsUpdate = true;
  };

  Label.prototype.setSize = function(size) {
    if (!size) {
      return;
    }

    console.log('Label::setSize', size);

    this._scene.remove(this._front.current);
    this._scene.remove(this._back.current);

    this._size = size.toString();

    this._front.current = this._front[this._size];
    this._back.current = this._back[this._size];

    this.initMaterial(this._front.current, this._frontTexture);
    this.initMaterial(this._back.current, this._backTexture);

    this._scene.add(this._front.current);
    this._scene.add(this._back.current);
  };

  Label.prototype.setLargeHole = function(value) {
    if ('7' !== this._size) {
      return;
    }

    this._scene.remove(this._front.current);
    this._scene.remove(this._back.current);

    this._largeHole = value;

    this._front['7'] = this._largeHole ? this._largeHoleFront : this._smallHoleFront;
    this._back['7'] = this._largeHole ? this._largeHoleBack : this._smallHoleBack;
    this._front.current = this._front['7'];
    this._back.current = this._back['7'];

    this.initMaterial(this._front.current, this._frontTexture);
    this.initMaterial(this._back.current, this._backTexture);

    this._scene.add(this._front.current);
    this._scene.add(this._back.current);
  };

  Label.prototype.setTexture = function(sideA, sideB) {
    if (sideA) {
      this.updateTexture(this._frontTexture, sideA);
    }

    if (sideB) {
      this.updateTexture(this._backTexture, sideB);
    }
  };

  Label.prototype.setVisible = function(value) {
    this._front[this._size].visible = this._back[this._size].visible = value;
  };

  Label.prototype.update = function() {
    if (!(this._front && this._back)) {
      return;
    }

    this._front[this._size].position.set(this.position.x, this.position.y, this.position.z);
    this._back[this._size].position.set(this.position.x, this.position.y, this.position.z);
    this._front[this._size].rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    this._back[this._size].rotation.set(this.rotation.x, this.rotation.y, this.rotation.z + Math.PI);
  };

})(this, (this.qvv = (this.qvv || {})));
