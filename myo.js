var Myo = require('myo');
var request = require('request');

var host = "http://10.59.67.242/";
//Start talking with Myo Connect
Myo.connect();


Myo.on("connected",function(){
	Myo.setLockingPolicy("none");
});

var sqr = function(x){
	return x*x;
}

var sync = true

Myo.on('arm_synced', function(){
	sync = true
	console.log("sync")
})
Myo.on('arm_unsynced', function(){
	console.log("unsync")
	sync = false
	request.post(host).form({"name":this.name,"block":0,"punch":0, "sync":0});

})


Myo.on('imu',function(data){
	var vec = Math.pow(sqr(data.accelerometer.y)+sqr(data.accelerometer.z),.5);
	if(!(vec>2.5&&data.accelerometer.z>1)){
		vec = 0;
	}
	var o = data.orientation;
	var pitch = Math.asin(Math.max(-1,Math.min(1,2*(o.w*o.y-o.z*o.x))));
	var minpitch = .8;
	//send request
	//var host = "http://10.59.67.242/";
	var block = pitch>minpitch;
	
	request.post(host).form({"name":this.name,"block":block,"punch":vec, "sync":sync});

})
