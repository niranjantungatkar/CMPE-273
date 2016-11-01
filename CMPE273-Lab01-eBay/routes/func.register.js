/**
 * @file 		: 	func.register.js
 * @author		: 	Niranjan Tungatkar
 * @Description : 	contains functions related to user registration.
 * @functions	: 	getUserQuery
 * 					getCurrentTime
 * 					getInsertQuery
 * 					setValidregistrationFalse 
 * 					setValidregistrationUserExists
 * 					setValidregistrationUserAdded
 */
var mysql = require('./util.database');
var mongo = require('./util.mongo');
var dateFormat = require('dateformat');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';

function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
}

function getInsertQuery(username,password,firstname,lastname,telephone)
{
	var InsertQuery = "INSERT INTO user_detail (username, password, first_name, last_name,telephone) VALUES ('"+username+"', '"+password+"', '"+firstname+"', '"+lastname+"', '"+telephone+"')";
	return InsertQuery;
}

function getUserQuery(username)
{
	var userQuery = "select count(1) cnt from user_detail where username='"+username+"'";
	return userQuery;
}

function setValidregistrationFalse(validRegistration)
{
	validRegistration = { "flag" : false, "message" : "Error Occured while registering the user."};
	return validRegistration;
}

function setValidregistrationUserExists(validRegistration)
{
	validRegistration = { "flag" : false, "message" : "Username already exists"};
	return validRegistration;
}

function setValidregistrationUserAdded(validRegistration)
{
	validRegistration = { "flag" : true, "message" : "User was successfully registered"};
	return validRegistration;
}

/*
 * Password encryption
 */
function encrypt(password)
{
	var cipher = crypto.createCipher(algorithm, password);
	var crypted = cipher.update(password,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}

/*
 * Add user Function for Mongodb.
 */
exports.addUser = function(req, res){
	var validRegistration = { "flag" : false, "message": null};
	var username = req.param('username');
	var password = encrypt(req.param('password'));
	var FirstName = req.param('FirstName');
	var LastName = req.param('LastName');
	var Telephone = req.param('Telephone');

	mongo.connect("mongodb://localhost:27017/ebay", function(connection){
		var collection = mongo.collection("user_detail");
		collection.findOne({username : username}, function(err, userDetails){
			if(err)
			{
				validRegistration = setValidregistrationFalse(validRegistration);
				res.send(validRegistration);
				throw err;
			}
			if(userDetails != null && userDetails != undefined && userDetails != "" ){
				if(userDetails.username != null ||  userDetails.username != undefined || userDetails.username != "" )
				{
					validRegistration = setValidregistrationUserExists(validRegistration);
					res.send(validRegistration);
				}		
			}
			else
			{
				collection.insert({
					username : username,
					password : password,
					first_name : FirstName,
					last_name : LastName,
					telephone : Telephone
				});	
				validRegistration = setValidregistrationUserAdded(validRegistration);
				res.send(validRegistration);
			}
		});			
	});	
};



/*
 * Add user Function for Mysql. Needs to be removed
 */
/*exports.addUser = function(req, res){
	
	var validRegistration = { "flag" : false, "message": null};
	var username = req.param('username');
	var password = encrypt(req.param('password'));
	var FirstName = req.param('FirstName');
	var LastName = req.param('LastName');
	var Telephone = req.param('Telephone');
	
	mysql.fetchData(function(err,results) {
		if(err)
		{
			validRegistration = setValidregistrationFalse(validRegistration);
			res.send(validRegistration);
			throw err;
		}
		else
		{
			if(results[0].cnt > 0)
			{
				validRegistration = setValidregistrationUserExists(validRegistration);
				res.send(validRegistration);
			}
			else
			{
				mysql.updateData(function(err,results) {
					if(err)
					{
						validRegistration = setValidregistrationFalse(validRegistration);	
						res.send(validRegistration);
						throw err;
					}
					else
					{
						validRegistration = setValidregistrationUserAdded(validRegistration);
						res.send(validRegistration);
					}
				}, getInsertQuery(username,password,FirstName,LastName,Telephone));
			}
		}
	}, getUserQuery(username));	
};*/

