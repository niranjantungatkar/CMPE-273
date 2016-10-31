var mysql = require('./util.database');
var session = require('./func.session');
var dateFormat = require('dateformat');
var mongo = require('./util.mongo');
var mongoDatabaseUrl = "mongodb://localhost:27017/ebay";
var mongoCollection = "product_detail"

function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
}


function updateQuantity(product_id, product_quantity)
{
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection(mongoCollection);
		var query = {product_id : parseInt(product_id)};
		var fields = {product_quantity : 1}
		collection.findOne(query, fields, function(err, productDetails){	
			if(err)
			{
				console.log('Not able to fetch Product Data');
			}
			else
			{
				var act_quantity = productDetails.product_quantity;
			   	var new_quantity = parseInt(act_quantity) - parseInt(product_quantity);
			   	collection.update({product_id : parseInt(product_id)}, {$set : {product_quantity : new_quantity}}, function(err, num, status){
			   		if(err)
			   		{
			   			console.log("Error in updation")
			   		}
			   	});
			}
		});
	});
}



function recordTransaction(cart,username){

	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		var counterTransaction = mongo.collection("counterTransaction");
		
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
					collection.update({username : username},{ $push : { orders : {
						trans_id : doc.value.sequence_value,
						trans_type : 1,
						username : username,
						product_id : cart.product_id,
						product_name : cart.product_name,
						trans_amount : cart.product_price,
						product_quantity : cart.product_quantity,
						trans_time : getCurrentTime()} } },
						function(err, records){
							if(err)
							{
								console.log("Unsuccessful Transaction : "+err);
								response = { valid: false, product_id: null, message : null}
							}
					});
				}	
			}
		);
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


