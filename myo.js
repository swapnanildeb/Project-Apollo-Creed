var Myo = require('myo');
var request = require('request');

//Start talking with Myo Connect
Myo.connect();


Myo.on("connected",function(){
	Myo.setLockingPolicy("none");
});

var sqr = function(x){
	return x*x;
}


Myo.on('imu',function(data){
	var vec = Math.pow(sqr(data.accelerometer.y)+sqr(data.accelerometer.z),.5);
	if(!(vec>2.5&&data.accelerometer.z>1)){
		vec = 0;
	}
	var o = data.orientation;
	var pitch = Math.asin(Math.max(-1,Math.min(1,2*(o.w*o.y-o.z*o.x))));
	var minpitch = .8;
	//send request
	var host = "http://localhost";
	var punch = vec;
	var block = pitch>minpitch;
	var name = this.name;
	request.post(host).form({"name":this.name,"block":block,"punch":vec});
})
