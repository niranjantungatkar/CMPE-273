var mongo = require("./mongo");
var mongoDatabaseUrl = "mongodb://localhost:27017/ebay";
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var dateFormat = require('dateformat');


function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
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

exports.register_user = function(message, callback) {
	var validRegistration = { "flag" : false, "message": null};
	var username = message.username;
	var password = encrypt(message.password);
	var first_name = message.fname;
	var last_name = message.lname;
	var telephone = message.telphone;
	
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		collection.findOne({username : username}, function(err, userDetails){
			if(err)
			{
				validRegistration = setValidregistrationFalse(validRegistration);
				callback(err,validRegistration);
				throw err;
			}
			if(userDetails != null && userDetails != undefined && userDetails != "" ){
				if(userDetails.username != null ||  userDetails.username != undefined || userDetails.username != "" )
				{
					validRegistration = setValidregistrationUserExists(validRegistration);
					callback(null,validRegistration);
				}		
			}
			else
			{
				collection.insert({
					username : username,
					password : password,
					first_name : first_name,
					last_name : last_name,
					telephone : telephone
				});	
				validRegistration = setValidregistrationUserAdded(validRegistration);
				callback(null,validRegistration);
			}
		});			
	});	
}