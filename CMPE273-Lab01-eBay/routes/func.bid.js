var mysql = require('./util.database');
var session = require('./func.session');
var dateFormat = require('dateformat');
var logger = require('./util.logger');

var cronjob = require('cron').CronJob;

var soap = require('soap');
var baseURL = "http://localhost:8080/eBay-WebService/services";

var bidJob = new cronjob('30 * * * * *', function(){
	
		mysql.fetchData(function(err, results) {
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
							recordBidTransaction(results[i].current_bidder, results[i].product_id, results[i].current_bid);
						}
					}
				}
		
			}, getBidEndTime());
	}, 
	function(){
		console.log("cronjob stopped")
		
	}, 
	true,
	'America/Los_Angeles');

bidJob.start();

function updateBidFlag(product_id){
	
	mysql.fetchData(function(err, results) {
		if(err)
		{
			console.log('Not able to fetch Product Data');
		}

		
	}, getUpdateBidFlagQuery(product_id));
}

function getUpdateBidFlagQuery(product_id){
	var query = "update product_detail set product_sold_flag = 'yes' where product_id = '"+product_id+"'";
	return query
}

function recordBidTransaction(bidder, product_id, bid_amount){
	
	mysql.fetchData(function(err, results) {
		if(err)
		{
			console.log('Not able to fetch Product Data');
		}

		
	}, gettransactionQuery(bidder, product_id, bid_amount));
	
}

function gettransactionQuery(username, product_id, bid_amount)
{
	var transactionQuery = "INSERT INTO bid_transaction (trans_id, trans_type, username,product_id, trans_amount, product_quantity, trans_time,paid_flag) VALUES"+
							"(null, '3', '"+username+"', '"+product_id+"', '"+bid_amount+"', '1', '"+getCurrentTime()+"', 'N')"
	return transactionQuery;
}


function getBidEndTime(){
	var query = "select distinct product_id, product_bid_end_time, current_bidder, current_bid from ebay.product_detail where "+
	"product_bid_flag = 'yes' and "+
	"product_sold_flag = 'no'";
	return query;
}

function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
}

function getInsertBidInfoQuery(product_id, bidamount, bidder)
{
	var BidLogString = product_id+" | "+bidder+" | "+bidamount+" | "+getCurrentTime()+"\n";
	logger.writeBidInfoLog(BidLogString);
}

function getProductUpdateQuery(product_id, bidder,  bidamount)
{
	var query = "update product_detail set current_bid = '"+bidamount+"', current_bidder = '"+bidder+"' where product_id = '"+product_id+"'";
	return query;
}

function updateProductTable(product_id, bidder, bidamount,res)
{
	var url = baseURL+"/Bidding?wsdl";
	var option = {
			ignoredNamespaces : true	
		};
	soap.createClient(url,option, function(err, client) {
		var productinfo = {product_id : product_id,bidder : bidder, bidamount : bidamount}
		client.updateProductTable(productinfo, function(err, result) {  
			if(err)
			{
				console.log("Unable to update bid log");
				res.send({flag : false, message : "Unable to update bid log"});
			}
			else
			{
				res.send({flag : true, message : "Unable to update bid log"});
			}
			
	    });
	});

}


function updateBidLog(product_id, bidamount, bidder,res)
{

	getInsertBidInfoQuery(product_id, bidamount, bidder);
	var url = baseURL+"/Bidding?wsdl";
	var option = {
			ignoredNamespaces : true	
		};
	soap.createClient(url,option, function(err, client) {
		var productinfo = {product_id : product_id,bidamount : bidamount, bidder : bidder}
		client.updateBidLog(productinfo, function(err, result) {  
			if(err)
			{
				console.log("Unable to update bid log");
				res.send({flag : false, message : "Unable to update bid log"});
			}
			else
			{
				updateProductTable(product_id, bidder, bidamount,res);
			}
			
	    });
	});

}

exports.enterBid = function (req,res){
	var product_id = req.param('product_id');
	var bidamount = req.param('bidamount');
	var bidder = req.param('bidder');
	
	updateBidLog(product_id, bidamount, bidder,res);
}



exports.checkout = function(req,res)
{
	var username = req.param('username');
	var product_id = req.param('product_id');
	var bid_amount = req.param('bid_amount');
	
	
	var url = baseURL+"/Bidding?wsdl";
	var option = {
			ignoredNamespaces : true	
		};
	soap.createClient(url,option, function(err, client) {
		var userinfo = {product_id : product_id, username : username}
		client.update_bid_transaction(userinfo, function(err, result) {  
			if(err)
			{
				console.log("Unable to update bid transaction");
				res.send({flag : false, message : "Unable to update bid log"});
			}
			else
			{
				var transDet = {username : username, product_id : product_id, bid_amount, time : getCurrentTime()}
				client.update_transaction_detail(transDet, function(err,result){
					res.send({flag : true, message: "Updated successfully"});
				});
			}
			
	    });
	});
	
}




