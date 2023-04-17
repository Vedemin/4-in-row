var net = new Net();
var game = new Game();
var ui = new UI();
var timothy;
var anthony;
var selected;
var playerNumber;
var lastPlayer = 2;
var camera;
var won = false;

$(document).ready(function() {
  camera = new THREE.PerspectiveCamera(
    60, // kąt patrzenia kamery (FOV - field of view)
    $(window).width() / $(window).height(), // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
    0.1, // minimalna renderowana odległość
    10000 // maxymalna renderowana odległość od kamery
  );

  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x333333);
  renderer.setSize($(window).width(), $(window).height());

  $("#root").append(renderer.domElement); //dodanie renderera do diva

  camera.position.set(0, 30, 60);
  camera.lookAt(scene.position);

  hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemi.color.setHSL(0.6, 1, 0.6);
  hemi.groundColor.setHSL(0.095, 1, 0.75);
  hemi.position.set(0, 50, 0);

  var direct = new THREE.DirectionalLight(0xffffff, 1);
  direct.castShadow = true;
  direct.position.set(0, 70, 70);
  scene.add(hemi, direct);

  function Render() {
    requestAnimationFrame(Render);
    renderer.render(scene, camera);
    if (playerNumber == 2) {
      direct.position.set(0, 70, -70);
    } else if (playerNumber == 1) {
      direct.position.set(0, 70, 70);
    }
    if (ui.currentThing != undefined) {
      if (ui.currentThing.position.y != ui.thingPropperPos.y) {
        ui.currentThing.position.y -= ui.animFactor;
      }
    }
  }

  var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
  var mouseVector = new THREE.Vector2();

  $(document).mousemove(function(event) {
    ui.selectPawn(mouseVector, raycaster, camera, scene);
  });

  $(document).click(function(event) {
    ui.clickColumn(mouseVector, raycaster, camera, scene);
  });

  Render();
  var board = new Board();

  anthony = setInterval(net.checkForMove, 1000);

  board.loadModel();

  net.getArray("first");

  ui.helpClick();

  $(window).on("unload", function() {
    net.disconnect();
  });
});
