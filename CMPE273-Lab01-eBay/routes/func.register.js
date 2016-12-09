/**
 * @file 		: 	func.register.js
 * @author		: 	Niranjan Tungatkar
 * @Description : 	contains functions related to user registration.
 * @returns 	: 	.
 * @functions	: 	getUserQuery
 * 					getCurrentTime
 * 					getLastLoginUpdateQuery
 * 					checkValidLogin 
 * 					getInvalidLogin
 * 					getValidLogin
 */
var mysql = require('./util.database');
var dateFormat = require('dateformat');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';


var soap = require('soap');
var baseURL = "http://localhost:8080/eBay-WebService/services";



function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
}


function encrypt(password)
{
	//var cipher = crypto.createCipher(algorithm, password);
	var cipher = crypto.createCipher("aes-256-ctr", "test");
	var pass = cipher.update(password, 'utf8','hex');
	pass = pass + cipher.final('hex');
	return pass;
}


exports.addUser = function(req, res){
	
	var validRegistration = { "flag" : false, "message": null};
	var username = req.param('username');
	var password = encrypt(req.param('password'));
	var FirstName = req.param('FirstName');
	var LastName = req.param('LastName');
	var Telephone = req.param('Telephone');
	var url = baseURL+"/Register?wsdl";
	
	console.log("Password : "+password);

	var option = {
			ignoredNamespaces : true	
		};
	
	var userCred = {username : username}
	soap.createClient(url,option, function(err, client) {
		client.chkUserExists(userCred, function(err, result) {  
			if(result.chkUserExistsReturn)
			{
				var userDet = {username : username, password : password, first_name : FirstName, last_name : LastName, telephone : Telephone}
				client.addUser(userDet, function(err, result){
					if(err)
					{
						validRegistration = { "flag" : false, "message" : "Internal Server error occurred"};
						res.send(validRegistration);
					}
					else
					{
						validRegistration = { "flag" : true, "message" : "User was successfully registered"};
						res.send(validRegistration);
						
					}
				});	
			}
			else
			{
				validRegistration = { "flag" : false, "message" : "Username already exists"};
				res.send(validRegistration);
			}
	    });
	});	
};