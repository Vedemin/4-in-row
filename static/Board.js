class Board {
  constructor() {
    this.container = new THREE.Object3D();
    // this.material = new THREE.MeshNormalMaterial();
  }

  loadModel() {
    var loader = new THREE.OBJLoader();

    loader.load("mats/model.obj", function (mod) {
      var material = new THREE.MeshStandardMaterial({
        color: 0xa51616,
        side: THREE.DoubleSide,
        emisive: 0x0,
        roughness: 0.5,
        metalness: 0
      });
      mod.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
      scene.add(mod);
    });

    for (var i = -3; i < 4; i++) {
      var geometry = new THREE.BoxGeometry(5, 50, 1);

      var cube = new THREE.Mesh(geometry, ui.unselectedMaterial);
      cube.position.x = 5 * i;
      cube.position.y = 25;
      cube.name = "r" + i;
      scene.add(cube);
    }
  }
}
