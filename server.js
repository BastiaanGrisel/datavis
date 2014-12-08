var http = require("http"),
	mongojs = require("mongojs");

var db = mongojs.connect("mongodb://localhost:27017/dota", ["locations", "distances", "zones"]);

var server = http.createServer(requestHandler);

function requestHandler(request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	
	db.locations.distinct('match', function(err,records) {
		if(err) {
			console.log("There was an error executing the database query.");
			response.end();
			return;
		}
		var html = '<h2>Vehicles with a red finish</h2>',
		i = records.length;

		while(i--) {
			html += '<p>'+records[i]+'</p>';
		}
		response.write(html);
		response.end();
	})
}
		
server.listen(8888);