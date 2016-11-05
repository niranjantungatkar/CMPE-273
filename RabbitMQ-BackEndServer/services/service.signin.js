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

function encrypt(password)
{
	var cipher = crypto.createCipher(algorithm, password);
	var crypted = cipher.update(password,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}

exports.verify_signin_details = function (msg, callback){
	var res = {};
	var username = msg.username;
	var encrpassword = encrypt(msg.password)
		
	mongo.connect(mongoDatabaseUrl, function(connection)
    {
		console.log("In mongo");
			var currTime = getCurrentTime();
			var collection = connection.collection("user_detail");
			console.log("Encr Password"+encrpassword);
			collection.findOne({username : username, password : encrpassword}, function(err, userDetails)
			{	
				if(err)
				{
					throw err;
					//done(true,false);
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
							var res = {err : null, username : userDetails.username};
							callback(null, res);
						}
						else
						{
							var res = {err : true, username : null};
							callback(null, res);
						}
							
					}
					else
					{   						
						var res = {err : true, username : null};
						callback(null, res);
					}			
				}
			});			
		});	
}