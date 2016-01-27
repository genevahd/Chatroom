// require express and path
var express = require("express");
var path = require("path");
// create the express app
var app = express();
// static content 
// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);

var users= [];
var convo =[];


function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

var d = new Date();
var newdate = formatDate(d);

io.sockets.on('connection', function (socket){	
	var user_id = socket.id;
	console.log(user_id);

socket.on("new_person", function(person){
	console.log(person);
	convo.push("<p class='time'>" + newdate +"</p><p class='blue'>"+ person + " has entered the chatroom &#9786;</p>");
	console.log(convo);
	io.emit("display_new_person", convo);
	user= {
		id: socket.id,
		name: person
	}
	users.push(user);
	console.log(users);
	io.emit("display_online", users);
})
socket.on("new_message", function(value){
	console.log(value);
	convo.push(value);
	io.emit("display_message", convo);
})
socket.on('disconnect', function(){
	console.log("consoling"+socket.id);
	for(index in users){
		if(socket.id == users[index].id){
			var personexit = users[index].name;
			users.splice(index, 1);
			break;
		}
	}
	convo.push("<p class='time'>" + newdate + "</p><p class='red'>" + personexit + " has exited the chatroom &#9785;</p>");
	io.emit("display_new_person", convo);
	io.emit("display_online", users);
})
});


app.use(express.static(path.join(__dirname, "./static")));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.get('/', function(request, response){
	console.log("here");
	response.render('index');
});