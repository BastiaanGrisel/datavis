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

router.get("/locations/:match/:start_time/:end_time", function(request, response) {
	var match 		= request.params.match;
	var start_time 	= request.params.start_time;
	var end_time 	= request.params.end_time;

	getLocations(match, start_time, end_time, function(err, records) {
		if(err) response.writeHead(500);

		response.writeHead(200, {"Content-Type": "text/json", "Access-Control-Allow-Origin": "*"});
		response.write(JSON.stringify(records));
		response.end();
	});
});

router.get("/timepoints/:match", function(request, response) {
	var match = request.params.match;
	var timepoint = request.params.timepoint;

	getTimepoints(match, function(err, records) {
		if(err) response.writeHead(500);

		response.writeHead(200, {"Content-Type": "text/json", "Access-Control-Allow-Origin": "*"});
		response.write(JSON.stringify(records));
		response.end();
	});
});

function getLocations(match, start_time, callback) {
	getLocations(match, start_time, start_time, callback);
}

function getLocations(match, start, end, callback) {
	var match 		= parseInt(match);
	var start_time 	= parseInt(start) < parseInt(end) ? parseInt(start) : parseInt(end);
	var end_time 	= parseInt(start) < parseInt(end) ? parseInt(end) : parseInt(start);
	var timepoints  = [];

	for(t = start_time; t <= end_time; t++)
		timepoints.push(t)

	console.log(start_time, end_time, timepoints)

	db.locations.find({'match': match, $or: timepoints.map(function(t) { return {'tsync': t}; }) }, callback);
}

function getMatches(callback) {
	db.locations.distinct('match', callback);
}

function getTimepoints(match, callback) {
	var match = parseInt(match);
	
	db.locations.distinct('tsync', { 'match': match }, callback);
}

server.listen(8888);