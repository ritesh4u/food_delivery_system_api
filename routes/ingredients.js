var fileManager = require("./file_upload_manager");
exports.addnewingredient = (req, res) => {
    fileManager.saveingredientImage(req, function (error, output) {
        if (!error) {
            let sql = "INSERT INTO ingredients (ingredient_name,ingredient_description,ingredient_image_url,ingredient_nutrition_standard,ingredient_nutrition_extra,ingredient_fat_standard,ingredient_fat_extra)" +
                " VALUES('" + output.ingredient_name + "','" + output.ingredient_description + "','" +
                output.ingredient_image_url + "','" + output.ingredient_nutrition_standard + "','" + output.ingredient_nutrition_extra +
                "','" + output.ingredient_fat_standard + "','" + output.ingredient_fat_extra + "')";

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
                        "message": "Ingredient Added Successfully"
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
exports.getAllIngredients = (req, res) => {
    connection.query('SELECT * from ingredients', function (error, results, fields) {
        if (error) {
            res.send({
                "status": 500,
                "error": error,
                "response": null
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
}