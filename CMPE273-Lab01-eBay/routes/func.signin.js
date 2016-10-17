/**
 * @file 		: 	func.signin.js
 * @author		: 	Niranjan Tungatkar
 * @Description : 	contains functions related to signin.
 * @returns 	: 	valid login true and session parameter as the response on success.
 * 			  		valid login false and session parameter as null.
 * @functions	: 	getUserQuery
 * 					getCurrentTime
 * 					getLastLoginUpdateQuery
 * 					checkValidLogin 
 * 					getInvalidLogin
 * 					getValidLogin
 */


var mysql = require('./util.database');
var session = require('./func.session');
var dateFormat = require('dateformat');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr'

function getUserQuery(username, password)
{
	var userQuery = "select count(1) cnt from user_detail where username='"+username+"'and password='"+password+"'";
	return userQuery;
}

function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
}

function getLastLoginUpdateQuery(username)
{
	var lastLoginQuery = "update user_detail set last_login = '"+getCurrentTime()+"' where username = '"+username+"'";
	return lastLoginQuery;
}

function getInvalidLogin(validLogin){
	validLogin.flag = false;
	validLogin.username = null;
	return validLogin;
}

function getValidLogin(validLogin, username){
	validLogin.flag = true;
	validLogin.username = username;
	return validLogin;
}

function encrypt(password)
{
	var cipher = crypto.createCipher(algorithm, password);
	return cipher;
}

exports.checkValidLogin = function(req, res){
	
	var validLogin = { "flag" : false, "username" : null};
	
	var username = req.param('username');
	var password = encrypt(req.param('password'));
	req.session.username = "";
	var userQuery = getUserQuery(username,password);
	
	mysql.fetchData(function(err,results) {
		if(err)
		{
			res.send(getInvalidLogin(validLogin));
			throw err;
		}
		else
		{
			if(results[0].cnt == 1)
			{
				
				
				//Initialize the session
				session.setSession(req, username);
				
				//get validLogin object
				getValidLogin(validLogin, username);
								
				//Update the last login of the user
				mysql.updateData(function(err, results) {
					if(err)
					{
						console.log('Not able to update the last Login');
					}
					else
					{
						console.log('Last Login updated!');
					}
					
				}, getLastLoginUpdateQuery(username));
				//send the valid response back
				res.send(validLogin);
			}
			else
			{
				
				//send invalid login response back
				res.send(getInvalidLogin(validLogin));
			}
		}
	}, userQuery);
};