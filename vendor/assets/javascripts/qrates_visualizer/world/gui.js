//= require tdmsinc-three.js.js
//= require_self

((global, exports) => {

  class GUI {

    constructor(world) {
      this.gui = new window.dat.GUI();

      this.props = {
        general: {
          render: true,
          rotate: false,
          capture: () => {
            world.capture();
          }
        },
        camera: {
          reset: () => {
            world.resetCamera();
          },
          zoomIn: () => {
            world.zoomIn(1);
          },
          zoomOut: () => {
            world.zoomOut(1);
          }
        },
        sleeve: {
          visibility: true,
          bump: 0.3
        },
        vinyl_1: {
          visibility: true,
          bump: 0.3,
          cover: 0.5
        },
        vinyl_2: {
          visibility: true,
          bump: 0.3,
          cover: 0.75
        },
        light: {

        },
        'sleeve visibility': true,
        'vinyl 1 visibility': true,
        'vinyl 2 visibility': true,
        out: false,
        zoom: 1.0,
        'covered ratio 1': 1.0,
        'covered ratio 2': 0.5,
        'sleeve rot': 60,
        'sleeve front rot': 0,
        'sleeve back rot': 0,
        'sleeve bump': 0.3,
        'vinyl bump': 0.3,
        'sleeve ao': 1.0,
        'vinyl ao': 1.0,
        sleeveX: -15,
        'vinyl offsetY': 0
      };

      let folder_1 = this.gui.addFolder('general');
      folder_1.add(props.general, 'render');
      folder_1.add(props.general, 'rotate');
      folder_1.add(props.general, 'capture');

      let folder_2 = this.gui.addFolder('camera');
      folder_2.add(props.camera, 'reset');
      folder_2.add(props.camera, 'zoomIn');
      folder_2.add(props.camera, 'zoomOut');
    }
  }

  exports.world = exports.world || {};
  exports.world.GUI = GUI;

})(this, (this.qvv = (this.qvv || {})));