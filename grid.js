var size = [128,128],
	canvas_width  = document.getElementById("svg_container").clientWidth,
	canvas_height = document.getElementById("svg_container").clientHeight,
	grid_width    = canvas_width < canvas_height ? canvas_width : canvas_height,
	grid_height   = grid_width;

// Create a tile for each grid position
tiles = [];

for(i = 0; i < size[0]; i++)
	for(j = 0; j < size[1]; j++)
		tiles.push(new Tile(i,j));

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

// Define domain and range for the position of the tiles
var x = d3.scale.ordinal()
.domain(d3.range(size[0]))
.rangeBands([0,grid_width]);

var y = d3.scale.ordinal()
.domain(d3.range(size[1]))
.rangeBands([0,grid_height]);

// Display data
var color = d3.scale.category20();

grid.selectAll("rect")
.data(tiles)
.enter()
.append("rect")
.attr("width", function(d) {
	return x.rangeBand();
})
.attr("height", function(d) {
	return y.rangeBand();
})
.attr("x", function(d) {
	return x(d.col);
})
.attr("y", function(d) {
	return y(d.row);
})
.attr("fill", function(d,i) {
	return color(i);
})

function Tile(row, col) {
	this.row = row;
	this.col = col;
}