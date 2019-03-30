var fileManager = require("./file_upload_manager");
exports.addnewrecipe = (req, res) => {
    fileManager.saveRecipeImage(req, function (error, output) {
        if (!error) {
            let sql = "INSERT INTO recipes (recipe_name,recipe_description,recipe_price,recipe_image_url,ingredients_array)" +
                " VALUES('" + output.recipe_name + "','" + output.recipe_description + "','" +
                output.recipe_price + "','" + output.recipe_image_url + "','" + output.recipe_ingredients_array + "')";

            connection.query(sql, (error, result) => {
                if (error) {
                    res.send({
                        "status": 200,
                        "error": true,
                        "response": "[" + error + "]",
                        "message": "something went wrong"
                    });
                } else {
                    res.send({
                        "status": 200,
                        "error": false,
                        "response": [],
                        "message": "Menu Item Added Successfully"
                    });
                }
            });
        } else {
            res.send({
                "status": 200,
                "error": true,
                "response": [],
                "message": output.message
            });
        }

    });

};
exports.getAllRecipes = (req, res) => {
    connection.query('SELECT * from recipes', function (error, results) {
        if (error) {
            res.send({
                "status": 500,
                "error": error,
                "response": []
            });
            //If there is error, we send the error in the error section with 500 status
        } else {
            res.send({
                "status": 200,
                "error": false,
                "response": results
            });
            //If there is no error, all is good and response is 200OK.
        }
    });
};
exports.getRecipeById = (req, res) => {
    connection.query("SELECT * FROM recipes WHERE recipe_id =" + req.body.recipe_id, function (recipeError, recipeResults) {
        if (recipeResults instanceof Array && recipeResults.length > 0) {
            connection.query("SELECT * from ingredients", function (ingredientError, ingredientResults) {
                var outputArray = [];
                var ingredientArray = JSON.parse(recipeResults[0].ingredients_array);

                for (var i = 0; i < ingredientArray.length; i++) {
                    let foundedElement = ingredientResults.find(function (element) {
                        return element.ingredient_id == ingredientArray[i];
                    });
                    outputArray.push(foundedElement);
                }
                recipeResults[0].ingredients_array = outputArray;
                res.send({
                    "status": 200,
                    "error": false,
                    "response": recipeResults[0],
                    "message": "recipe found"
                });
            });

        } else {
            res.send({
                "status": 200,
                "error": true,
                "response": [],
                "message": "recipe not found"
            });
        }
    });
};

exports.getRecipeObjectById = (recipe_id, callback) => {
    connection.query("SELECT * FROM recipes WHERE recipe_id =" + recipe_id, function (recipeError, recipeResults) {
        callback(recipeResults[0]);
    });
}