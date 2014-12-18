var size = [128,128],
	grid_width    = Math.min(canvas_width < canvas_height ? canvas_width : canvas_height, canvas_width/2),
	grid_height   = grid_width,
    radiant_base_px  = [0, grid_height],
    dire_base_px     = [grid_width, 0];

// Create a square container
grid = svg.append("g")
    .attr("class", "grid")
    .attr("width", grid_width)
    .attr("height", grid_height)
    .attr("mask", "url(#grid_mask)")

// Create a place to hold masks
grid_defs = grid.append("defs")

// Create a mask so that objects won't render off the grid
grid_defs.append("mask")
    .attr("id", "grid_mask")
    .append("rect")
    .attr("fill", "white")
    .attr("height", grid_height)
    .attr("width", grid_width) 

// Background image
var image = grid.append("svg:image")
    .attr("xlink:href", "map.jpg")
    .attr("width", grid_width)
    .attr("height", grid_height)
    .attr("x","0")
    .attr("y","0")
    .attr("opacity", "0.4")

// Define domain and range for the position of the tiles
grid.x = d3.scale.ordinal()
    .domain(d3.range(size[0]))
    .rangeBands([0,grid_width]);

grid.y = d3.scale.ordinal()
    .domain(d3.range(size[1]))
    .rangeBands([grid_height,0]);

var color = d3.scale.category10();

// Display data on grid
function updateGrid() {
    drawPlayers();
    drawLinks();
    // drawDistanceCircles();
    drawPOI(15, 2);
}