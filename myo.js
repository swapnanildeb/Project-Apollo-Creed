var Myo = require('myo');

//Start talking with Myo Connect
Myo.connect();

debug = false;

var output = function(x){
	if(debug)
		console.log(x);
}
var sqr = function(x){
	return x*x;
}

Myo.on("connected",function(){
	Myo.setLockingPolicy("none");
});


Myo.on('pose',function(pose){
	output(pose);
	//this.vibrate();
});
Myo.on('rest',function(){
	output("rest");
	//this.vibrate();
});

var health1 = 1000;
var health2 = 1000;

var p1left = false;
var p1right = false;
var p2left = false;
var p2right = false;

Myo.on('imu',function(data){
	//console.log(data);
	//console.log(data.accelerometer.z);
	var name = this.name.split(".");
	var vec = Math.pow(sqr(data.accelerometer.y)+sqr(data.accelerometer.z),.5);
	
	if(health1<0){
		console.log("Player 2 Wins!!!");
		//console.log('\033[2J');
		//console.log("You Win!!!!");
	}
	else if(health2<0){
		console.log("Player 1 Wins!!!");
	}
	else if(vec>2.5&&data.accelerometer.z>1){
		if(name[0]==1){//if player 1
			console.log(name[1]);
			if(name[1]=="right"&&p2left||name[1]=="left"&&p2right){
				vec = vec/10;//reduce damage by 90%
				console.log("blocking");
			}
			health2 = health2-vec;
			console.log("Player 2 Health: "+String(health2))
		}
		if(name[0]==2){//if player 2
			console.log(name[1],p1right,p1left);
			if((name[1]=="right"&&p1left)||(name[1]=="left"&&p1right)){
				vec = vec/10;//reduce damage by 90%
				console.log("blocking");
			}
			health1 = health1-vec;
			console.log("Player 1 Health: "+String(health1));
		}
		//console.log('\033[2J');
		//console.log(vec);
		//console.log(data.accelerometer.z);
		//console.log(health);
	}
	//console.log(data.orientation);
	var o = data.orientation;
	var pitch = Math.asin(Math.max(-1,Math.min(1,2*(o.w*o.y-o.z*o.x))));
	//if(pitch>1)
	//	console.log("hey look im blocking");
	var minpitch = .8;
	//console.log(this.name,pitch);
	if(this.name=="1.right"&&pitch>minpitch)
		p1right = true;
	else
		p1right = false;
	if(this.name=="1.left"&&pitch>minpitch)
		p1left = true;
	else
		p1left = false;
	if(this.name=="2.right"&&pitch>minpitch)
		p2right = true;
	else
		p2right = false;
	if(this.name=="2.left"&&pitch>minpitch)
		p2left = true;
	else
		p2left = false;
		//you are blocking

})