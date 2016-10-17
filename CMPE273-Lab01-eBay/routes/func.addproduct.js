/**
 * http://usejsdoc.org/
 */

var mysql = require('./util.database');
var session = require('./func.session');
var dateFormat = require('dateformat');

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



function getInsertQuery(product_name,product_category,product_desc,product_adv,product_seller_info,product_quantity,product_price,product_bid_flag,product_base_bid,product_adv_time,product_bid_end_time,current_bid)
{
	var insertQuery = "INSERT INTO product_detail"+
	"(product_id, product_name, product_category, product_desc, product_adv, product_seller_info, product_quantity, product_price, product_bid_flag, product_base_bid, product_adv_time,product_bid_end_time,product_sold_flag,current_bid)"+
	"VALUES (null, '"+product_name+"', '"+product_category+"', '"+product_desc+"', '"+product_adv+"', '"+product_seller_info+"', '"+product_quantity+"', '"+product_price+"', '"+product_bid_flag+"', '"+product_base_bid+"', '"+product_adv_time+"', '"+product_bid_end_time+"', 'no', '"+current_bid+"')"
	
	
	
	return insertQuery;
}

exports.insertproduct = function(req,res){
	
	var response = {flag : false, message : null};
	
	product_name = req.param("product_name");
	product_category  = req.param("product_category");
	product_desc = req.param("product_desc");
	product_adv = req.session.username;
	product_seller_info = req.param("product_seller_info");
	product_quantity = req.param("product_quantity");
	product_price = req.param("product_price");
	product_bid_flag = req.param("product_bid_flag");
	current_bid = 0;
	if(product_bid_flag == "no")
	{
		product_base_bid = 0;
	}
	else
	{
		product_base_bid = req.param("product_base_bid");
		current_bid = req.param("product_base_bid");
	}
	product_adv_time = getCurrentTime();
	product_bid_end_time = getBidEndTime(getCurrentTime());
	
	var insertQuery = getInsertQuery(product_name,product_category,product_desc,product_adv,product_seller_info,product_quantity,product_price,product_bid_flag,product_base_bid,product_adv_time,product_bid_end_time,current_bid);
	
	
	mysql.fetchData(function(err,results) {
		if(err)
		{
			
			response.flag = false;
			response.message = err
			res.send(response);
			throw err;
		}
		else
		{
			response.flag = true;
			response.message = null;
			res.send(response);
		}
	}, insertQuery);
}