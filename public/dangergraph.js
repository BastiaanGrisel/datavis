danger_meter = svg.append("g")
				.attr("class", "danger_meter")
			    .attr("width", canvas_width/2)
			    .attr("height", canvas_height/2)
			    .attr("transform", "translate("+canvas_width/2+",0)")

var danger_meter_height = canvas_height/2;
var danger_meter_width  = canvas_width/2;

danger_meter.x = d3.scale.ordinal()
    .domain(player_danger.map(function(d){ return d.player; }))
    .rangeBands([0,danger_meter_width]);

danger_meter.y = d3.scale.linear()
    .domain([0,5])
    .range([0,danger_meter_height]);

function drawDangerGraph() {

	danger_meter.x.domain(player_danger.map(function(d){ return d.player; }));

	var bar = danger_meter.selectAll("rect")
		.data(player_danger.map(function(d){ return d.danger > 0 ? d : {"player": d.player, "danger": 0}; }))
			.attr("transform", function(d) {
				return "translate("+ danger_meter.x(d.player) +",0)";
			})
			.attr("height", function(d) { return danger_meter.y(d.danger); })
	     	.attr("y", function(d) { return danger_meter_height - danger_meter.y(d.danger); })
	     	.attr("width", danger_meter.x.rangeBand())
	     	.attr("fill", "red")
		.enter()
			.append("rect")
			.attr("transform", function(d) {
				return "translate("+ danger_meter.x(d.player) +",0)";
			})
			.attr("height", function(d) { return danger_meter.y(d.danger); })
	     	.attr("y", function(d) { return danger_meter_height - danger_meter.y(d.danger); })
	     	.attr("width", danger_meter.x.rangeBand())
	     	.attr("fill", "red");

	// bar.append("rect")
		// .attr("y", function(d) { return danger_meter.y(d.danger); })
  //    	.attr("height", function(d) { return danger_meter_height - danger_meter.y(d.danger); })
  //    	.attr("width", danger_meter.x.rangeBand())
  //    	.attr("fill", "red");

	// danger_meter.selectAll(".chart")
	// 	.data(player_danger)
	// 		.attr("height", function(d) {
	// 			return d.danger > 0 ? danger_meter.y(Math.round(d.danger)) : 0;
	// 		})	
	// 	.enter()
	// 		.append("rect")
	// 		.attr("class","chart")
	// 		.attr("height", function(d) {
	// 			return d.danger > 0 ? danger_meter.y(Math.round(d.danger)) : 0;
	// 		})
	// 		.attr("width", danger_meter.x.rangeBand())
	// 		.attr("fill", "red")




}