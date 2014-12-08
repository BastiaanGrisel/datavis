var http = require("http"),
mongojs = require("mongojs");

var uri = "mongodb://demo_user:demo_password@ds027769.mongolab.com:27769/demo_database",
	db = mongojs.connect(uri, ["demo_collection"]);

var server = http.createServer(requestHandler);

function requestHandler(request, response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	db.demo_collection.find({"color": "red"}, function(err, records) {
		if(err) {
			console.log("There was an error executing the database query.");
			response.end();
			return;
		}
		var html = '<h2>Vehicles with a red finish</h2>',
		i = records.length;

		while(i--) {
			html += '<p><b>Name:</b> ' 
			+ records[i].name 
			+ ' <br /><b>Number of wheels:</b> ' 
			+ records[i].wheels 
			+ '<br /><b>Color: </b>' 
			+ records[i].color;
		}
		response.write(html);
		response.end();
	})
}
		
server.listen(8888);