var dateFormat = require('dateformat');
var mongo = require("./mongo");
var mongoDatabaseUrl = "mongodb://localhost:27017/ebay";
var mongoCollection = "product_detail"
	
function getCurrentTime()
{
	var currTime;
	var date = new Date();
	currTime = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
	return currTime;
}


exports.recordTransaction = function (message,callback){

	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		var counterTransaction = mongo.collection("counterTransaction");
		counterTransaction.findAndModify(
			{_id:"transaction_id"},
			[],
			{$inc:{sequence_value:1}}, 
			{new : true},
			function(err,doc){
				if(err)//if-1
				{
					console.log("Unsuccessful Transaction");
					response = { valid: false, product_id: null, message : null}
					callback(null,response);
				}	
				else//else-1
				{
					var product_detail = mongo.collection("product_detail");
					collection.update({username : message.username},{ $push : { orders : {
						trans_id : doc.value.sequence_value,
						trans_type : 1,
						username : message.username,
						product_id : message.cart.product_id,
						product_name : message.cart.product_name,
						trans_amount : message.cart.product_price,
						product_quantity : message.cart.product_quantity,
						trans_time : getCurrentTime()} } },
						function(err, records){
							if(err)//if-2
							{
								console.log("Unsuccessful Transaction : "+err);
								response = { valid: false, product_id: null, message : null}
								callback(null,response);
							}
							else//else-2
							{
								var query = {product_id : parseInt(message.product_id)};
								var fields = {product_quantity : 1}
								product_detail.findOne(query, fields, function(err, productDetails){	
									if(err)//if-3
									{
										console.log('Cannot update product');
							   			callback(null, {valid : false});
									}
									else//else-3
									{
										var act_quantity = productDetails.product_quantity;
									   	var new_quantity = parseInt(act_quantity) - parseInt(message.product_quantity);
									   	if (parseInt(new_quantity) <= 0)//if-4
									   	{
									   		product_detail.update({product_id : parseInt(message.product_id)}, {$set : {product_quantity : new_quantity, product_sold_flag : "yes"}}, function(err, num, status){
										   		if(err)//if-5
										   		{
										   			console.log("Error in updation")
										   			callback(null, {valid : false});
										   		}
										   		else//else-5
										   		{
										   			callback(null, {valid : true});
										   		}
										   	});
									   	}
									   	else//else-4
									   	{
									   		product_detail.update({product_id : parseInt(message.product_id)}, {$set : {product_quantity : new_quantity}}, function(err, num, status){
										   		if(err)//if-6
										   		{
										   			console.log("Error in updation")
										   			callback(null, {valid : false});
										   		}
										   		else//else-6
										   		{
										   			callback(null, {valid : true});
										   		}
										   	});//product_detail.update
									   	
									   	}//else-4
									
									}//else-3
								
								});//product_detail.findOne
							
							}//else-2
					
					});//collection.update
				
				}//else-1	
			
			}//findAndModify.function
		
		);//findAndModify
	
	});//mongo.connect
}