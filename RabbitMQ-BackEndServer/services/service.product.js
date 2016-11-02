//var mysql = require('./util.database');
//var session = require('./func.session');
var dateFormat = require('dateformat');
var mongo = require("./mongo");
var mongoDatabaseUrl = "mongodb://localhost:27017/ebay";
var mongoCollection = "product_detail";

exports.returnallproducts = function(message, callback){
	
	console.log("Return all products")
	var query = message.query;
	var fields = message.fields;
	mongo.connect(mongoDatabaseUrl, function(connection)
	{
		var collection = mongo.collection(mongoCollection);
		collection.find(query, fields).toArray(function(err, docs){
			if(err)
			{
				console.log('Not able to fetch Product Data');
				console.log("Return products error : "+err)
				callback(err, null);
				
			}
			else
			{
				console.log("Return products no errror :"+docs)
				callback(null,docs);
			}
		});	
	});
}

exports.returnallbidproducts = function(message, callback){
	
	console.log("Return all bid products")
	var query = message.query;
	var fields = message.fields;
	mongo.connect(mongoDatabaseUrl, function(connection)
	{
		var collection = mongo.collection(mongoCollection);
		collection.find(query, fields).toArray(function(err, docs){
			if(err)
			{
				console.log('Not able to fetch Product Data');
				callback(err,null);
			}
			else
			{
				console.log("Bid products no error : "+ docs)
				if(docs != null || docs != undefined || docs != "")
					callback(null,docs)
				else
					callback(null,{})
			}
		});	
	});	
}

exports.returnsinglebidproductinfo = function(message, callback){
	
	var query = message.query;
	var fields = message.fields;
	mongo.connect(mongoDatabaseUrl, function(connection)
	{
		var collection = mongo.collection(mongoCollection);
		collection.findOne(query, fields, function(err, productDetails)
	   	{	
	   		if(err)
	   		{
	   			console.log('Not able to fetch Product Data');
	   			callback(err,null);
	   		}
	   		else
	   		{
				callback(null,productDetails);
			}
	   	});			
	});
}

exports.returnSingleProductInfo = function(message, callback){
	
	var query = message.query;
	var fields = message.fields;
	mongo.connect(mongoDatabaseUrl, function(connection)
	{
		var collection = mongo.collection(mongoCollection);
		collection.findOne(query, fields, function(err, productDetails)
	   	{	
	   		if(err)
	   		{
	   			console.log('Not able to fetch Product Data');
	   			callback(err,null);
	   		}
	   		else
	   		{
				callback(null,productDetails);
			}
	   	});			
	});
}


