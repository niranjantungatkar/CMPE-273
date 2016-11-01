/**
 * http://usejsdoc.org/
 */

var session = require('./func.session');

exports.addToCart = function(req,res){
	var response = {flag : true, message : null};
	var product_det = req.param('product_det');
	
	if(req.session.cart)
	{
		req.session.cart.push(product_det);
	}
	else
	{
		session.setSessionCart(req);
		req.session.cart.push(product_det);
	}
	
	res.send(response);
}

exports.getCart = function(req,res){
	var response = {flag : true, message : null};
	var cart = {};
	console.log(req.session.cart);
	if(req.session.cart)
	{
		
		cart = req.session.cart;		
		res.send(req.session.cart);
	}
	else
	{
		
		response.flag = false;
		res.send(response);
	}

	res.send(response);
}