//for reading multipart request
var formidable = require('formidable');
//file system handeling
var fs = require('fs');
//for moving file feom old path to new path
var mv = require('mv');
exports.saveIngridentImage = function (req, imageUploadcallback) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (error, fields, files) {
        if (fields.ingrident_name != undefined && fields.ingrident_description != undefined) {
            var dbStorePath = '/ingredients/' + fields.ingrident_name + new Date().getMilliseconds() + ".jpg";
            var newpath = __dirname + "/.." + dbStorePath;
            mv(files['image'].path, newpath, function (err) {
                if (err) {
                    console.log(err)
                    imageUploadcallback(true, {
                        ingrident_image_url: "",
                        ingrident_name: "",
                        ingrident_description: "",
                        message: "something went wrong"
                    });
                    return;
                }
                console.log('File uploaded and moved!');
                console.log(JSON.stringify(fields));
                imageUploadcallback(false, {
                    ingrident_image_url: dbStorePath,
                    ingrident_name: fields.ingrident_name,
                    ingrident_description: fields.ingrident_description
                });
                return;
            });
        } else {
            imageUploadcallback(true, {
                ingrident_image_url: "",
                ingrident_name: "",
                ingrident_description: "",
                message: "all fields are compulsary"
            });
            return;
        }
    });
}