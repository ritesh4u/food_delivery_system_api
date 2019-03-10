var users = require('./users')
var fileHandeler = require('./file_upload_manager')
var ingrident = require('./ingridents')

module.exports = (function () {
    var routes = require('express').Router();
    routes.get('/all', users.getalluser);
    routes.get('/getuser', users.getuserbynumber);

    //customer routes
    routes.post('/adduser', users.addnewuser);
    routes.post('/updateuser', users.updateuser);
    routes.post('/deleteuser', users.deleteuser);
    routes.post('/login', users.loginuser);

    //ingridents
    routes.post('/add_new_ingrident', ingrident.addnewingrident);



    // route not found handler always keep in bottom
    routes.all('*', function (req, res) {
        res.send('{"status":404,"error":true,"response":[]}');
    });
    return routes;
})();