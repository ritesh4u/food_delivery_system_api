var express = require('express');
var mysql = require('mysql');
var http = require('http');
var app = express();

// for accepting form data
var bodyParser = require('body-parser');

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({
	extended: true
}));
//form-urlencoded


// for parsing multipart/form-data
//global.multer = multer;
//app.use(upload.single('image_file'));
app.use('/recipes', express.static('recipes'));
app.use('/ingredients', express.static('ingredients'));
app.use('/profile_pic', express.static('profile_pic'));
var router = require('./routes/router.js');

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization, Content-Length, X-Requested-With');
	res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
	next();
});

//Database connection
app.use(function (req, res, next) {
	global.connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		database: 'food_delivery_managment'
	});
	connection.connect();
	next();
});



app.use('/api', router);
app.all('*', (req, res) => {
	res.send('{"status":500,"error":true,"response":[]}');
});
module.exports = app;
var server = http.createServer(app);
server.listen(4001, function () {
	console.log("started");
});