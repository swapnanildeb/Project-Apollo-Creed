var express = require('express');
var bodyParser = require('body-parser')

var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(bodyParser.raw());
app.use(bodyParser.text());


console.log("server starting");
app.post('/',function(req,res){
	//console.log("post recieved");
	processRequest(req.body.name,req.body.block,req.body.punch);
	res.send("meh");
});
app.listen(80);
var health1 = 1000;
var health2 = 1000;

var p1left = false;
var p1right = false;
var p2left = false;
var p2right = false;

var processRequest = function(name,block,punch){
	if(health2<0)
		console.log("Player 1 Wins!!!");
	if(health1<0)
		console.log("Player 2 Wins!!!")
	if(name=="1.left")
		p1left = block;
	else if(name=="1.right"){
		p1right = block;
	}
	else if(name=="2.left")
		p2left = block;
	else if(name=="2.right")
		p2right = block;
	if(punch>0){
		if(name=="1.right"&&p2left||name=="1.left"&&p2right||name=="2.right"&&p1left||name=="2.left"&&p1right)
			punch = punch/10;//reduce punch by 90% if blocked
		var p = name.split(".")[0];
		if(p==1){
			health2=health2-punch;
		}
		if(p==2){
			health1 = health1-punch;
		}
	}
};