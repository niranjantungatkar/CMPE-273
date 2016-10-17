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


function getProductQuery(product_id)
{
	var productQuery = "select product_quantity from product_detail where product_id='"+product_id+"'";
	return productQuery;
}

function getUpdateQuery(product_id, new_quantity)
{
	var producUpdateQuery = "update product_detail set product_quantity ='"+new_quantity+"' where product_id ='"+product_id+"'";
	return productUpdateeQuery;
}


function checkValidity(product_id, product_quantity,res)
{
	var act_product_quantity = 0;
	var response = {flag : false, product_id : null, message : null}
	var flag = true;
	
	/*mysql.fetchData(function(err, results) {
		if(err)
		{
			console.log('Not able to update the last Login');
		}
		else
		{
			act_product_quantity = results[0].product_quantity;
			if(act_product_quantity < product_quantity )
			{	
				response.flag = false
				response.product_id  = product_id;
				message = "Quantity available in the Stock is less than than the Quantiyt in the Cart"
				flag = false;
				//res.send(response);
			}
			else
			{
				console.log("valid");
				return true;
			}
				
		}
		
	}, getProductQuery(product_id));*/

}

function updateQuantity(product_id, product_quantity)
{
	mysql.fetchData(function(err, results) {
		if(err)
		{
			console.log('Not able to update the last Login');
		}
		else
		{
			var act_quantity = results[0].product_quantity;
			var new_quantity = parseFloat(act_quantity) - parseFloat(product_quantity);
			console.log("Product id : "+product_id+" New :"+new_quantity+" act :"+act_quantity+" product : "+product_quantity);
			
			mysql.fetchData(function(err,results){
				if(err)
				{
					console.log("Product not updated");
				}
				else
				{
					console.log("product Updated")
				}
			},getUpdateQuery(product_id, new_quantity));
			
			
		}
	},getProductQuery(product_id));
	
}

function getUpdateQuery(product_id, new_quantity)
{
	var updQuery = "UPDATE product_detail SET product_quantity='"+new_quantity+"' WHERE product_id='"+product_id+"'";
	return updQuery;
}

function gettransactionQuery(cart, username)
{
	var transactionQuery = "INSERT INTO transaction_detail (trans_id, trans_type, username,product_id, trans_amount, product_quantity, trans_time) VALUES"+
							"(null, '1', '"+username+"', '"+cart.product_id+"', '"+cart.product_price+"', '"+cart.product_quantity+"', '"+getCurrentTime()+"')"
	return transactionQuery;
}

function recordTransaction(cart,username){

		mysql.fetchData(function(err,results){
			if(err)
			{
				console.log("Product not updated");
			}
			else
			{
				console.log("product Updated")
			}
		},gettransactionQuery(cart,username));
	
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


