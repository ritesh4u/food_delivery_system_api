exports.getalluser = function (req, res) {
	connection.query('SELECT * from customers', function (error, results, fields) {
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
};

exports.getuserbynumber = function (req, res) {
	connection.query('SELECT * from user_info where mobile_no =' + req.query.mobile_no, function (error, results, fields) {
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
};

exports.addnewuser = (req, res) => {
	if (req.body.password == undefined || req.body.dob == undefined || req.body.address == undefined || req.body.email == undefined || req.body.name === undefined || req.body.mobile_no == undefined) {
		res.send({
			"status": 200,
			"error": true,
			"response": {},
			"message": "All fields are complsary"
		});
	} else {
		let sql = "INSERT INTO customers (mobile_no,name,email,address,dob,password) VALUES('" + req.body.mobile_no + "','" + req.body.name + "','" + req.body.email + "','" + req.body.address + "','" + req.body.dob + "','" + req.body.password + "')";
		connection.query(sql, (error, result) => {
			if (error) {
				if (error.code == 'ER_DUP_ENTRY') {
					res.send({
						"status": 200,
						"error": true,
						"response": {},
						"message": "Email Id is already register"
					});
				} else
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
					"response": result,
					"message": "You have Registered SuccessFully"
				});
			}
		});
	}
};

exports.updateuser = (req, res) => {
	let sql = "UPDATE customers SET name='" + req.body.name + "',address = '" + req.body.address + "', dob='" + req.body.dob + "' WHERE mobile_no = '" + req.body.mobile_no + "'";
	connection.query(sql, (error, result) => {
		if (error) {
			res.send({
				"status": 500,
				"error": error,
				"response": null
			});
		} else {
			res.send({
				"status": 200,
				"error": false,
				"response": result
			});
		}
	});
};

exports.deleteuser = (req, res) => {
	let sql = "DELETE FROM customers where mobile_no='" + req.body.mobile_no + "'";
	connection.query(sql, (error, result) => {
		if (error) {
			res.send({
				"status": 500,
				"error": error,
				"response": null
			});
		} else {
			res.send({
				"status": 200,
				"error": false,
				"response": result
			});
		}
	});
};

exports.loginuser = (req, res) => {
	if (req.body.email == undefined || req.body.password == undefined) {
		res.send({
			"status": 200,
			"error": true,
			"response": [],
			"message": "all fields are compulsary"
		});
	} else {
		let sql = "SELECT * FROM customers where email='" + req.body.email + "' AND password = '" + req.body.password + "'";
		connection.query(sql, (error, result) => {
			if (error) {
				console.log(error);
				res.send({
					"status": 200,
					"error": true,
					"response": null,
					"message": "Internal server problem",
				});
			} else {
				if (result.length > 0) {
					for (let i = 0; i < result.length; i++) {
						delete result[i].password
					}
					res.send({
						"status": 200,
						"error": false,
						"response": result[0],
						"message": "valid user"
					});
				} else {
					res.send({
						"status": 200,
						"error": true,
						"response": {},
						"message": "Invalid user"
					});
				}
			}
		});
	}
};