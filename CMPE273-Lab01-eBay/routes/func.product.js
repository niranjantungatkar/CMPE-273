/**
 * @file 		: 	func.signin.js
 * @author		: 	Niranjan Tungatkar
 * @Description : 	contains functions retrieval of product information.
 * @returns 	: 	  		
 * @functions	: 	getBidProductUserQuery
 * 					getBidProductUserQuery
 * 					returnBidProductsdetails
 * 					returnBidProductInfo 
 * 					getProductQuery
 * 					getProductQueryUser
 * 					returnProductdetails
 * 					getProductDetailQuery
 * 					getProductDetails
 * 
 */
var mysql = require('./util.database');
var session = require('./func.session');
var dateFormat = require('dateformat');
var mongo = require('./util.mongo');
var mongoDatabaseUrl = "mongodb://localhost:27017/ebay";
var mongoCollection = "product_detail";
var mq_client = require('../rpc/client');


/*
 * all bid products details
 * Called by - controllerHome
 * Api - app.post('/bidproducts',product.returnBidProductsdetails);;
 */
exports.returnBidProductsdetails = function(req, res){
	var query = "";
	var fields = {product_id: 1 , product_name : 1, product_adv : 1, product_seller_info : 1, product_price : 1, product_base_bid : 1, current_bid : 1}
	var msg_payload = {};
	if(req.session.username)
	{
		msg_payload = {query : {product_adv : {$ne : req.session.username}, product_bid_flag : "yes" , product_sold_flag : "no"}};
	}
	else
	{
		msg_payload = {query : {product_bid_flag : "yes" , product_sold_flag : "no"}, fields : fields}
	}
	mq_client.make_request('returnallbidproducts_queue',msg_payload, function(err,docs){
		if(err){
			console.log("Not able to fetch Bid product Data")
		}
		else 
		{
			res.send(docs);
		}  
	});	
}

/*
* Single Bid product info
* Called By - controllerBidproduct
* Api - app.post('/bidproductdetails',product.returnBidProductInfo);
*/
exports.returnBidProductInfo = function(req, res){
	var product_id = parseInt(req.param("product_id"));
	var query = getProductDetailQuery(product_id);
	var fields = {product_id: 1 , product_name : 1, product_adv : 1, product_seller_info : 1, product_price : 1, product_base_bid : 1, current_bid : 1}
	var msg_payload = {query : query, fields : fields};	
	mq_client.make_request('returnsinglebidproductinfo_queue',msg_payload, function(err,docs){
		if(err){
			console.log("Not able to fetch Bid product Data")
		}
		else 
		{
			res.send(docs);
		}  
	});
}


/*
 * All normal products
 */
function getProductQuery()
{
	var conditions = {product_quantity :{$gt : 0}, product_bid_flag : "no"};
	return conditions;
}

function getProductQueryUser(username)
{
	var conditions = {product_adv : {$ne : username}, product_quantity :{$gt : 0}, product_bid_flag : "no"};
	return conditions;
}

/*
 * all products details
 * Called by - controllerHome
 * Api - app.post('/products',product.returnProductdetails);
 */
exports.returnProductdetails = function(req, res){
	var query = "";
	var fields = {product_id :1, product_name : 1, product_desc : 1, product_adv : 1,product_seller_info : 1, product_quantity : 1, product_price : 1};
	if(req.session.username)
	{
		query = getProductQueryUser(req.session.username);
		var msg_payload = {query : query, fields : fields, usersession : req.session.username}
		
	}
	else
	{
		query = getProductQuery();
		var msg_payload = {query : query, fields : fields, usersession : null}
	}
	mq_client.make_request('returnallproducts_queue',msg_payload, function(err,docs){
		if(err){
			console.log("Not able to fetch product Data")
		}
		else 
		{
			res.send(docs);
		}  
	});
		
}

/*
 * Individual product
 */

function getProductDetailQuery(product_id)
{
	var conditions = {product_id : product_id};
	return conditions;
}
/*
* Single product info
* Called By - controllerBuyproduct
* Api - app.post('/productdetails', product.getProductDetails);
*/
exports.getProductDetails = function(req,res){
	
	var product_id = parseInt(req.param('product_id'));
	var query = getProductDetailQuery(product_id);
	var fields = {product_id :1, product_name : 1, product_desc : 1, product_adv : 1,product_seller_info : 1, product_quantity : 1, product_price : 1};
	var msg_payload = {query : query, fields : fields}
	mq_client.make_request('returnSingleProductInfo_queue',msg_payload, function(err,docs){
		if(err){
			console.log("Not able to fetch product Data")
		}
		else 
		{
			res.send(docs);
		}  
	});
	
}