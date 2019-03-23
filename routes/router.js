var users = require('./users')
var fileHandeler = require('./file_upload_manager')
var ingredient = require('./ingredients')
var recepie = require('./recepies')
module.exports = (function () {
    var routes = require('express').Router();
    routes.get('/all', users.getalluser);
    routes.get('/getuser', users.getuserbynumber);

    //customer routes
    routes.post('/adduser', users.addnewuser);
    routes.post('/updateuser', users.updateuser);
    routes.post('/deleteuser', users.deleteuser);
    routes.post('/login', users.loginuser);

    //ingredients
    routes.post('/add_new_ingredient', ingredient.addnewingredient);
    routes.post('/get_all_ingredients', ingredient.getAllIngredients);

    //recepies
    routes.post('/add_new_menu_item', recepie.addnewrecepie);

    // route not found handler always keep in bottom
    routes.all('*', function (req, res) {
        res.send('{"status":404,"error":true,"response":[]}');
    });
    return routes;
})();