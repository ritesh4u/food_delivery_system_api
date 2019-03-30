var recipe = require("./recipes")
var async = require("async");
exports.addToCart = (req, res) => {
    //  console.log("user_id : " + req.body.user_id);
    // console.log("recipe_id : " + req.body.recipe_id);
    //  console.log("ingredients_contain_scale : " + req.body.ingredients_contain_scale);
    //  console.log("quantity : " + req.body.quantity);
    if (req.body.user_id != undefined && req.body.recipe_id != undefined && req.body.ingredients_contain_scale != undefined && req.body.quantity != undefined) {
        var sqlQuery = "INSERT INTO my_cart (user_id,recepie_id,ingredients_contain_scale,quantity) VALUES('" +
            req.body.user_id + "','" + req.body.recipe_id + "','" + req.body.ingredients_contain_scale + "','" +
            req.body.quantity + "')";
        var findSqlQuery = "SELECT * FROM my_cart WHERE user_id = " + parseInt(req.body.user_id) + " AND recepie_id = " + parseInt(req.body.recipe_id) + " AND ingredients_contain_scale LIKE '" + req.body.ingredients_contain_scale + "';";
        connection.query(findSqlQuery, function (findError, findOutput) {
            var cartQuantity = findOutput.length;
            if (findOutput.length == 0) {
                connection.query(sqlQuery, function (error, results) {
                    if (!error) {
                        res.send({
                            "status": 200,
                            "error": false,
                            "error_code": 0,
                            "response": {},
                            "message": "Item added in cart successfully"
                        });
                    } else {
                        res.send({
                            "status": 500,
                            "error": true,
                            "error_code": 0,
                            "response": {},
                            "message": "something went wrong"
                        });
                    }
                });
            } else {
                res.send({
                    "status": 200,
                    "error": false,
                    "error_code": 1,
                    "response": {
                        "item_quantity": findOutput[0].quantity,
                        "my_cart_id": findOutput[0].my_cart_id
                    },
                    "message": "Item already in cart "
                });
            }
        });

    } else {
        res.send({
            "status": 200,
            "error": true,
            "error_code": 404,
            "response": {},
            "message": "All field is required"
        });
    }
}
exports.getMyCart = (req, res) => {
    if (req.body.user_id != undefined) {
        sqlQuery = "SELECT * from my_cart where user_id =" + req.body.user_id;
        connection.query(sqlQuery, function (findError, findOutput) {
            if (!findError) {
                if (findOutput.length > 0) {
                    setIngredientArray(findOutput, function (dataOject) {
                        res.send({
                            "status": 200,
                            "error": false,
                            "cart_details": dataOject,
                            "message": "cart item found"
                        });
                    });

                } else {
                    res.send({
                        "status": 200,
                        "error": false,
                        "cart_details": [],
                        "message": "No item found in cart"
                    });
                }
            } else {
                res.send({
                    "status": 500,
                    "error": true,
                    "response": {},
                    "message": "something went wrong"
                });
            }
        });
    } else {
        res.send({
            "status": 200,
            "error": true,
            "response": {},
            "message": "All field is required"
        });
    }
}
exports.increaseCartItemQuantity = (req, res) => {
    if (req.body.my_cart_id != undefined && req.body.quantity != undefined) {
        var updateSqlQuery = "UPDATE my_cart SET quantity ='" + req.body.quantity + "' WHERE my_cart.my_cart_id = " + req.body.my_cart_id;
        connection.query(updateSqlQuery, function (updateError, updateResult) {
            if (!updateError) {
                res.send({
                    "status": 200,
                    "error": false,
                    "response": {},
                    "message": "quantity updated successfully"
                });
            } else {
                res.send({
                    "status": 500,
                    "error": true,
                    "response": {},
                    "message": "something went wrong"
                });
            }
        });

    } else {
        res.send({
            "status": 200,
            "error": true,
            "response": {},
            "message": "All field is required"
        });
    }
}
exports.removeFromCart = (req, res) => {
    if (req.body.my_cart_id != undefined) {
        var sqlDeleteQuery = "DELETE FROM my_cart where my_cart.my_cart_id = " + req.body.my_cart_id;
        connection.query(sqlDeleteQuery, function (deleteError, deleteResult) {

            if (!deleteError) {
                res.send({
                    "status": 200,
                    "error": false,
                    "response": {},
                    "message": " Item Removed from cart successfully"
                });
            } else {
                res.send({
                    "status": 500,
                    "error": true,
                    "response": {},
                    "message": "something went wrong"
                });
            }
        });
    } else {
        res.send({
            "status": 200,
            "error": true,
            "response": {},
            "message": "All field is required"
        });
    }
}
var setIngredientArray = (dataOject, callback) => {
    connection.query("SELECT * from ingredients", function (ingredientError, ingredientResults) {

        var finalOutputArray = [];
        var cartItemArray = dataOject;
        async.forEachOf(cartItemArray, function (currentItem, key, everyCallBack) {
            var innerOutputArray = [];
            var ingredientArray = JSON.parse(currentItem.ingredients_contain_scale);
            for (var i = 0; i < ingredientArray.length; i++) {
                let foundedElement = ingredientResults.find(function (element) {
                    return element.ingredient_id == ingredientArray[i].ingredient_id;
                });
                var protinValue = "0";
                var fatValue = "0";
                if (ingredientArray[i].content == "0") {
                    protinValue = foundedElement.ingredient_nutrition_standard;
                    fatValue = foundedElement.ingredient_fat_standard;
                } else if (ingredientArray[i].content == "1") {
                    protinValue = foundedElement.ingredient_nutrition_extra;
                    fatValue = foundedElement.ingredient_fat_extra;
                }
                innerOutputArray.push({
                    "ingredient_id": foundedElement.ingredient_id,
                    "ingredient_name": foundedElement.ingredient_name,
                    "content": ingredientArray[i].content,
                    "protin_value": protinValue,
                    "fat_value": fatValue
                });
            }
            recipe.getRecipeObjectById(currentItem.recepie_id, function (recipeData) {
                finalOutputArray.push({
                    "my_cart_id": currentItem.my_cart_id,
                    "recipe_id": currentItem.recepie_id,
                    "recipe_name": recipeData.recipe_name,
                    "recipe_price": recipeData.recipe_price,
                    "recipe_image_url": recipeData.recipe_image_url,
                    "quantity": currentItem.quantity,
                    "ingredient_array": innerOutputArray
                });
                everyCallBack();
            });

        }, function (err, res) {

            // console.log(JSON.stringify(finalOutputArray));
            callback(finalOutputArray)
        });
    });
}