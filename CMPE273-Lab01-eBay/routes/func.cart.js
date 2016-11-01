exports.removeFromCart = function(req,res){

	var product_id = req.param("product_id");
	var product_quantity = req.param("product_quantity");
	var response = {flag : true, message : null}
	
	try
	{
		
		if(req.session.cart)
		{
			for(var i =0; i< req.session.cart.length ; i++)
			{
				if(req.session.cart[i].product_id == product_id && req.session.cart[i].product_quantity == product_quantity)
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

exports.setCart = function(req,res){
	
	var cart = req.param('cart');
	var response = {flag : false, message : null}

	try
	{
		
		if(req.session.cart)
		{
			response.flag = true;
			response.message = "Cart updated successfully";
			req.session.cart = cart;
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
		console.log("setCart : "+ error);
	}
}