var mysql = require('./util.database');
var session = require('./func.session');
var dateFormat = require('dateformat');

var soap = require('soap');
var baseURL = "http://localhost:8080/eBay-WebService/services";

function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
}


function updateQuantity(product_id, product_quantity)
{
	var url = baseURL+"/Checkout?wsdl";
	var option = {
			ignoredNamespaces : true	
		};
	soap.createClient(url,option, function(err, client) {
		var productinfo = {product_id : product_id,product_quantity : product_quantity}
		client.updateQuantity(productinfo, function(err, result) {  
			
	    });
	});
	
}


function recordTransaction(cart,username){
	
	var url = baseURL+"/Checkout?wsdl";
	var option = {
			ignoredNamespaces : true	
		};
	soap.createClient(url,option, function(err, client) {
		
		var productinfo = {username : username, 
				product_id : cart.product_id, 
				product_price : cart.product_price, 
				product_quantity : cart.product_quantity,
				time : getCurrentTime()}
		
		client.recordTransaction(productinfo, function(err, result) {  
	    });
	});
	
}

exports.checkout = function(req,res){
	
	var response = { valid: false, product_id: null, message : null}
	var cart = req.param('cart');
	
	var username = req.session.username;
	
	for(var i = 0; i < cart.length; i++)
	{
		
		updateQuantity(cart[i].product_id, cart[i].product_quantity);
		recordTransaction(cart[i],username);
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


