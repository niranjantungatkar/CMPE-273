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
          		
      
    	/*mq_client.make_request('signin_queue',msg_payload, function(err,userDetails){
    		console.log("Making request");
    		if(err){
    			done(true, false);
    		}
    		else 
    		{
    			done(null, userDetails.user);
    		}  
    	});*/
   }));    
}
  
