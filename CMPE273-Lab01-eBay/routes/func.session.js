/**
 * @file 		: 	func.session.js
 * @author		: 	Niranjan Tungatkar
 * @Description : 	contains functions related to session management.
 * @returns 	: 	
 * @functions	: 	setSession
 * 					sessionDestroy
 *  				setSessionCart	
 */
exports.setSession = function(req,username){
	req.session.username = username;
}

exports.getSession = function(req,res){
	var sessionValidity = {"validFlag": false, "sessionUser" : null};
	if(req.session.username)
	{	
		sessionValidity.validFlag = true;
		sessionValidity.sessionUser = req.session.username;
		res.send(sessionValidity);
	}
	else
	{
		res.send(sessionValidity);
	}
}

exports.sessionDestroy = function(req,res)
{
	response = {flag : true}
	try{
		req.session.destroy();
		res.send(response);
	}
	catch(error)
	{
		response = {flag : false, message : error}
		res.send(response);
	}
};

exports.setSessionCart = function(req){
	req.session.cart = [];
}