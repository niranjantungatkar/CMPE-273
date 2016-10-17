var mysql = require('./util.database');
var session = require('./func.session');
var dateFormat = require('dateformat');
var logger = require('./util.logger');

var cronjob = require('cron').CronJob;

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

function getProductUpdateQuery(product_id, bidder,  bidamount)
{
	var query = "update product_detail set current_bid = '"+bidamount+"', current_bidder = '"+bidder+"' where product_id = '"+product_id+"'";
	return query;
}

function updateProductTable(product_id, bidder, bidamount,res)
{
	mysql.fetchData(function(err, results) {
		if(err)
		{
			console.log('Not able to fetch Product Data');
		}
		else
		{
			res.send(results[0]);
		}
		
	}, getProductUpdateQuery(product_id, bidder, bidamount));

}

function getInsertBidInfoQuery(product_id, bidamount, bidder)
{
	var query = "Insert into bid_log(bid_id, product_id, bid_amount, bidder, bid_time) values(null, '"+product_id+"', '"+bidamount+"', '"+bidder+"', '"+getCurrentTime()+"')";
	var BidLogString = product_id+" | "+bidder+" | "+bidamount+" | "+getCurrentTime()+"\n";
	logger.writeBidInfoLog(BidLogString);
	return query;
}


function updateBidLog(product_id, bidamount, bidder,res)
{
	mysql.fetchData(function(err, results) {
		if(err)
		{
			console.log('Not able to fetch Product Data');
		}
		else
		{
			res.send(results[0]);
		}
		
	}, getInsertBidInfoQuery(product_id, bidamount, bidder));

}

exports.enterBid = function (req,res){
	var product_id = req.param('product_id');
	var bidamount = req.param('bidamount');
	var bidder = req.param('bidder');
	
	updateProductTable(product_id, bidder, bidamount,res);
	updateBidLog(product_id, bidamount, bidder,res);
}



function update_bid_transaction(product_id, username)
{
	var query = "update bid_transaction set paid_flag = 'Y' where product_id = '"+product_id+"' and username = '"+username+"'";
	return query;
}


function update_transaction_detail(username, product_id, bid_amount)
{
	var transactionQuery = "INSERT INTO transaction_detail (trans_id, trans_type, username,product_id, trans_amount, product_quantity, trans_time) VALUES"+
							"(null, '3', '"+username+"', '"+product_id+"', '"+bid_amount+"', '1', '"+getCurrentTime()+"')"
	return transactionQuery;
}



exports.checkout = function(req,res)
{
	var username = req.param('username');
	var product_id = req.param('product_id');
	var bid_amount = req.param('bid_amount');
	
	mysql.fetchData(function(err, results) {
		if(err)
		{
			console.log('Not able to fetch Product Data');
		}
		else
		{
			res.send(results[0]);
		}
		
	}, update_bid_transaction(product_id, username));
	
	mysql.fetchData(function(err, results) {
		if(err)
		{
			console.log('Not able to fetch Product Data');
		}
		else
		{
			res.send(results[0]);
		}
		
	}, update_transaction_detail(username, product_id, bid_amount));
	
	
	
}




