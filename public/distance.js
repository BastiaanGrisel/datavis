grid_defs = grid.append("defs")

grid_defs.append("mask")
    .attr("id", "grid_mask")
    .append("rect")
    .attr("fill", "white")
    .attr("height", grid_height)
    .attr("width", grid_width) 

function drawDistances(tiles) {
    var teams = d3.nest()
        .key(function(d){ return d.team })
        .entries(tiles.filter(function(d){ return d.visible }));

    var circles = [];

    function DistanceCircle(sort, team, val) {
        this.sort = sort;
        this.team = team;
        this.val = val;
    }

    teams.forEach(function(team){
        circles.push(new DistanceCircle(
            "max", 
            team.key,
            d3.max(team.values, function(d){ return d.distanceToEnemyBase(); })
            ))
        
        circles.push(new DistanceCircle(
            "mean", 
            team.key,
            d3.mean(team.values, function(d){ return d.distanceToEnemyBase(); })
            ))
        
        circles.push(new DistanceCircle(
            "min", 
            team.key,
            d3.min(team.values, function(d){ return d.distanceToEnemyBase(); })
            ))
    });

   var masks = grid_defs.selectAll(".distance_mask")

    masks.data(d3.nest().key(function(d){ return d.team; }).entries(circles))
            .attr("id", function(d) {
                return d.key;
            })
        .enter()
            .append("mask")
            .attr("class", "distance_mask")
            .attr("id", function(d) {
                return d.key;
            });

    masks.selectAll("circle")
        .data(function(d){ return d.values; })
            .attr("r", function(d){ return d.val })
            .attr("cx", function(d) {
                return d.team == "radiant" ? dire_base_px[0] : radiant_base_px[0];
            })
            .attr("cy", function(d) {
                return d.team == "radiant" ? dire_base_px[1] : radiant_base_px[1];
            })
            .attr("fill", function(d) {
                return d.sort == "min" ? "black" : "white"; 
            })  
        .enter()
            .append("circle")
            .attr("r", function(d){return d.val})
            .attr("cx", function(d) {
                return d.team == "radiant" ? dire_base_px[0] : radiant_base_px[0];
            })
            .attr("cy", function(d) {
                return d.team == "radiant" ? dire_base_px[1] : radiant_base_px[1];
            })
            .attr("fill", function(d) { 
                return d.sort == "min" ? "black" : "white"; 
            })  

    // Draw circles
    grid.selectAll(".distance")
        .data(circles)
            .attr("r", function(d){return d.val})
            .attr("cx", function(d) {
                return d.team == "radiant" ? dire_base_px[0] : radiant_base_px[0];
            })
            .attr("cy", function(d) {
                return d.team == "radiant" ? dire_base_px[1] : radiant_base_px[1];
            })
            .attr("fill-opacity", "0.08")
            .attr("stroke-opacity", "0.25")
        .enter()
            .append("circle")
            .attr("class", "distance")
            .attr("cx", function(d) {
                return d.team == "radiant" ? dire_base_px[0] : radiant_base_px[0];
            })
            .attr("cy", function(d) {
                return d.team == "radiant" ? dire_base_px[1] : radiant_base_px[1];
            })
            .attr("fill", function(d){
                if(d.sort != "max") 
                    return "none"
                return d.team == "radiant" ? "blue" : "red";
            })
            .attr("mask", function(d){
                return d.team == "radiant" ? "url(#radiant)" : "url(#dire)";
            })
            .attr("stroke-width", "2")
            .attr("stroke", function(d) {
                return d.team == "radiant" ? "blue" : "red"; 
            })
            .attr("r", function(d){return d.val})
}
