var users = require('./users')
var fileHandeler = require('./file_upload_manager')
var ingredient = require('./ingredients')
var recipe = require('./recipes')
var payments = require('./payment')
var cart = require('./cart')

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

    //recipes
    routes.post('/add_new_recipe', recipe.addnewrecipe);
    routes.post('/get_all_recipes', recipe.getAllRecipes);
    routes.post('/get_recipe', recipe.getRecipeById);

    //add to cart
    routes.post('/add_to_cart', cart.addToCart);
    routes.post('/get_my_cart', cart.getMyCart);
    routes.post('/increase_cart_item_quantity', cart.increaseCartItemQuantity);
    routes.post('/remove_from_cart', cart.removeFromCart);


    // PAYTM checksum
    routes.post('/generate_checksum', payments.generateCheckSum);


    // route not found handler always keep in bottom
    routes.all('*', function (req, res) {
        res.send('{"status":404,"error":true,"response":[]}');
    });
    return routes;
})();