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


function recordTransaction(cart,username, product_id, product_quantity){

	var msg_payload = {
			username : username,
			product_id : product_id,
			product_quantity : product_quantity,
			cart : cart
	}
	
	mq_client.make_request('checkout_recordTransaction_queue',msg_payload, function(err,result){
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

exports.checkout = function(req,res){
	
	var response = { valid: false, product_id: null, message : null}
	var cart = req.param('cart');
	var username = req.session.username;
	
	for(var i = 0; i < cart.length; i++)
	{
		recordTransaction(cart[i],username,cart[i].product_id, cart[i].product_quantity);
	}
	response = { valid: true, product_id: null, message : null}
	req.session.cart = [];
	res.send(response);
}


exports.removeFromCart = function(req,res){
	var product_id = req.param('product_id');
	var response = { flag : false, message : null};
	try
	{
		if(req.session.cart)
		{
			for(var i =0; i< req.session.cart.length ; i++)
			{
				if(req.session.cart[i].product_id == product_id)
				{
					req.session.cart.splice(i,1);
					response.flag = true;
					response.message = "Product Successfully removed from the Cart";
			
					break
				}
				else
				{
					continue;
				}				
			}
		}
		else
		{
			response.flag = false;
			response.message = "Cart doesn't exist";
		}
		res.send(response);
	}
	catch(error)
	{
		console.log("RemoveFromCart : "+ error);
	}
}


