var fileManager = require("./file_upload_manager");
exports.addnewrecepie = (req, res) => {
    fileManager.saveRecepieImage(req, function (error, output) {
        if (!error) {
            let sql = "INSERT INTO recepies (recepie_name,recepie_description,recepie_price,recepie_image_url,ingredients_array)" +
                " VALUES('" + output.recepie_name + "','" + output.recepie_description + "','" +
                output.recepie_price + "','" + output.recepie_image_url + "','" + output.recepie_ingredients_array + "')";

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