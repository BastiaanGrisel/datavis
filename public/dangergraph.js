danger_meter = svg.append("g")
				.attr("class", "danger_meter")
			    .attr("width", canvas_width/2)
			    .attr("height", canvas_height/2)
			    .attr("transform", "translate("+canvas_width/2+",0)")



function drawDangerGraph() {



	danger_meter.selectAll(".chart")
		.data(player_danger)
			.style("height", function(d) {
				return d.danger;
			})	
		.enter()
			.append("div")
			.attr("class","chart")
			.style("height", function(d) {
				return d.danger > 0 ? Math.round(d.danger) : 0;
			})



}