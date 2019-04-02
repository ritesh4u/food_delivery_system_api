exports.storeToken = (req, res) => {

    if (req.body.user_id == undefined || req.body.token == undefined) {
        res.send({
            "status": 200,
            "error": true,
            "response": {},
            "message": "all fields required"
        });
        return;
    }

    let sql = "UPDATE firebase_ids SET firebase_token='" + req.body.token + "' where user_id=" + parseInt(req.body.user_id);
    connection.query(sql, function (error, output) {
        res.send({
            "status": 200,
            "error": true,
            "response": {},
            "message": "token updated successfully"
        });
    });
};
exports.sendNotification = (noti_title, noti_message, caallback) => {
    var FCM = require('fcm-node');
    var serverKey = 'AAAAeUj5-Kk:APA91bHP9s8OeguJrXOsMSyc8v-FLASk7krpgh3qKmigB4MYQqdKX_VAWGnsHqOnij8TOmGkM26rxS3kx5fwX4Cy5kZhRqTC_OU62diCfrQRPaAAp3uSLq5A4VxkSwKP8wuJT4oXuCEg'; //put your server key here
    var fcm = new FCM(serverKey);
    var sql = "select * from firebase_ids where user_id=0";
    connection.query(sql, function (err1, output1) {
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: output1[0].firebase_token,
            collapse_key: 'your_collapse_key',

            notification: {
                title: noti_title,
                body: noti_message
            },

            data: { //you can send only notification or only data(or include both)
                my_key: 'my value',
                my_another_key: 'my another value'
            }
        };
        //  console.log(output1)
        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                // console.log("Successfully sent with response: ", response);
                caallback()

            }
        });
    })
}