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
var mq_client = require('../rpc/client');

function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
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
		console.log("In passport authenticate");
		var validLogin = { "flag" : false, "username" : null};
        var encrpassword = encrypt(password);
        var currTime = getCurrentTime();
        var msg_payload = {username : username, password : password}
    	mq_client.make_request('signin_queue',msg_payload, function(err,result){
    		if(result.err){
    			throw err;
    			done(true, false);
    		}
    		else 
    		{
    			done(null, result.username);
    		}  
    	});
   }));    
}
  
