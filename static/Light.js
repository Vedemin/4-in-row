class Light {
  constructor() {
    var container = new THREE.Object3D();
    var light = new THREE.SpotLight(0xffffff, 3.5, 1300, Math.PI, 1);
    light.position.set(-500, 500, -500);
    light.rotation.x = Math.PI / 2;
    light.castShadow = true;

    var light2 = new THREE.SpotLight(0xffffff, 3.5, 1300, Math.PI, 1);
    light2.position.set(500, 500, 500);
    light2.rotation.x = -Math.PI / 2;
    light2.castShadow = true;

    container.add(light, light2);
    return container;
  }
}
