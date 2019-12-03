var express = require('express');
var routes = require('./src/routes/routes.js');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(express.bodyParser());
app.use(express.logger("default"));
app.use(session({ secret: 'jschw1'}));
app.use(express.cookieParser());


app.get('/', routes.getMain);
app.get('/food', routes.getFood);
app.post('/checkLogin', routes.checkLogin);
app.get('/signup', routes.getSignup);
app.post('/createaccount', routes.createAccount);
app.get('/food', routes.getFood);
app.post('/addfood', routes.addFood);

app.listen(3000, () =>
	console.log('listening on port 3000'));

console.log('REMOVE AWS KEYS!');