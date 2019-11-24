// Initialize DynamoDB tables

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var db = new AWS.DynamoDB();
var kvs = require('./keyvaluestore.js');

var async = require('async');

var userDBname = 'Users';
var username = 'user1';
var pw = {
	password: '123',
	fullname: 'Tester',
  phoneNumber: '12345'
};

var foodDBname = 'Food';
var area = 'Engineering';
var props = {
  type: 'donuts',
  description: 'A lot of them!',
  creator: 'user1',
  time: JSON.stringify(new Date())
};

// Upload initial data to DynamoDB

var uploadUser = function(table, callback) {
	console.log('Adding user1... ');
	table.put(area, JSON.stringify(pw), function(err, data) {
		if (err) {
			console.log('Oops, something went wrong when adding Tester: ' + err);
		}
	});
	callback();
}

var uploadFood = function(table, callback) {
  console.log('Adding donuts in Engineering... ');
  table.put(area, JSON.stringify(props), function(err, data) {
    if (err) {
      console.log('Oops, something went wrong adding donuts in engineering: ' + err);
    }
  });
  callback();
}

// Initialize the databases


var j = 0

function setupUsers(err, data) {
  j++;
  if (err && j != 2) {
    console.log('Error: ' + err); 
  } else if (j==1) {
    console.log('Deleting users table');
    db.deleteTable({'TableName': userDBname}, function(){
      console.log('Waiting 10s for the table to be deleted...')
      setTimeout(setupUsers, 10000)
    });
  } else if (j==2) {
    console.log('Creating users table');
    userTable = new kvs(userDBname);
    userTable.init(setupUsers);
    // *
  } else if (j==3) {
    console.log('Waiting 10s for the table to become active...')
    setTimeout(setupUsers, 10000)
  } else if (j==4) {
    console.log('Uploading')
    uploadUser(userTable, function() {
      console.log('Done with users table')
    })
  }
}

var k = 0

function setupFood(err, data) {
  k++;
  if (err && k != 2) {
    console.log('Error: ' + err); 
  } else if (k==1) {
    console.log('Deleting food table');
    db.deleteTable({'TableName': foodDBname}, function(){
      console.log('Waiting 10s for the table to be deleted...')
      setTimeout(setupFood, 10000)
    });
  } else if (k==2) {
    console.log('Creating food table');
    foodTable = new kvs(foodDBname);
    foodTable.init(setupFood);
  } else if (k==3) {
    console.log('Waiting 10s for the table to become active...')
    setTimeout(setupFood, 10000)
  } else if (k==4) {
    console.log('Uploading')
    uploadFood(foodTable, function() {
      console.log('Done with food table')
    })
  }
}

// Run initializations

setupUsers(null, null);
setupFood(null, null);
