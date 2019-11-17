var getMain = function(req, res) {
	res.render('login.ejs', {req: req});
}

var getFood = function(req, res) {
	res.render('food.ejs', {});
}


var routes = {
	getMain: getMain
}

module.exports = routes;