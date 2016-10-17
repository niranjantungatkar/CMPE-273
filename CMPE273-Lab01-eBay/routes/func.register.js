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


function checkUsernameExists(validRegistration, username){
	
	var usernameAlreadyExists = true;
	
	mysql.fetchData(function(err,results) {
		if(err)
		{
			
			setValidregistrationFalse(validRegistration);
			usernameAlreadyExists = true;
			throw err;
		}
		else
		{
			if(results[0].cnt > 0)
			{
			
				setValidregistrationUserExists(validRegistration);
				usernameAlreadyExists = true;
			}
			else
			{	
				
				usernameAlreadyExists = false;
			}
		}
	}, getUserQuery(username));
	
	return usernameAlreadyExists;
}



function registerUser(username,password,FirstName,LastName,Telephone, validRegistration)
{
	
	var insertQuery = getInsertQuery(username,password,FirstName,LastName,Telephone);
	var registrationFlag = false;
	
	mysql.updateData(function(err,results) {
		if(err)
		{
			
			setValidregistrationFalse(validRegistration);
			throw err;
		}
		else
		{
			
			setValidregistrationUserAdded(validRegistration);
			registrationFlag = true;
		}
	}, insertQuery);
	return registrationFlag;
}

function encrypt(password)
{
	var cipher = crypto.createCipher(algorithm, password);
	return cipher;
}


exports.addUser = function(req, res){
	
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
				console.log(validRegistration.flag+' '+validRegistration.message);
				res.send(validRegistration);
			}
			else
			{
								
				mysql.updateData(function(err,results) {
					if(err)
					{
						
						validRegistration = setValidregistrationFalse(validRegistration);
						console.log(validRegistration.flag+' '+validRegistration.message);
						res.send(validRegistration);
						throw err;
					}
					else
					{
						
						validRegistration = setValidregistrationUserAdded(validRegistration);
						console.log(validRegistration.flag+' '+validRegistration.message);
						res.send(validRegistration);
					}
				}, getInsertQuery(username,password,FirstName,LastName,Telephone));

			}
		}
	}, getUserQuery(username));
	
	
};