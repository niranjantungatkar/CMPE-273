/**
 * @file 		: 	func.addproduct.js
 * @author		: 	Niranjan Tungatkar
 * @Description : 	contains functions related to addition of normal products and bid products.
 * @returns 	: 	
 * 			  		
 * @functions	: 	getCurrentTime
 * 					getBidEndTime 
 * 					insertproduct
 * 					
 */
var mysql = require('./util.database');
var session = require('./func.session');
var dateFormat = require('dateformat');
var mongo = require('./util.mongo');
var mongoDatabaseUrl = "mongodb://localhost:27017/ebay";
var mongoCollection = "product_detail";
var mq_client = require('../rpc/client');

function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
}

function getBidEndTime(bidStartTime)
{
	var currTime;
	var date = new Date(bidStartTime);
	date.setDate(date.getDate() + 4);
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
}

exports.insertproduct = function(req,res){
	var product_name = req.param("product_name");
	var product_category  = req.param("product_category");
	var product_desc = req.param("product_desc");
	var product_adv = req.session.username;
	var product_seller_info = req.param("product_seller_info");
	var product_quantity = parseInt(req.param("product_quantity"));
	var product_price = req.param("product_price");
	var product_bid_flag = req.param("product_bid_flag");
	var current_bid = 0;
	var current_bidder = "NA"
	if(product_bid_flag == "no")
	{
		product_base_bid = 0;
		current_bid = 0;
	}
	else
	{
		product_base_bid = req.param("product_base_bid");
		current_bid = req.param("product_base_bid");
	}
	product_adv_time = getCurrentTime();
	product_bid_end_time = getBidEndTime(getCurrentTime());
	
	var msg_payload = {
		product_name : product_name,
		product_category : product_category,
		product_desc :product_desc,
		product_adv : product_adv,
		product_seller_info : product_seller_info,
		product_quantity : product_quantity,
		product_price : product_price,
		product_bid_flag : product_bid_flag,
		product_base_bid : product_base_bid,
		current_bid : current_bid,
		product_adv_time : product_adv_time,
		product_bid_end_time : product_bid_end_time,
		current_bidder : current_bidder
	}

	mq_client.make_request('user_addproduct_queue',msg_payload, function(err,result){
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