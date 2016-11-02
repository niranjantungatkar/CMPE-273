var mongo = require("./mongo");
var mongoDatabaseUrl = "mongodb://localhost:27017/ebay";
var dateFormat = require('dateformat');
var mongoCollection = "product_detail";

exports.returnAllSoldProducts = function(message, callback){
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection(mongoCollection);
		collection.find({product_adv : message.username}, {product_name : 1,product_sold_flag : 1, current_bidder : 1, current_bid : 1}).toArray(function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
				response = {flag : false, items : null}
				callback(err,response);
			}
			else
			{
				response = {flag : true, items : results}
				callback(null,response);
			}
		});
	});
}

exports.returnAllboughtproducts = function(message, callback){
	var response = {flag : false, items : null};
	mongo.connect(mongoDatabaseUrl,function(connection){
		var collection = mongo.collection("user_detail");
		collection.findOne({username : message.username},{orders : 1},function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
				response = {flag : false, items : null}
				callback(err, response);
			}
			else
			{
				console.log("Check results: "+results);
				response = {flag : true, items : results.orders}
				callback(null,response);
			}
		});
	});
}


exports.returnUserLastLoginTime = function(message, callback){
	var response = {};
	console.log("In service : Last Login");
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		collection.findOne({username : message.username}, {last_login : 1}, function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
				response = {flag : false, items : null}
				callback(response);
			}
			else
			{
				response.flag = true;
				var date = new Date(results.last_login);
				console.log("Last Loging fetched");
				response.last_login = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
				callback(null,response);
			}
		});
	});
}

exports.returnUserDetails = function(message, callback){
	console.log("in service : user details")
	var response = {};
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		collection.findOne({username : message.username}, {first_name : 1,last_name : 1, birthday :1, about:1, telephone: 1, location:1, handle : 1}, function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
				response = {flag : false, items : null}
				callback(null,response);
			}
			else
			{
				response.flag = true;
				response.message = null;
				response.user_det = results;
				console.log("user details fetched")
				callback(null,response);
			}
		});
	});
}

exports.updateContact = function(message, callback){
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		collection.update({username : message.username}, {$set : {telephone : message.telephone}}, function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
				callback(err,{error: true})
			}
			else
			{
				console.log("Contact updated")
				callback(null,{error: false});
			}
		});
	});
}

exports.updateAddress = function(message, callback){
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		collection.update({username : message.username}, {$set : {location : message.location}}, function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
				callback(err,{error: true})
			}
			else
			{
				console.log("Address updated")
				callback(null,{error: false});
			}
		});
	});
}

exports.updatePersonalDet = function(message, callback){
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		collection.update({username : message.username}, {$set : {first_name : message.fname, last_name : message.lname, birthday : message.bday, about : message.about, handle : message.handle}}, function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
				callback(err,{error: true});
			}
			else
			{
				console.log("Personal Data updated")
				callback(err,{error: false});
			}
		});
	});
}

exports.returnSuccessfulUserBids = function(message, callback){
	mongo.connect(mongoDatabaseUrl,function(connection){
		var collection = mongo.collection("user_detail");
		collection.findOne({username : message.username},{bidswon : 1},function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
				response = {flag : false, items : null}
				callback(err,response);
			}
			else
			{
				console.log("Check results: "+results);
				response = {flag : true, items : results.bidswon}
				callback(null,response);
			}
		});
	});

} 

exports.returnAllUserBidDetails = function(message, callback){
	
	mongo.connect(mongoDatabaseUrl,function(connection){
		var collection = mongo.collection("user_detail");
		collection.findOne({username : message.username},{bids : 1},function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
				response = {flag : false, items : null}
				callback(err,response);
			}
			else
			{
				response = {flag : true, items : results.bids}
				callback(null,response);
			}
		});
	});
}