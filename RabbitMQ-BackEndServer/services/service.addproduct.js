var mongo = require("./mongo");
var mongoDatabaseUrl = "mongodb://localhost:27017/ebay";
var dateFormat = require('dateformat');
var mongoCollection = "product_detail";

exports.addproduct = function(message, callback){
	
	var response = {flag : false, message : null};
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection(mongoCollection);
		var user_detail = mongo.collection("user_detail");
		var productCounter = mongo.collection("productCounter");
		var prd_id = "";	
		productCounter.findAndModify(
			{_id:"product_id"},
			[],
			{$inc:{sequence_value:1}}, 
			{new : true},
			function(err,doc){
				if(err)
				{
					response.flag = false;
					response.message = err
					callback(null,response);
				}	
				else
				{
					collection.insert({
						product_id : doc.value.sequence_value, 
						product_name : message.product_name, 
						product_category : message.product_category, 
						product_desc : message.product_desc, 
						product_adv : message.product_adv, 
						product_seller_info : message.product_seller_info, 
						product_quantity : parseInt(message.product_quantity), 
						product_price : parseFloat(message.product_price), 
						product_bid_flag : message.product_bid_flag, 
						product_base_bid : parseFloat(message.product_base_bid), 
						product_adv_time : message.product_adv_time,
						product_bid_end_time : message.product_bid_end_time,
						product_sold_flag : "no",
						current_bid : parseFloat(message.current_bid),
						current_bidder : message.current_bidder
					},function(err, records){
						if(err)
						{
							response.flag = false;
							response.message = err
							callback(null,response);
						}
						else
						{
							response.flag = true;
							response.message = null;
							callback(null,response);
						}
					});
				}	
			}
		);
	});	
}
