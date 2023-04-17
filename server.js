var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var mongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
var _db;
var turns = 0;

var userArray = [];
var thingArray = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
var lastColumn = { player: 0, ready: false, column: 0, height: 0, win: "_" }

var server = http.createServer(function (req, res) {
  // console.log(req.method);
  switch (req.method) {
    case "GET":
      var resAddress = "static" + req.url;
      var resType;
      var substring = req.url.slice(req.url.indexOf(".") + 1, req.url.length);

      if (req.url == "/") {
        fs.readFile("static/index.html", function (error, data) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        });
      } else if (substring == "html" || substring == "css" || substring == "JSON" || substring == "json") {
        fs.readFile(resAddress, function (error, data) {
          res.writeHead(200, { "Content-Type": "text/" + substring });
          res.write(data);
          res.end();
        });
      } else if (substring == "js") {
        fs.readFile(resAddress, function (error, data) {
          res.writeHead(200, { "Content-Type": "application/javascript" });
          res.write(data);
          res.end();
        });
      } else if (substring == "png") {
        fs.readFile(resAddress, function (error, data) {
          res.writeHead(200, { "Content-Type": "image/" + substring });
          res.write(data);
          res.end();
        });
      } else if (substring == "jpg") {
        fs.readFile(resAddress, function (error, data) {
          res.writeHead(200, { "Content-Type": "image/jpeg" });
          res.write(data);
          res.end();
        });
      } else if (substring == "obj") {
        fs.readFile(resAddress, function (error, data) {
          res.writeHead(200, { "Content-Type": "application/object" });
          res.write(data);
          res.end();
        });
      }
      break;
    case "POST":
      servResponse(req, res);
      break;
    default:
      break;
  }

  req.on("close", function () {
    console.log("Client has disconnected.");
  });
});

mongoClient.connect("mongodb://localhost/TarPrz", function (err, db) {
  if (err) console.log(err);
  else console.log("mongo podłączone!");
  _db = db;
});

function servResponse(req, res) {
  var allData = "";
  var result = { directories: [], files: [], sizes: [] };

  req.on("data", function (data) {
    allData += data;
  });

  req.on("end", function (alldata) {
    var parsedData = qs.parse(allData);

    switch (parsedData.action) {
      case "ADD_USER":
        addUserToArray(res, parsedData.user);
        break;
      case "REM_USER":
        removeUserFromArray(parsedData.user);
        break;
      case "GET_USER_AMOUNT":
        checkIfEnoughUsers(res);
        break;
      case "RESET_LOL":
        resetArraylol(res);
        break;
      case "MOD_ARRAY":
        dropThing(res, parsedData.column, parsedData.player)
        break;
      case "GET_ARRAY":
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(JSON.stringify(thingArray));
        break;
      case "CHK_MOV":
        returnLast(res, parsedData.player)
        break;
      case "DISCONNECT":
        console.log("player disconnects")
        disconnect(parsedData.player)
        break;
      case "GET_DATABASE":
        getDatabase(res)
        break;
    }
  });
}

function disconnect(player) {
  userArray.splice(player - 1, 1)
  console.log(userArray)
}

function getDatabase(res) {
  console.log("Getting database...")
  _db.createCollection("Records", function (err, coll) {
    coll.find({}).toArray(function (err, items) {
      res.writeHead(200, { "Content-Type": "text/json" });
      res.end(JSON.stringify(items))
      console.log(items)
    });
  });
}

function returnLast(res, player) {
  // console.log(lastColumn.ready)
  if (lastColumn.ready == true && player != lastColumn.player) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(JSON.stringify(lastColumn))
    lastColumn.ready = false
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("not_moved")
  }
}

function dropThing(res, column, player) {
  var foundIt = false
  for (var i = 0; i < 6 && !foundIt; i++) {
    if (thingArray[i][column] == 0) {
      foundIt = true
      thingArray[i][column] = parseInt(player)
      if (player == 1)
        turns++
      checkIfSomeoneWon(player)
      // console.log(thingArray)
      lastColumn.height = i
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(JSON.stringify(lastColumn));
      lastColumn.player = player
      lastColumn.column = column
      lastColumn.ready = true
    }
  }
}

function checkIfSomeoneWon(player) {
  for (var r = 0; r < 6; r++) {
    for (var i = 0; i < 4; i++) {
      if (thingArray[r][i] == thingArray[r][i + 1] && thingArray[r][i] == thingArray[r][i + 2] && thingArray[r][i] == thingArray[r][i + 3] && thingArray[r][i] != 0) {
        lastColumn.win = userArray[thingArray[r][i] - 1].user
        console.log("Horizontal win by " + userArray[thingArray[r][i] - 1].user)

        var winner = [userArray[thingArray[r][i] - 1].user]
        var loser
        if (winner == userArray[0].user)
          loser = userArray[1].user
        else
          loser = userArray[0].user
        _db.createCollection("Records", function (err, coll) {
          coll.insert({ turns: turns, winner: winner[0], loser: loser }, function (err, result) {
            console.log("Entry created...");
          });
        });
      }
    }
  }

  for (var i = 0; i < 7; i++) {
    for (var r = 0; r < 3; r++) {
      if (thingArray[r][i] == thingArray[r + 1][i] && thingArray[r][i] == thingArray[r + 2][i] && thingArray[r][i] == thingArray[r + 3][i] && thingArray[r][i] != 0) {
        lastColumn.win = userArray[thingArray[r][i] - 1].user
        console.log("Vertical win by " + userArray[thingArray[r][i] - 1].user)

        var winner = [userArray[thingArray[r][i] - 1].user]
        var loser
        if (winner == userArray[0].user)
          loser = userArray[1].user
        else
          loser = userArray[0].user
        _db.createCollection("Records", function (err, coll) {
          coll.insert({ turns: turns, winner: winner[0], loser: loser }, function (err, result) {
            console.log("Entry created...");
          });
        });
      }
    }
  }
}

function addUserToArray(res, user) {
  var isUserUnique = true;
  for (var i = 0; i < userArray.length; i++) {
    if (user == userArray[i].user) {
      isUserUnique = false;
    }
  }
  if (isUserUnique) {
    if (userArray.length < 2) {
      var userNumber = userArray.length
      userArray.push({ user: user, number: userNumber });
      console.log("Array length is " + userArray.length + ". This is the user array:");
      console.log(userArray);
      var result;
      if (userArray.length == 1) {
        result = { userLogged: user, colour: "white" };
      } else if (userArray.length == 2) {
        result = { userLogged: user, colour: "black" };
      }
    } else {
      console.log("Array length is " + userArray.length + ". This is the user array:");
      console.log(userArray);
      console.log("There are already 2 users playing");
      var result;
      result = { userLogged: user, colour: "error" };

      console.log(result);
    }
  } else {
    console.log("Array length is " + userArray.length + ". This is the user array:");
    console.log(userArray);
    console.log("Login not unique");
    var result;
    result = { userLogged: user, colour: "nonUnique" };
  }
  res.writeHead(200, { "Content-Type": "text/JSON" });
  res.end(JSON.stringify(result));
}

function removeUserFromArray(user) {
  for (var i = 0; i < userArray.length; i++) {
    if (user == userArray[i].user) {
      userArray.splice(i, 1);
    }
  }
}

function resetArraylol(res) {
  turns = 0;
  userArray = [];
  thingArray = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
  lastColumn = { player: 0, ready: false, column: 0, height: 0, win: "_" }
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("reset")
}

function checkIfEnoughUsers(res) {
  // console.log(userArray.length)
  if (userArray.length == 2) {
    var response = true;
    res.writeHead(200, { "Content-Type": "text/JSON" });
    res.end(JSON.stringify(response));
  } else {
    var response = false;
    res.writeHead(200, { "Content-Type": "text/JSON" });
    res.end(JSON.stringify(response));
  }
}

server.listen(3000, function () {
  console.log("serwer startuje na porcie 3000");
});
