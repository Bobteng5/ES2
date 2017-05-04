var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);

var state=1;
var ini=0;

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client.html');
});

accel.on('ready', function () {
  io.of('/').on('connection', function(socket){
	var _x,_y,_z;
  accel.on('data', function (xyz) {
    _x=xyz[0].toFixed(2)
    _y=xyz[1].toFixed(2)
    _z=xyz[2].toFixed(2)
    console.log('x:', xyz[0].toFixed(2),
                'y:', xyz[1].toFixed(2),
                'z:', xyz[2].toFixed(2));             
    socket.emit('acc', _x, _y, _z); 
  }); 
  accel.on('error', function(err){
    console.log('Error:', err);
  });

  socket.on("off", function(){
		tessel.led[2].off();
	});

  socket.on("on", function(){
		tessel.led[2].on();
	});
     
  });
});


http.listen(port, function(){
	console.log('listening on *:' + port);
});
