//var mysql = require('./util.database');
//var session = require('./func.session');
var dateFormat = require('dateformat');
//var logger = require('./util.logger');
var mongoProductCollection = "product_detail";
var mongoBidLogCollection = "bid_log";
var mongoBidTransactionCollection = "bid_transaction";
var mongo = require("./mongo");
var mongoDatabaseUrl = "mongodb://localhost:27017/ebay";


var cronjob = require('cron').CronJob;

function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
}

function getOpenBids(){
	var conditions = {product_bid_flag : "yes", product_sold_flag : "no"};
	return conditions;
}

var bidJob = new cronjob('30 * * * * *', function(){
	
		mongo.connect(mongoDatabaseUrl, function(connection){
			var collection = mongo.collection(mongoProductCollection);
			var fields = {product_id : 1, product_name : 1,  product_bid_end_time : 1, current_bidder : 1, current_bid : 1 }
			var query = getOpenBids();
			collection.find(query, fields).toArray(function(err, results){
				if(err)
				{
					console.log('Not able to fetch Product Data');
				}
				else
				{
					var currTime = getCurrentTime();
					var bidEndtime;
					for(var i = 0; i< results.length; i++)
					{
						
						bidEndtime = dateFormat(results[i].product_bid_end_time,"yyyy-mm-dd HH:MM:ss");
						if(bidEndtime < currTime)
						{
							updateBidFlag(results[i].product_id);
							recordBidTransaction(results[i].current_bidder, results[i].product_id, results[i].product_name, results[i].current_bid);
						}
					}
				}
			});	
			
		})
	}, 
	function(){
		console.log("cronjob stopped")
		
	}, 
	true,
	'America/Los_Angeles');

bidJob.start();

function updateBidFlag(product_id){

	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection(mongoProductCollection);
		collection.update({product_id : parseInt(product_id)}, {$set : {product_sold_flag : "yes"}}, function(err, num, status){
	   		if(err)
	   		{
	   			console.log("Error in updation")
	   		}
	   	});
	});
}



function recordBidTransaction(bidder, product_id, product_name, bid_amount){
	
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		var counterBidTransaction = mongo.collection("counterBidTransaction");
		
		counterBidTransaction.findAndModify(
			{_id:"bidtrans_id"},
			[],
			{$inc:{sequence_value:1}}, 
			{new : true},
			function(err,doc){
				if(err)
				{
					console.log("Unsuccessful Transaction");
					response = { valid: false, product_id: null, message : null}
				}	
				else
				{
					collection.update({username : bidder },{ $push : { bidswon : {
						trans_id : doc.value.sequence_value,
						trans_type : 3, 
						username : bidder, 
						product_id: product_id, 
						product_name : product_name,
						trans_amount : bid_amount, 
						product_quantity : 1, 
						trans_time: getCurrentTime(), 
						paid_flag : "N"}
						}},
						function(err, records){
							if(err)
							{
								response = { valid: false, product_id: null, message : null}
							}
							else
							{
								response = { valid: true, product_id: null, message : null};	
							}
					});
				}	
			}
		);
	});	
}


exports.updateBidLog = function(message, callback){
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		var counterBidLog = mongo.collection("counterBidLog");
		
		counterBidLog.findAndModify(
			{_id:"bid_id"},
			[],
			{$inc:{sequence_value:1}}, 
			{new : true},
			function(err,doc){
				if(err)
				{
					console.log("Unsuccessful Transaction");
					response = { valid: false, product_id: null, message : null}
					callback(null,response);
				}	
				else
				{
					collection.update({username : message.bidder },{ $push : { bids : {
						bid_id : doc.value.sequence_value,
						product_id : message.product_id,
						product_name : message.product_name,
						bid_amount : parseFloat(message.bidamount),
						bidder : message.bidder,
						bid_time : getCurrentTime() } } },
						function(err, records){
							if(err)
							{
								console.log("Unsuccessful Transaction");
								response = { valid: false, product_id: null, message : null}
								callback(null,response);
							}
							else
							{
								response = { valid: true, product_id: null, message : null}
								console.log("bid log updated");
								callback(null,response);
							}
					});
				}	
			}
		);
	});
}

exports.updateProductTable = function(message, callback){
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection(mongoProductCollection);
		collection.update({product_id : parseInt(message.product_id)}, {$set : {current_bid : parseFloat(message.bidamount) , current_bidder : message.bidder}}, function(err, num, status){
	   		if(err)
	   		{
	   			console.log("Error in updation")
	   			callback(null,{error : true});
	   		}
	   		else
	   		{
	   			callback(null, {error : false})
	   		}
	   	});
	});
}


exports.checkout = function(message, callback){
	
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		collection.update({username : message.username}, {$pull : {bidswon : { product_id : parseInt(message.product_id)}}}, function(err, num, status){
	   		if(err)
	   		{
	   			console.log("Error in updation")
	   		}
	   	});
	});
	
	mongo.connect(mongoDatabaseUrl, function(connection){
	var counterTransaction = mongo.collection("counterTransaction");
	var collection = mongo.collection("user_detail");
	counterTransaction.findAndModify(
			{_id:"transaction_id"},
			[],
			{$inc:{sequence_value:1}}, 
			{new : true},
			function(err,doc){
				if(err)
				{
					console.log("Unsuccessful Transaction");
					response = { valid: false, product_id: null, message : null}
				}	
				else
				{
					collection.update({username : message.username },{ $push : { orders : {trans_id : doc.value.sequence_value,
						trans_type : 3,
						username : message.username,
						product_id : message.product_id,
						product_name : message.product_name,
						trans_amount : message.bid_amount,
						product_quantity : 1,
						trans_time : getCurrentTime() } } },
						function(err, records){
							if(err)
							{
								console.log("Unsuccessful Transaction");
								response = { valid: false, product_id: null, message : null}
								callback(null, response);
							}
							else
							{
								callback(null,response)
							}
								
					});
				}	
			}
		);
	});
}
