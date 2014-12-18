function drawPOI(radius, treshhold){
	poi = [];
	poi_player = [];
	player_danger = [];
	danger_threshold = 0.4;

	players_all.forEach(function(player){
		player_danger.push({"player":player.player, "team":player.team, "danger":dangerMeter(player,radius)});

		battle = getPlayersInRadius(players_all, player, radius);
		if(battle.length > treshhold) {
			//console.log(dangerMeter(player,radius));
			if (dangerMeter(player,radius) > (4.5/5)*Math.sqrt(0.4)) { /* 1 additional player closer then 40% of the radius */
				if (!(include(poi_player,player))) {
					poi_player.push(player);
				}
			}
		}					
	});

	player_danger.sort(function(d) { return d.team == "radiant" ? 1 : -1});

	if(poi_player.length > 0) {
		poi_player.forEach(function(p) {
			poi.push([p.x, p.y, p.team]);
		});
		poi = cluster(poi, radius);
	}
	
	grid.selectAll(".poi")
		.data(poi)
			.attr("cx", function(d){ return grid.x(d[0]); })
			.attr("cy", function(d){ return grid.y(d[1]); })
			.attr("r", grid.x(radius))
			.attr("fill", function(d){ return d[2] == "radiant" ? "blue" : "red" })
			.attr("stroke", function(d){ return d[2] == "radiant" ? "blue" : "red" })
		.enter()
			.append("circle")
			.attr("class", "poi")
			.attr("cx", function(d){ return grid.x(d[0]); })
			.attr("cy", function(d){ return grid.y(d[1]); })
			.attr("r", grid.x(radius))
			.attr("fill", function(d){ return d[2] == "radiant" ? "blue" : "red" })
			.attr("stroke", function(d){ return d[2] == "radiant" ? "blue" : "red" })
			.attr("fill-opacity", "0.1")
			.attr("stroke-opacity", "0.8")
			.attr("stroke-width", 1)

	grid.selectAll(".poi").data(poi).exit().remove();
}

function cluster(poi, radius) {
	clustered_poi = [];
	cl_flag = false;
	poi.forEach(function(point) {
		other = poi.slice(0); //clone array
		if (other.length > 1) { //more then one point!
			other.splice(poi.indexOf(point),1); //remove point
			other.forEach(function(point2) { 
				if(point2[2] == point[2] && Math.sqrt((point2[0]-point[0])*(point2[0]-point[0])+(point2[1]-point[1])*(point2[1]-point[1])) < radius) { //if the same team and within radius
					cl_flag = true;
					new_point = [(point2[0]+point[0])/2,(point2[1]+point[1])/2,point[2]]; //take mean coordinate
					if (!(include_point(clustered_poi,new_point))) {
						clustered_poi.push(new_point); //add unique point
					}
				} else {
					if (!(include_point(clustered_poi,point))) {
						clustered_poi.push(point); 
					}
				}
			})
		} else { // no others
			if (!(include_point(clustered_poi,point))) {
				clustered_poi.push(point); //add unique point
			}
		}
	}) 
	if(cl_flag) {
		clustered_poi = cluster(clustered_poi, radius) //recursive call if there was clustering
	}
	return clustered_poi;
}

function dangerMeter(player,radius) {
	if(include(players_dire, player)) {
		allies = players_dire;
		enemies = players_radiant;
	} else {
		allies = players_radiant;
		enemies = players_dire;
	}
	d_allies = 0;
	d_enemies = 0;
	allies.forEach(function(p) {
		d_allies += Math.sqrt(1-Math.min(playerDistance(player, p),radius)/radius);
	});
	enemies.forEach(function(p) {
		d_enemies += Math.sqrt(1- Math.min(playerDistance(player, p),radius)/radius);
	});
	return danger(d_allies, d_enemies);
}

function danger(dallies, denemies) {
	return (5/4.5)*(d_enemies - d_allies+0.5); /*enemies is positive, allies is negative danger, returns -5 to +5 danger, 0 is neutral */
}

function include(arr,obj) {
	return (arr.indexOf(obj) != -1);
}

function include_point(arr,p2) {
	found = false;
	arr.forEach(function(p) {
		if(p[0] == p2[0] && p[1] == p2[1] && p[2] == p2[2]){
			found = true;
		}
	});
	return found;
}

function getPlayersInRadius(players, player, radius) {
	inRadius = [];
	players.forEach(function(p){
		if (playerDistance(p,player) < radius) {
			inRadius.push(p)
		}
	});
	return inRadius;
}

function playerDistance(p1, p2){
	return Math.sqrt(Math.pow(p1.y-p2.y,2)+Math.pow(p1.x-p2.x,2)); /* Absolute distance */
}