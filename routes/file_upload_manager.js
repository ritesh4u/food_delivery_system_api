//for reading multipart request
var formidable = require('formidable');
//file system handeling
var fs = require('fs');
//for moving file feom old path to new path
var mv = require('mv');
exports.saveingredientImage = function (req, imageUploadcallback) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (error, fields, files) {
        if (fields.ingredient_name != undefined && fields.ingredient_description != undefined &&
            fields.ingredient_nutrition_standard != undefined && fields.ingredient_nutrition_extra != undefined &&
            fields.ingredient_fat_standard != undefined && fields.ingredient_fat_extra != undefined) {
            var dbStorePath = '/ingredients/' + fields.ingredient_name + new Date().getMilliseconds() + ".jpg";
            var newpath = __dirname + "/.." + dbStorePath;
            mv(files['image'].path, newpath, function (err) {
                if (err) {
                    console.log(err)
                    imageUploadcallback(true, {
                        ingredient_image_url: "",
                        ingredient_name: "",
                        ingredient_description: "",
                        message: "something went wrong"
                    });
                    return;
                }
                console.log('File uploaded and moved!');
                console.log(JSON.stringify(fields));
                imageUploadcallback(false, {
                    ingredient_image_url: dbStorePath,
                    ingredient_name: fields.ingredient_name,
                    ingredient_description: fields.ingredient_description,
                    ingredient_nutrition_standard: fields.ingredient_nutrition_standard,
                    ingredient_nutrition_extra: fields.ingredient_nutrition_extra,
                    ingredient_fat_standard: fields.ingredient_fat_standard,
                    ingredient_fat_extra: fields.ingredient_fat_extra
                });
                return;
            });
        } else {
            imageUploadcallback(true, {
                ingredient_image_url: "",
                ingredient_name: "",
                ingredient_description: "",
                message: "all fields are compulsary"
            });
            return;
        }
    });
}
exports.saveRecipeImage = function (req, imageUploadcallback) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (error, fields, files) {
        if (fields.menu_item_name != undefined && fields.menu_item_description != undefined &&
            fields.menu_item_ingredients_array != undefined && fields.menu_item_price != undefined) {
            var dbStorePath = '/recipes/' + fields.menu_item_name + new Date().getMilliseconds() + ".jpg";
            var newpath = __dirname + "/.." + dbStorePath;
            mv(files['image'].path, newpath, function (err) {
                if (err) {
                    console.log(err)
                    imageUploadcallback(true, {
                        recipe_image_url: "",
                        recipe_name: "",
                        recipe_description: "",
                        recipe_price: "",
                        recipe_ingredients_array: "",
                        message: "something went wrong"
                    });
                    return;
                }
                console.log('File uploaded and moved!');
                console.log(JSON.stringify(fields));
                imageUploadcallback(false, {
                    recipe_image_url: dbStorePath,
                    recipe_name: fields.menu_item_name,
                    recipe_description: fields.menu_item_description,
                    recipe_price: fields.menu_item_price,
                    recipe_ingredients_array: fields.menu_item_ingredients_array,
                });
                return;
            });
        } else {
            imageUploadcallback(true, {
                recipe_image_url: "",
                recipe_name: "",
                recipe_description: "",
                recipe_price: "",
                recipe_ingredients_array: "",
                message: "all fields are compulsary"
            });
            return;
        }
    });
}

exports.saveProfilePic = function (req, imageUploadcallback) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (error, fields, files) {
        if (fields.user_id != undefined) {
            var dbStorePath = '/profile_pic/' + "user_" + fields.user_id + ".jpg";
            var newpath = __dirname + "/.." + dbStorePath;
            mv(files['image'].path, newpath, function (err) {
                if (err) {
                    console.log(err)
                    imageUploadcallback(true, {
                        message: "something went wrong"
                    });
                    return;
                }
                console.log('File uploaded and moved!');
                console.log(JSON.stringify(fields));
                imageUploadcallback(false, {});
                return;
            });
        } else {
            imageUploadcallback(true, {
                message: "all fields are compulsary"
            });
            return;
        }
    });
}