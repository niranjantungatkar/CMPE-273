var session = require('./func.session');
var dateFormat = require('dateformat');
var logger = require('./util.logger');
var mongoProductCollection = "product_detail";
var mongoBidLogCollection = "bid_log";
var mongoBidTransactionCollection = "bid_transaction";
var mongo = require('./util.mongo');
var mongoDatabaseUrl = "mongodb://localhost:27017/ebay";
var mq_client = require('../rpc/client');

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


function updateProductTable(product_id, bidder, bidamount,res)
{
	var msg_payload = {
		product_id : product_id,
		bidder : bidder,
		bidamount : bidamount
	}
	mq_client.make_request('bid_updateProductTable_queue',msg_payload, function(err,result){
		if(result.err){
			console.log('Not able to fetch User data');
			res.send(result);
		}
		else 
		{
			res.send(result);
		}  
	});
}

function updateBidLog(product_id, product_name, bidamount, bidder,res)
{
	
	var BidLogString = product_id+" | "+bidder+" | "+bidamount+" | "+getCurrentTime()+"\n";
	logger.writeBidInfoLog(BidLogString);
	var msg_payload = {
			product_id : product_id,
			product_name : product_name,
			bidamount : bidamount,
			bidder : bidder
	}
	mq_client.make_request('bid_updateBidLog_queue',msg_payload, function(err,result){
		if(result.err){
			console.log('Not able to fetch User data');
			res.send(result);
		}
		else 
		{
			res.send(result);
		}  
	});
}

/*
 * app.post('/bid',bid.enterBid);
 * Called by - controllerBidproduct
 */
exports.enterBid = function (req,res){
	var product_id = req.param('product_id');
	var product_name = req.param('product_name');
	var bidamount = req.param('bidamount');
	var bidder = req.param('bidder');
	
	updateProductTable(product_id,bidder, bidamount,res);
	updateBidLog(product_id,product_name, bidamount, bidder,res);
}


exports.checkout = function(req,res)
{
	var username = req.param('username');
	var product_id = req.param('product_id');
	var product_name = req.param('product_name');
	var bid_amount = req.param('bid_amount');

	var msg_payload = {
		username : username,
		product_id : product_id,
		product_name : product_name,
		bid_amount : bid_amount
	}
	
	mq_client.make_request('bid_checkout_queue',msg_payload, function(err,result){
		if(result.err){
			console.log('Not able to fetch User data');
			res.send(result);
		}
		else 
		{
			res.send(result);
		}  
	});
}




