class Net {
  constructor() {
    console.log("Loaded NET");
  }

  addUser(user) {
    $.ajax({
      url: "/addUser",
      data: { action: "ADD_USER", user: user },
      type: "POST",
      success: function(data) {
        var loggedUserData = JSON.parse(data);
        console.log("Logging in");
        ui.showNewPlayerMessages(loggedUserData);
      },
      error: function(xhr, status, error) {
        console.log(xhr);
      }
    });
  }

  resetArray() {
    $.ajax({
      url: "/addUser",
      data: { action: "RESET_LOL" },
      type: "POST",
      success: function(data) {
        console.log("reset");
        $("#messageBox").css("opacity", 1);
        $("#messageBox").css("z-index", "3");
        $("#messageBox").text("Game restarted, please reload the page!");
      },
      error: function(xhr, status, error) {
        console.log(xhr);
      }
    });
  }

  getDatabase() {
    $.ajax({
      url: "/addUser",
      data: { action: "GET_DATABASE" },
      type: "POST",
      success: function(data) {
        console.log(data);
        $("#highScore").css("z-index", "30");
        $("#highScore").css("opacity", 1);
        $("#highList").html("");
        for (var i = 0; i < data.length; i++) {
          var inputText = $("#highList").html() + '<li><div class="turns">' + data[i].turns + '</div><div class="winner">' + data[i].winner + '</div><div id="loser">' + data[i].loser + "</div></li>";
          $("#highList").html(inputText);
        }
      },
      error: function(xhr, status, error) {
        console.log(xhr);
      }
    });
  }

  getUserAmount() {
    $.ajax({
      url: "/addUser",
      data: { action: "GET_USER_AMOUNT" },
      type: "POST",
      success: function(data) {
        console.log("Got user data! " + JSON.parse(data));
        if (JSON.parse(data) == true) {
          ui.bothUsersPresent();
          clearInterval(timothy);
        }
      },
      error: function(xhr, status, error) {
        console.log(xhr);
      }
    });
  }

  dropThing(column, player) {
    $.ajax({
      url: "/addUser",
      data: { action: "MOD_ARRAY", column: JSON.stringify(column + 3), player: JSON.stringify(player) },
      type: "POST",
      success: function(data) {
        var arr = JSON.parse(data);
        ui.dropTheThing(column, arr.height, playerNumber);
        if (arr.win != "_") {
          won = true;
          $("#messageBox").text("Wygrał " + arr.win);
        }
      },
      error: function(xhr, status, error) {
        console.log(xhr);
        console.log(status);
        console.log(error);
      }
    });
  }

  disconnect() {
    $.ajax({
      url: "/addUser",
      async: false,
      data: { action: "DISCONNECT", player: playerNumber },
      type: "POST",
      success: function(data) {},
      error: function(xhr, status, error) {
        console.log(xhr);
        console.log(status);
        console.log(error);
      }
    });
  }

  checkForMove() {
    // console.log("Check")
    $.ajax({
      url: "/addUser",
      data: { action: "CHK_MOV", player: playerNumber },
      type: "POST",
      success: function(data) {
        ui.checkForWin(data);
      },
      error: function(xhr, status, error) {
        console.log(xhr);
        console.log(status);
        console.log(error);
      }
    });
  }

  getArray(type) {
    $.ajax({
      url: "/addUser",
      data: { action: "GET_ARRAY" },
      type: "POST",
      success: function(data) {
        var arr = JSON.parse(data);
        ui.placeGhost();
        if (type == "first") {
          ui.placeThings(arr);
        } else {
          game.board = arr;
        }
      },
      error: function(xhr, status, error) {
        console.log(xhr);
        console.log(status);
        console.log(error);
      }
    });
  }
}
