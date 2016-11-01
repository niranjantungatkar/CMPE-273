var mongo = require("./mongo");
var mongoDatabaseUrl = "mongodb://localhost:27017/sign_up_db";

function handle_register(msg, callback){
	
	var res = {};
	mongo.connect(mongoDatabaseUrl,function(err,user){
		console.log("connected to the database");
		var user_detail = mongo.collection("user_detail");
		
		user_detail.insert({
			username : msg.username,
			password : msg.pass,
			fname : msg.fname,
			lname : msg.lname,
			contact : msg.tel,
			email : msg.email
		}, function(err, res){
			if(err)
			{
				res.code = "401";
				res.validity = false;
				callback(null,res);
			}
			else
			{
				res.code = "200";
				res.validity = true;
				callback(null,res);
			}
		})	
	})
	
}

function handle_login(msg, callback){
	
	console.log("In handle login");
	var res = {};
	mongo.connect(mongoDatabaseUrl,function(err,user){
		var user_detail = mongo.collection("user_detail");
		user_detail.findOne({username : msg.username, password : msg.pass}, function(err,userDetails){

			if(userDetails != undefined || userDetails != null || userDetails != "")
			{
				console.log("User details found");
				res.validity = true;
				res.user = userDetails;
				callback(null, res);
			}	
			else
			{
				res.validity = false;
				res.user = null;
				callback(null, res);
			}				
		});		
	});
	
}

exports.handle_register = handle_register;
exports.handle_login = handle_login;