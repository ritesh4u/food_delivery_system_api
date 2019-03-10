var fileManager = require("./file_upload_manager");
exports.addnewingrident = (req, res) => {
    fileManager.saveIngridentImage(req, function (error, output) {
        if (!error) {
            let sql = "INSERT INTO ingridents (ingrident_name,ingrident_description,ingrident_image_url)" +
                " VALUES('" + output.ingrident_name + "','" + output.ingrident_description + "','" + output.ingrident_image_url + "')";

            connection.query(sql, (error, result) => {
                if (error) {
                    res.send({
                        "status": 200,
                        "error": true,
                        "response": error,
                        "message": "something went wrong"
                    });
                } else {
                    res.send({
                        "status": 200,
                        "error": false,
                        "response": [],
                        "message": "Ingrident Added Successfully"
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