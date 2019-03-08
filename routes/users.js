exports.getalluser = function (req, res) {
	connection.query('SELECT * from customers', function (error, results, fields) {
		if (error) {
			res.send({ "status": 500, "error": error, "response": null });
			//If there is error, we send the error in the error section with 500 status
		} else {
			res.send({ "status": 200, "error": false, "response": results });
			//If there is no error, all is good and response is 200OK.
		}
	});
};

exports.getuserbynumber = function (req, res) {
	connection.query('SELECT * from user_info where mobile_no =' + req.query.mobile_no, function (error, results, fields) {
		if (error) {
			res.send({ "status": 500, "error": error, "response": null });
			//If there is error, we send the error in the error section with 500 status
		} else {
			res.send({ "status": 200, "error": false, "response": results });
			//If there is no error, all is good and response is 200OK.
		}
	});
};

exports.addnewuser = (req, res) => {
	let sql = "INSERT INTO customers (mobile_no,name,address,dob) VALUES(" + req.body.mobile_no + ",'" + req.body.name + "','" + req.body.address + "','" + req.body.dob + "')";
	connection.query(sql, (error, result) => {
		if (error) {
			res.send({ "status": 500, "error": error, "response": null });
		} else {
			res.send({ "status": 200, "error": false, "response": result });
		}
	});
};

exports.updateuser = (req, res) => {
	let sql = "UPDATE customers SET name='" + req.body.name + "',address = '" + req.body.address + "', dob='" + req.body.dob + "' WHERE mobile_no = '" + req.body.mobile_no + "'";
	connection.query(sql, (error, result) => {
		if (error) {
			res.send({ "status": 500, "error": error, "response": null });
		} else {
			res.send({ "status": 200, "error": false, "response": result });
		}
	});
};

exports.deleteuser = (req, res) => {
	let sql = "DELETE FROM customers where mobile_no='" + req.body.mobile_no + "'";
	connection.query(sql, (error, result) => {
		if (error) {
			res.send({ "status": 500, "error": error, "response": null });
		} else {
			res.send({ "status": 200, "error": false, "response": result });
		}
	});
};

exports.loginuser = (req, res) => {
	let sql = "SELECT * FROM customers where mobile_no='" + req.body.mobile_no + "' AND password = '" + req.body.password + "'";
	connection.query(sql, (error, result) => {
		if (error) {
			console.log(error);
			res.send({ "status": 500, "error": "Internal server problem", "response": null });
		} else {
			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					delete result[i].password
				}
				res.send({ "status": 200, "error": false, "response": result, "message": "valid user" });
			}
			else {
				res.send({ "status": 200, "error": true, "response": [], "message": "Invalid user" });
			}
		}
	});
};






