var express = require('express'),
	Report = require('./lib/report');

var app = express();
app.set('port', (process.env.PORT || 5000))
app.set("view options", {layout: false});
app.set('views', __dirname + '/public');
app.use(express.static(__dirname + '/public'));

app.use(errorHandler);


app.get('/', function (req, res) {
 	res.render('index.html');
})

function errorHandler(err, req, res, next) {
	res.status(500);
	res.render('error', { error: err });
}

app.get('/api/report', function (req, res) {
	var xpub = req.query.xpub;
	var numDerivations = req.query.derivations;

	var report = new Report();
	report.run(xpub, numDerivations).then(function(data) {
		res.send(data);
	}).catch(function(e) {
		res.status(500).send(e.message ? e.message : e);
	})
});

var server = app.listen(app.get('port'), function () {
	var host = server.address().address
	var port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port)
});