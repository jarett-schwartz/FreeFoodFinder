const accountSid = '';
const authToken = '';
const client = require('twilio')(accountSid, authToken);

var db = require('../../db/database.js');

var getMain = function(req, res) {
	if (req.query.message == null) {
    req.query.message = "";
  }
  res.render('login.ejs', {req: req});
  req.session.user = '';
}

var submitLogin = function(req, res) {
	var username = req.body.username;
  req.session.user = username;
	var password = req.body.password;
  db.checkCreds(username, password, function(data, err) {
    if (err) {
      res.redirect('/?message=The following error occured: ' + err);
    } else if (!data) {
      res.redirect('/?message=These username and password does not match any in the database');
    } else {
      res.redirect('/food');
    }
  });
}

//Signup route
var getSignup = function(req, res) {
  if (req.query.message == null) {
    req.query.message = "";
  }
  res.render('signup.ejs', {req: req});
}

var createAccount = function(req, res) {
  var username = req.body.username;
  req.session.user = username;
  var pw = req.body.password;
  var fullname = req.body.name;
  var number = req.body.number;
  if (number.length !== 10 || isNaN(number)) {
  	res.redirect('/signup?message=Please enter a 10 digit phone number with a country code ' + 
  		'(e.g. 11234567890)');
  }
  db.createAccount(username, pw, fullname, number, function(data, err){
    if (err) {
      res.redirect('/signup?message=The following error occured: ' + err);
    } else if (!data) {
      res.redirect('/signup?message=Failed to create account');
    } else {
      res.redirect('/food');
    }
  })
}

var addFood = function(req, res) {
  const t = new Date();
  var info = {
    location: req.body.loc,
    type: req.body.type,
    description: req.body.notes,
    time: JSON.stringify(t),
    creator: req.session.user
  }
  db.getUsers(function(data, err) {
  	if (err) {
  	  console.log('Could not message users: ' + err);
  	} else {
  		let numbers = [];
  		console.log(data);
  		data.forEach(function(e) {
  			numbers.push('+' + JSON.parse(e.value).phoneNumber);
  		})
  		const msg = 'A user has just posted about free food!' 
  			+ '\nFood type: ' + info.type + '\nArea: ' + req.body.area
  			+ '\nLocation: ' + info.location + '\nAdditional notes: ' + info.description;
  		sendMessages(numbers, msg);
  	}
  })
  db.addFood(req.body.area, info, function(data, err){
    if (err) {
      res.redirect('/food');
      console.log('Error occurred: ' + err);
    } else if (!data) {
      res.redirect('/food' + err);
      console.log('Error adding entry');
    } else {
      res.redirect('/food');
    }
  })
}

function sendMessages(nums, msg) {
	console.log('here');
	console.log(nums);
	nums.forEach(function(e) {
		client.messages
  			.create({
     			body: msg,
     			from: '+17146563421',
     			to: e
   			})
  			.then(message => console.log(message.sid));
	});
}

//Renders restaraunt reviews on page
var getFood = function(req, res) {
  /*if (!req.session.user) {
    res.redirect('/');
    return;
  }*/
  db.getFood(function(data, err) {
    if (err) {
      res.render('food.ejs', {error: 'Error loading: ' + err, food: null, info: null, user: username, time: null});
    } else {
      var foodList = [];
      var infoList = [];
      var timeStamps = [];
      const currTime = new Date();
      data.forEach(function(e) {
          var d = new Date(JSON.parse(JSON.parse(e.value).time));
          const tDiff = Math.abs(d - currTime);
          // Only show free food post < 3 hours prior
          if (tDiff < 10800000) {
          	timeStamps.push(d.toTimeString().substring(0, 5));
          	foodList.push(e.key);
          	ifnfoList.push(JSON.parse(e.value));
          }
      })
      var username = [req.session.user];
      res.render('food.ejs', {error: '', food: foodList, info: infoList, user: username, time: timeStamps});
    }
  })
}


var routes = {
	getMain: getMain,
	getFood: getFood,
	checkLogin: submitLogin,
	getSignup: getSignup, 
	createAccount: createAccount,
	addFood: addFood
}

module.exports = routes;