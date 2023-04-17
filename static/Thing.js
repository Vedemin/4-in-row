class Thing {
  constructor(colour) {
    this.thingGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.25, 32);

    var material;
    if (colour == 1) {
      material = game.whiteMaterial;
    } else if (colour == 2) {
      material = game.blackMaterial;
    } else if (colour == "ghost") {
      material = game.ghostMaterial;
    }
    var thing = new THREE.Mesh(this.thingGeometry, material);
    thing.rotation.x = Math.PI / 2;
    thing.position.y = 3;
    thing.name = "P_" + colour;
    //thing.translate(0, -2.5, 0);

    return thing;
  }
}
