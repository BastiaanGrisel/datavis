function findPOI(radius, treshhold){
	poi_player = [];
	all_players.forEach(function(player){
		battle = getPlayersInRadius(all_players, player, radius);
		if(battle.length > treshhold) {
			//console.log(dangerMeter(player,radius));
			if (dangerMeter(player,radius) > (4.5/5)*Math.sqrt(0.4)) { /* 1 additional player closer then 40% of the radius */
				if (!(include(poi_player,player))) {
					poi_player.push(player);
				}
			}
		}					
	});
	if(poi_player.length > 0) {
		console.log("Danger on players:");
		console.log(poi_player);
		poi = [];
		poi_player.forEach(function(p) {
			poi.push([p.x, p.y, p.team]);
		});
		poi = cluster(poi, radius);
	}
	return 0;
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
	if(include(red_team, player)) {
		allies = red_team;
		enemies = blue_team;
	} else {
		allies = blue_team;
		enemies = red_team;
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