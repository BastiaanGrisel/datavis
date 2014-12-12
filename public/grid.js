var size = [128,128],
	canvas_width  = document.getElementById("svg_container").clientWidth,
	canvas_height = document.getElementById("svg_container").clientHeight,
	grid_width    = canvas_width < canvas_height ? canvas_width : canvas_height,
	grid_height   = grid_width;

// Create a D3 container
var svg = d3.select("#svg_container").append("svg")
    .attr("width", canvas_width)
    .attr("height", canvas_height)

// Create a square container
var grid = svg.append("g")
    .attr("class", "grid")
    .attr("width", grid_width)
    .attr("height", grid_height)
    .attr("mask", "url(#grid_mask)")
    // Position the grid to the center of the page
    .attr("transform","translate("+ Math.floor( (canvas_width - grid_width)/2 ) +","+ Math.floor( (canvas_height - grid_height)/2 ) +")")

var grid_defs = grid.append("defs").append("mask")
                    .attr("id", "grid_mask")
                    .append("rect")
                    .attr("fill", "white")
                    .attr("height", grid_height)
                    .attr("width", grid_width) 

var image = grid.append("svg:image")
    .attr("xlink:href", "map.jpg")
    .attr("width", grid_width)
    .attr("height", grid_height)
    .attr("x","0")
    .attr("y","0")
    .attr("opacity", "0.4")

// Define domain and range for the position of the tiles
var x = d3.scale.ordinal()
    .domain(d3.range(size[0]))
    .rangeBands([0,grid_width]);

var y = d3.scale.ordinal()
    .domain(d3.range(size[1]))
    .rangeBands([grid_height,0]);

var color = d3.scale.category10();

// Display data
function updateGrid(tiles) {
    drawPlayers(tiles);
    drawLinks(tiles);
    // drawDistances(tiles);
}

function drawDistances(tiles) {
    var teams = d3.nest()
        .key(function(d){ return d.team })
        .entries(tiles);

    var distances = teams.map(function(d){
        return [
            new DistanceCircle(d.key, "min", d3.min(d.values, function(d){ return d.distanceToBase(); })),
            new DistanceCircle(d.key, "mean", d3.mean(d.values, function(d){ return d.distanceToBase(); })),
            new DistanceCircle(d.key, "max", d3.max(d.values, function(d){ return d.distanceToBase(); }))
        ]
    }).reduce(function(a, b) {
      return a.concat(b);
    }, []);

    console.log(distances)

    // Draw circles
    grid.selectAll(".distance")
        .data(distances)
            .attr("r", function(d){return d.val})
        .enter()
            .append("circle")
            .attr("class", "distance")
            .attr("cx", function(d) {
                return d.team == "radiant" ? grid_width : "0";
            })
            .attr("cy", function(d) {
                return d.team == "radiant" ? "0" : grid_height;
            })
            .attr("stroke", function(d){
                return d.team == "radiant" ? "blue" : "red";
            })
            .attr("opacity", "0.5")
            .attr("stroke-width", "2")
            .attr("fill", "none")
            .attr("r", function(d){return d.val})
            .attr("mask", function(d) {
                return "url(#"+d.team+")";
            })
}

function DistanceCircle(team, sort, val) {
    this.team = team;
    this.sort = sort;
    this.val = val;
}


function drawLinks(tiles) {
    // Add or update links where possible (first so they are below)
    var links = d3.nest()
        .key(function(d) { return d.name; })
        .entries(tiles)
        .filter(function(d){ return d.values.length > 1; })
        .map(function(d){ 
            return d.values
        })

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d){ return x(d.col); })
        .y(function(d){ return y(d.row); });

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
            .attr("stroke-width", 1)
            .attr("fill",  "none")

    grid.selectAll(".line").data(links).exit().remove();
}

function drawPlayers(tiles) {
     // Add players
    var players = tiles.filter(function(d) {
        return d.visible;
    })

    grid.selectAll(".player").data(players) // Update existing elements
        .attr("r", function(d) {
            return x.rangeBand()/2;
        })
        .attr("cx", function(d) {
            return x(d.col);
        })
        .attr("cy", function(d) {
            return y(d.row);
        })
        .attr("fill", function(d,i) {
            return d.team == "radiant" ? "blue" : "red";
        })
    .enter() // Add new circles if necessary
        .append("circle")
        .attr("class", "player")
        .attr("r", function(d) {
            return x.rangeBand()/2;
        })
        .attr("cx", function(d) {
            return x(d.col);
        })
        .attr("cy", function(d) {
            return y(d.row);
        })
        .attr("fill", function(d,i) {
            return d.team == "radiant" ? "blue" : "red";
        })

    // Remove redundant circles
    grid.selectAll(".player").data(players).exit().remove();

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

    this.distanceToBase = function() {
        return this.team == "radiant" ? distanceTo(grid_height, 0, x(this.col), y(this.row)) : distanceTo(0, grid_width, x(this.col), y(this.row));

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