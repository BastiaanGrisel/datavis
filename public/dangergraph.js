var danger_meter_margin = {top: 30, right: 10, bottom: 30, left: 30};
var danger_meter_height = canvas_height - danger_meter_margin.top - danger_meter_margin.bottom;
var danger_meter_width  = canvas_width/2 - danger_meter_margin.right - danger_meter_margin.left;

danger_meter = svg.append("g")
				.attr("class", "danger_meter")
			    .attr("width", danger_meter_width)
			    .attr("height", danger_meter_height)
			    .attr("transform", "translate("+(canvas_width/2+danger_meter_margin.left)+","+danger_meter_margin.top+")")

danger_meter.x = d3.scale.ordinal()
    .domain(player_danger.map(function(d){ return d.player; }))
    .rangeBands([0,danger_meter_width]);

danger_meter.y = d3.scale.linear()
    .domain([5,-5])
    .range([0,danger_meter_height]);

danger_meter.append("svg:line")
    .attr("x1", 0)
    .attr("y1", danger_meter.y(danger_threshold))
    .attr("x2", danger_meter_width)
    .attr("y2", danger_meter.y(danger_threshold))
    .style("stroke", "rgb(6,120,155)");

var xAxis = d3.svg.axis()
	    .scale(danger_meter.x)
	    .orient("bottom")

danger_meter.append("g")
    .attr("class", "x-axis")
    .attr("stroke","white")
    .attr("transform", "translate(0," + danger_meter_height/2 + ")")
	.call(xAxis);

var yAxis = d3.svg.axis()
    .scale(danger_meter.y)
    .orient("left");

danger_meter.append("g")
    .attr("class", "y-axis")
    .attr("stroke","white")
	.call(yAxis)
	

function drawDangerGraph() {

	danger_meter.x.domain(player_danger.map(function(d){ return d.player; }));

	var bar = danger_meter.selectAll("rect")
		.data(player_danger)
			.attr("height", function(d){ 
				if(d.danger > 0) {
					return danger_meter_height/2 - danger_meter.y(d.danger); 
				} else {
					return danger_meter.y(d.danger) - danger_meter_height/2;
				}
			})
	     	.attr("width", danger_meter.x.rangeBand())
			.attr("x", function(d) {
				return danger_meter.x(d.player);
			})
			.attr("y", function(d) { 
				if(d.danger > 0) {
					return danger_meter.y(d.danger);
				} else {
					return danger_meter_height/2;
				}
			})
	     	.attr("fill", function(d) {
	     		return d.team == "radiant" ? "blue" : "red";
	     	})
		.enter()
			.append("rect")
			.attr("height", function(d){ 
				if(d.danger > 0) {
					return danger_meter_height/2 - danger_meter.y(d.danger); 
				} else {
					return danger_meter.y(d.danger) - danger_meter_height/2;
				}
			})
	     	.attr("width", danger_meter.x.rangeBand())
			.attr("x", function(d) {
				return danger_meter.x(d.player);
			})
			.attr("y", function(d) { 
				if(d.danger > 0) {
					return danger_meter.y(d.danger);
				} else {
					return danger_meter_height/2;
				}
			})
	     	.attr("fill", function(d) {
	     		return d.team == "radiant" ? "blue" : "red";
	     	})
}