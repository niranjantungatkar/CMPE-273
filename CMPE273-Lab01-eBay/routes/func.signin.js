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
	var cipher = crypto.createCipher("aes-256-ctr", "test");
	var pass = cipher.update(password, 'utf8','hex');
	pass = pass + cipher.final('hex');
	return pass;
}

exports.checkValidLogin = function(req, res){
	
	var validLogin = { "flag" : false, "username" : null};
	
	var username = req.param('username');
	var password = encrypt(req.param('password'));
	req.session.username = "";
		
	var url = baseURL+"/Login?wsdl";
	
	var option = {
			ignoredNamespaces : true	
		};
	soap.createClient(url,option, function(err, client) {
		
		var userCred = {username : username, password : password}
		
		client.validLogin(userCred, function(err, result) {  
			if(result.validLoginReturn)
			{
				var userDet = {username : username, time : getCurrentTime()}
				
				client.updateLastLogin(userDet, function(err, result){
					if(err)
					{
						console.log('Not able to update the last Login');
					}
					else
					{
						var validLogin = {};
						session.setSession(req, username);
						getValidLogin(validLogin, username);
						res.send(validLogin);						
					}
				});	
			}
			else
			{
				res.send(getInvalidLogin(validLogin));
			}
	    });
	});	
};