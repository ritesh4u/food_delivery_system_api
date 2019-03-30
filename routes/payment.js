var paytm_config = require('../paytm/paytm_config').paytm_config;
var paytm_checksum = require('../paytm/checksum');

exports.generateCheckSum = (request, response) => {
    var paramarray = {};
    if (request.body.mid != undefined && request.body.order_id != undefined &&
        request.body.user_id != undefined && request.body.amount != undefined &&
        request.body.callback_url != undefined && request.body.email != undefined &&
        request.body.mobile_no != undefined) {
        paramarray['MID'] = request.body.mid; //Provided by Paytm
        paramarray['ORDER_ID'] = request.body.order_id; //unique OrderId for every request
        paramarray['CUST_ID'] = request.body.user_id; // unique customer identifier 
        paramarray['INDUSTRY_TYPE_ID'] = 'Retail'; //Provided by Paytm
        paramarray['CHANNEL_ID'] = 'WAP'; //Provided by Paytm
        paramarray['TXN_AMOUNT'] = request.body.amount; // transaction amount
        paramarray['WEBSITE'] = 'WEBSTAGING'; //Provided by Paytm
        paramarray['CALLBACK_URL'] = request.body.callback_url //'https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=order2'; //Provided by Paytm
        paramarray['EMAIL'] = request.body.email; // customer email id
        paramarray['MOBILE_NO'] = request.body.mobile_no; // customer 10 digit mobile no.
        paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, res) {
            //console.log(JSON.stringify(res));
            response.send({
                "status": 200,
                "error": false,
                "response": res,
                "message": "checksum generated"
            });

        });
    } else {
        response.send({
            "status": 200,
            "error": true,
            "response": {},
            "message": "all fields are required"
        });
    }
}