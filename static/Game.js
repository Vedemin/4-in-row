class Game {
  constructor() {
    this.board = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
    this.column = 0;

    this.whiteMaterial = new THREE.MeshBasicMaterial({
      color: 0xdddddd,
      transparent: false,
      opacity: 1.0
    });

    this.blackMaterial = new THREE.MeshBasicMaterial({
      color: 0x111111,
      transparent: false,
      opacity: 1.0
    });

    this.ghostMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5
    });

    this.fieldGeometry = new THREE.BoxGeometry(10, 10, 10);
  }
}
