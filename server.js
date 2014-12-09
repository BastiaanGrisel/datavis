var http 	= require("http"),
	mongojs = require("mongojs"),
	Router 	= require("node-simple-router"),
	router 	= new Router(),
	swig 	= require("swig"),
	db 		= mongojs.connect("mongodb://localhost:27017/dota", ["locations", "distances", "zones"]),
	server 	= http.createServer(router);


// Serve grid 
router.get("/grid", function(request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});

	getMatches(function onMatches(err, records) {
		var matches = records;

		getTimepoints(matches[0], function onTimepoints(err, records) {
			var timepoints = records;

			var html = swig.renderFile("grid.html", {
				selected_match: matches[0],
				selected_timepoint: timepoints[0],
				matches: matches,
				timepoints: timepoints
			});

			response.write(html);
			response.end();
		});
	});
});

router.get("/matches", function(request, response) {

	db.locations.distinct('match', function(err, records) {
		if(err) response.writeHead(500);

		response.writeHead(200, {"Content-Type": "text/json", "Access-Control-Allow-Origin": "*"});
		response.write(JSON.stringify(records));
		response.end();
	});

});

function getMatches(callback) {
	db.locations.distinct('match', callback);
}

function getTimepoints(match, callback) {
	db.locations.distinct('tsync', { 'match': match }, callback);
}

server.listen(8888);