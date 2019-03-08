var express = require('express');
var mysql = require('mysql');
var http = require('http');
var app = express();

// for accepting form data
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));

var router = require('./routes/router.js');
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