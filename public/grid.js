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
    // Position the grid to the center of the page
    .attr("transform","translate("+ Math.floor( (canvas_width - grid_width)/2 ) +","+ Math.floor( (canvas_height - grid_height)/2 ) +")")
    
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

// Display data
function updateGrid(tiles, connections) {

    grid.selectAll("circle").data(tiles) // Update existing elements
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
    grid.selectAll("circle").data(tiles).exit().remove();
}

function Tile(col, row, team) {
	this.row = row;
	this.col = col;
    this.team = team;
}

// A link between two tiles
function Link(from, to) {
    this.from = from;
    this.to = to;
}