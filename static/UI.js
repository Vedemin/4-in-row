class UI {
  constructor() {
    this.selected = new THREE.Mesh();
    this.unselectedMaterial = new THREE.MeshBasicMaterial({
      wireframe: false,
      color: 0x5555aa,
      transparent: true,
      opacity: 0
    });
    this.selectedMaterial = new THREE.MeshBasicMaterial({
      wireframe: false,
      color: 0x5555aa,
      transparent: true,
      opacity: 0.25
    });
    this.ghostBoi = new Thing("ghost");
    this.pawnArray = [];
    this.thingPropperPos;
    this.currentThing;
    this.animFactor = 1;
  }

  checkForWin(data) {
    if (data == "not_moved") {
      // console.log("not_moved")
    } else {
      data = JSON.parse(data);
      console.log("MOVED!");
      console.log(data.column);
      console.log(data.height);
      if (playerNumber == 1) ui.dropTheThing(data.column - 3, data.height, 2);
      else if (playerNumber == 2) ui.dropTheThing(data.column - 3, data.height, 1);
      if (data.win != "_") {
        won = true;
        $("#messageBox").css("opacity", 1);
        $("#messageBox").css("z-index", "3");
        $("#messageBox").text(data.win + " won!");
        net.getDatabase();
      }
    }
  }

  showNewPlayerMessages(loggedUserData) {
    $("#messageBox").css("opacity", 1);
    $("#messageBox").css("z-index", "3");
    if (loggedUserData.colour == "error") {
      $("#messageBox").text("Hello " + loggedUserData.userLogged + "! 2 players are already playing, please try again later");
    } else if (loggedUserData.colour == "nonUnique") {
      $("#messageBox").text("Hello " + loggedUserData.userLogged + "! There is already a player going by your chosen nickname, please choose a different one.");
    } else {
      var text = "Hello " + loggedUserData.userLogged + ", you are playing " + loggedUserData.colour;

      if (loggedUserData.colour == "white") {
        text += " Waiting for second user...";
        playerNumber = 1;
      }
      $("#messageBox").text(text);

      if (loggedUserData.colour == "black") {
        playerNumber = 2;
        setTimeout(function() {
          $("#messageBox").text("");
          $("#messageBox").css("opacity", 0);
          $("#messageBox").css("z-index", "-3");
        }, 10000);

        camera.position.set(0, 20, -40);
        camera.lookAt(0, 20, 0);
      }

      if (loggedUserData.colour == "white") {
        timothy = setInterval(net.getUserAmount, 500);
        camera.position.set(0, 20, 40);
        camera.lookAt(0, 20, 0);
      } else {
        // game.buildPawns("both");
      }
    }
    if (
      !$("#messageBox")
        .text()
        .includes("There is already a player going by your chosen nickname, please choose a different one.")
    ) {
      $("#loginWindow").css("opacity", 0);
      $("#loginWindow").css("z-index", -20);
    }
  }

  bothUsersPresent() {
    $("#messageBox").css("opacity", 1);
    $("#messageBox").css("z-index", "3");
    $("#messageBox").text(
      $("#messageBox")
        .text()
        .substr(0, $("#messageBox").text().length - 26) + " Second user joined!"
    );

    setTimeout(function() {
      $("#messageBox").text("");
      $("#messageBox").css("opacity", 0);
      $("#messageBox").css("z-index", "-3");
    }, 10000);
    // game.buildPawns("black");
  }

  placeGhost() {
    scene.remove(ui.ghostBoi, true);
    if (playerNumber == 1) {
      ui.ghostBoi.material.color.setHex(0xdddddd);
    } else if (playerNumber == 2) {
      ui.ghostBoi.material.color.setHex(0x111111);
    }
    for (let i = 0; i < 5; i++) {
      if (game.board[i][game.column] == 0) {
        scene.add(ui.ghostBoi);
        ui.ghostBoi.position.set(-15 + 5 * game.column, 5 * i + 2.5, 0);
        break;
      }
    }
  }

  selectPawn(mouseVector, raycaster, camera, scene) {
    mouseVector.x = (event.clientX / $("#root").width()) * 2 - 1;
    mouseVector.y = -(event.clientY / $("#root").height()) * 2 + 1;
    raycaster.setFromCamera(mouseVector, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      if (intersects[0].object.name[0] == "r") {
        game.column = parseInt(intersects[0].object.name.slice(1)) + 3;
        ui.placeGhost();
      }
    }
  }

  clickColumn(mouseVector, raycaster, camera, scene) {
    if (lastPlayer != playerNumber && won == false) {
      mouseVector.x = (event.clientX / $("#root").width()) * 2 - 1;
      mouseVector.y = -(event.clientY / $("#root").height()) * 2 + 1;
      raycaster.setFromCamera(mouseVector, camera);
      var intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        if (intersects[0].object.name[0] == "r") {
          if (intersects[0].object.name[1] != "-") {
            net.dropThing(parseInt(intersects[0].object.name[1]), playerNumber);
          } else {
            net.dropThing(parseInt(intersects[0].object.name[1] + intersects[0].object.name[2]), playerNumber);
          }
          anthony = setInterval(net.checkForMove, 1000);
        }
      }
    }
  }

  dropTheThing(column, arr, player) {
    console.log("Dropping...");
    var thing = new Thing(player);
    lastPlayer = player;
    thing.position.y = 35;
    thing.position.x = column * 5;
    ui.thingPropperPos = { x: column * 5, y: arr * 5 + 3, z: 0 };
    ui.currentThing = thing;
    scene.add(thing);
    net.getArray();
    ui.ghostBoi.position.y += 5;
  }

  trick() {
    net.getDatabase();
  }

  placeThings(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (arr[i][j] != 0) {
          let thing = new Thing(arr[i][j]);
          scene.add(thing);
          thing.position.set(-15 + j * 5, 5 * i + 2.5, 0);
        }
      }
    }
  }

  helpClick() {
    $("#help").click(function() {
      $(this).css("display", "none");
      $("#helpopen").css("display", "block");
      ui.helpClose();
    });
  }

  helpClose() {
    $("#close").click(function() {
      $("#help").css("display", "block");
      $("#helpopen").css("display", "none");
    });
  }
}
