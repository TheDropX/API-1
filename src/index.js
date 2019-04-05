//* Load .env
require('dotenv').load();

//* Import stuff
var express = require('express'),
	debug = require('./util/debug'),
	app = express(),
	pages = require('./pages.json');

//* Set API Headers
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

//* Trim trailing slash
require('./util/slasher')(app);

//* Loading pages
debug.info(`Found ${pages.length} API endpoints`);

pages.forEach((page) => {
	app.get(`/${page.path}/`, require(`./pages/${page.file}`));
});

//* Return 404 on non existant paths
app.use(function(req, res) {
	//* Set headers
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({ error: 404, message: 'Not Found' }));
});

//* Update languages in database
require('./util/langUpdater')();
setInterval(require('./util/langUpdater'), 5 * 60 * 1000);

var listener = app.listen(3001, function() {
	debug.success(`PreMiD API listening on port ${listener.address().port}!`);
});
