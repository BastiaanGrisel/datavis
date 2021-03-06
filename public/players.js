function drawPlayers() {    
    grid.selectAll(".player").data(players_all).transition().duration(delay).ease("linear") // Update existing elements
        .attr("r", function(d) {
            return grid.x.rangeBand()/2;
        })
        .attr("cx", function(d) {
            return grid.x(d.x);
        })
        .attr("cy", function(d) {
            return grid.y(d.y);
        })
        .attr("fill", function(d,i) {
            return d.team == "radiant" ? "blue" : "red";
        });
    grid.selectAll(".player").data(players_all).enter() // Add new circles if necessary
        .append("circle")
        .attr("class", "player")
        .attr("r", function(d) {
            return grid.x.rangeBand()/2;
        })
        .attr("cx", function(d) {
            return grid.x(d.x);
        })
        .attr("cy", function(d) {
            return grid.y(d.y);
        })
        .attr("fill", function(d,i) {
            return d.team == "radiant" ? "blue" : "red";
        })

    // Remove redundant circles
    grid.selectAll(".player").data(players_all).exit().remove();
}

function drawLinks() {
    // Add or update links where possible (first so they are below)
    var links = d3.nest()
        .key(function(d) { return d.player; })
        .entries(match_info)
        .filter(function(d){ return d.values.length > 1; })
        .map(function(d){ 
            return d.values
        })

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d){ return grid.x(d.x); })
        .y(function(d){ return grid.y(d.y); });

    grid.selectAll(".line")
        .data(links)
            .attr("d", line)
        .enter()
            .insert("path",":first-child")
            // .append("path")
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", function(d, i) {
                return color(i);
            })
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width", 2)
            .attr("fill",  "none")

    grid.selectAll(".line").data(links).exit().remove();
}

function Tile(col, row, team, name, visible) {
	this.row = row;
	this.col = col;
    this.team = team;
    this.name = name;
    this.visible = visible;

    this.equals = function(other) {
        return this.row == other.row && this.col == other.col && this.name == other.name;
    }

    this.distanceToEnemyBase = function() {
        return this.team == "radiant" ? 
            distanceTo(x(this.col), y(this.row), dire_base_px[0], dire_base_px[1]) : distanceTo(x(this.col), y(this.row), radiant_base_px[0], radiant_base_px[1]);

        function distanceTo(x1,y1,x2,y2) {
            function sq(x){ return x*x }
            return Math.sqrt( sq(x1-x2) + sq(y1-y2) );
        }
    }
}

// A link between two tiles
function Link(from, to) {
    this.from = from;
    this.to = to;
}
