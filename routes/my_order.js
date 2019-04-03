var async = require("async");
var cart = require('./cart')
var tokenUpdate = require('./tokenUpdate')
exports.placeOrder = (req, res) => {
    if (req.body.user_id == undefined || req.body.amount == undefined) {
        res.send({
            "status": 200,
            "error": true,
            "response": {},
            "message": "All field is required"
        });
        return;
    }
    async.waterfall([
        function (callback) {
            var t = new Date();
            var YYYY = t.getFullYear();
            var MM = ((t.getMonth() + 1 < 10) ? '0' : '') + (t.getMonth() + 1);
            var DD = ((t.getDate() < 10) ? '0' : '') + t.getDate();
            var HH = ((t.getHours() < 10) ? '0' : '') + t.getHours();
            var mm = ((t.getMinutes() < 10) ? '0' : '') + t.getMinutes();
            var ss = ((t.getSeconds() < 10) ? '0' : '') + t.getSeconds();

            var time_of_call = new Date().getTime(); //YYYY + '-' + MM + '-' + DD + ' ' + HH + ':' + mm + ':' + ss;
            //  console.log(time_of_call);
            sqlMyOrderQuery = "INSERT INTO my_orders (user_id,order_date,amount) VALUES('" + parseInt(req.body.user_id) + "','" + time_of_call + "'," + req.body.amount + ")";
            connection.query(sqlMyOrderQuery, function (myOrderError, myOrderOutput) {
                callback(null, myOrderOutput.insertId);
            });
        },
        function (my_order_id, callback) {
            var sqlCartItemQuery = "SELECT * from my_cart WHERE user_id =" + parseInt(req.body.user_id);
            connection.query(sqlCartItemQuery, function (cartItemError, cartItemOutput) {
                if (!cartItemError) {
                    callback(null, my_order_id, cartItemOutput);
                }
            });
        },
        function (my_order_id, cart_item_array, callback) {
            addMyOrderDetails(my_order_id, cart_item_array, callback);
        },
        function (cart_item_array, callback) {
            deleteItemFromCart(cart_item_array, callback);
        },
        function (message, callback) {
            tokenUpdate.sendNotification("0", "New Order", "New Order is arrived please check the order", callback)
        }
    ], function (error, result) {
        if (!error) {
            res.send({
                "status": 200,
                "error": false,
                "response": {},
                "message": "Order Placed successfully"
            });
        }

    });
}

var addMyOrderDetails = (my_order_id, cart_item_array, callback) => {
    async.forEachOf(cart_item_array, function (currentObject, key, iteratorCallback) {
        var sqlQrderDetailQuery = "INSERT INTO order_details (order_id,recepie_id,ingredients_contain_scale,quantity) VALUES(" +
            my_order_id + "," + currentObject.recepie_id + ",'" + currentObject.ingredients_contain_scale + "'," + currentObject.quantity + ")";
        connection.query(sqlQrderDetailQuery, function (oderDetailsError, orderDetailsOutput) {
            if (!oderDetailsError) {
                //   console.log(orderDetailsOutput.insertId);
                iteratorCallback();
            }
        });
    }, function (error) {
        if (!error)
            callback(null, cart_item_array);
    });
}
var deleteItemFromCart = (cart_item_array, callback) => {
    async.forEachOf(cart_item_array, function (currentObj, key, deleteSingleCallback) {
        var sqlDeleteCartItemQuery = "DELETE FROM my_cart where my_cart_id =" + currentObj.my_cart_id;
        connection.query(sqlDeleteCartItemQuery, function (deleteError, deleteOutput) {
            if (!deleteError) {
                deleteSingleCallback();
            }
        });
    }, function (error) {
        if (!error) {
            callback(null, "all operation done");
        }
    });
}


exports.myOrders = (req, res) => {

    if (req.body.user_id == undefined) {

        res.send({
            "status": 200,
            "error": true,
            "my_orders": [],
            "message": "All field is required"
        });
        return;
    }
    sqlMyOrderQuery = "";
    if (req.body.user_id == 0) {
        sqlMyOrderQuery = "SELECT * FROM my_orders"
    } else {
        sqlMyOrderQuery = "SELECT * FROM my_orders where user_id = " + req.body.user_id;
    }
    connection.query(sqlMyOrderQuery, function (myOrdersError, myOrdersOutput) {

        if (!myOrdersError) {
            res.send({
                "status": 200,
                "error": false,
                "my_orders": myOrdersOutput,
                "message": "orders found"
            });
        } else {
            res.send({
                "status": 200,
                "error": true,
                "my_orders": [],
                "message": "somthing went wrong"
            });
        }
    });
}
exports.getOrderDetails = (req, res) => {
    if (req.body.order_id != undefined) {
        sqlQuery = "SELECT * from order_details where order_id =" + req.body.order_id;
        connection.query(sqlQuery, function (findError, findOutput) {
            if (!findError) {
                if (findOutput.length > 0) {
                    cart.setIngredientArray(findOutput, function (dataOject) {
                        res.send({
                            "status": 200,
                            "error": false,
                            "cart_details": dataOject,
                            "message": "Order Details found"
                        });
                    });

                } else {
                    res.send({
                        "status": 200,
                        "error": false,
                        "cart_details": [],
                        "message": "No order Details found"
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
exports.updateOrderStatus = (req, res) => {
    async.parallel([
        function (callback) {
            let sql = "UPDATE my_orders SET order_status='" + req.body.status + "' WHERE order_id = '" + req.body.order_id + "'";
            connection.query(sql, (error, result) => {
                callback();
            });
        },
        function (callback) {
            var noti_title = "Order status";
            var noti_message = ""
            if (req.body.status == "1") {
                noti_message = "Your order is accepted"
            } else if (req.body.status) {
                noti_message = "Your order is rejected due to some reason"
            }
            tokenUpdate.sendNotification(req.body.user_id, noti_title, noti_message, callback);
        }
    ], function (errors, results) {
        res.send({
            "error": false,
            "Message": "order Status updated successfully"
        });
    });
}