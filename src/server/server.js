var express = require('express');
var routes = require('../routes/routes.js');
var app = express();

app.use(express.bodyParser());
app.use(express.logger("default"));


app.get('/', routes.getMain);
app.get('/food', routes.getFood);

app.listen(3000, () =>
	console.log('listening on port 3000'));