var keyvaluestore = require('./keyvaluestore.js');
var usersKVS = new keyvaluestore('Users');
var foodKVS = new keyvaluestore('Food');
usersKVS.init(function(err, data){});
foodKVS.init(function(err, data){});

//Check user credentials
var checkCreds = function(username, password, route_callback) {
  console.log('Checking credentials of ' + username);
  //Get username from database and compare password in value
  //If data is null then username does not exist
  usersKVS.get(username, function (err, data) {
    if (err) {
      route_callback(null, "Lookup error: "+err);
    } else if (data == null) {
      route_callback(false, null);
    } else {
      if (JSON.parse(data[0].value).password === password) {
        route_callback(true, null);
      } else {
        route_callback(false, null);
      }
    }
  });
};

var createAccount = function(username, pw, fullname, number, route_callback) {
  //Check if user is in database with get
  usersKVS.get(username, function (err, data) {
    if (err) {
      route_callback(null, "Lookup error: "+err);
    } else if (data == null) {
      var value = {
        password: pw,
        fullname: fullname,
        phoneNumber: number
      };
      console.log('Adding: ' + username);
      //Put user in database if not found
      usersKVS.put(username, JSON.stringify(value), function(err, data) {
        if (err) {
          console.log("Oops, something went wrong when adding the new user: " + err);
        }
      });
      route_callback(true, null);
    } else {
      route_callback(false, null);
    }
  });
}

var addFood = function(area, info, route_callback) {
  //Put new review in restaraunt database
  console.log('Adding: ' + area);
  foodKVS.put(area, JSON.stringify(info), function(err, data) {
    if (err) {
      console.log("Oops, something went wrong when adding the restaraunt: " + err);
    } else {
      route_callback(true, null);
    }
  });
}

var getFood = function(route_callback) {
  //Get food data
  foodKVS.getData(function(err, data) {
    if (err) {
      route_callback(null, 'Error getting table data: ' + err);
    } else if (data == null) {
      route_callback(null, 'Table data is null!');
    } else {
      route_callback(data, null);
    }
  })
}

var getUsers = function(route_callback) {
  //Get users data
  usersKVS.getUsers(function(err, data) {
    if (err) {
      route_callback(null, 'Error getting table data: ' + err);
    } else if (data == null) {
      route_callback(null, 'Table data is null!');
    } else {
      route_callback(data, null);
    }
  })
}

var database = { 
  checkCreds: checkCreds,
  createAccount: createAccount,
  getFood: getFood,
  addFood: addFood,
  getUsers: getUsers
};

module.exports = database;