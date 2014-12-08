var http 	= require("http"),
	mongojs = require("mongojs"),
	Router 	= require('node-simple-router'),
	router 	= new Router(),
	db 		= mongojs.connect("mongodb://localhost:27017/dota", ["locations", "distances", "zones"]),
	server 	= http.createServer(router);

router.get("/matches", function(request, response) {

	db.locations.distinct('match', function(err, records) {
		if(err) response.writeHead(500);

		response.writeHead(200, {"Content-Type": "text/json"});
		response.write(JSON.stringify(records));
		response.end();
	});

});

server.listen(8888);