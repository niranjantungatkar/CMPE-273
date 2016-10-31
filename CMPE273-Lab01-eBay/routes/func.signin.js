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


/*
 * Miscellaneous
 */
var mysql = require('./util.database');
var session = require('./func.session');
var dateFormat = require('dateformat');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
/*
 * Passport
 */
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
/*
 * Mongo
 */
var mongo = require('./util.mongo');
var mongoDatabaseUrl = "mongodb://localhost:27017/ebay";
var mongoCollection = "user_detail";


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
	var crypted = cipher.update(password,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}

module.exports = function(passport) {
	passport.use('signin', new LocalStrategy(function(username, password, done) 
	{		
		var validLogin = { "flag" : false, "username" : null};
        var encrpassword = encrypt(password);
        var currTime = getCurrentTime();
    
        mongo.connect(mongoDatabaseUrl, function(connection)
        {
   			var collection = mongo.collection(mongoCollection);
   			collection.findOne({username : username, password : encrpassword}, function(err, userDetails)
   			{	
   				if(err)
   				{
   					done(err,false);
   				}
   				else
   				{
   					if(userDetails != null && userDetails != undefined && userDetails != "")
   					{
   						if(userDetails.username != null || userDetails.username != undefined || userDetails.username != "")
   						{
   							collection.update({username : userDetails.username}, {
   								$set : {
   									last_login : currTime 
   								}
   							});
   							done(null, userDetails.username);
   						}
   						else
   							done(null, false);
   					}
   					else
   					{   						
   						done(null, false);
   					}			
   				}
   			});			
   		})
   		/*mysql.fetchData(function(err,results) {
		if(err)
		{
			done(err,false);
		}
		else
		{
			if(results[0].cnt == 1)
			{
				getValidLogin(validLogin, username);				
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
				done(null, validLogin.username);
			}
			else
			{
				done(null, false);
			}
		}
	}, userQuery);    */
   		
   		
   }));    
}
  
/*exports.checkValidLogin = function(req, res, next){
	
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
				session.setSession(req, username);							//Initialize the session
				getValidLogin(validLogin, username);						//get validLogin object				
				mysql.updateData(function(err, results) {					//Update the last login of the user
					if(err)
					{
						console.log('Not able to update the last Login');
					}
					else
					{
						console.log('Last Login updated!');
					}		
				}, getLastLoginUpdateQuery(username));
				res.send(validLogin);										//send the valid response back
			}
			else
			{
				res.send(getInvalidLogin(validLogin));						//send invalid login response back
			}
		}
	}, userQuery);
};*/