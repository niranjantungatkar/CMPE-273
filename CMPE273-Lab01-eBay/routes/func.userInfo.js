var mysql = require('./util.database');
var session = require('./func.session');
var dateFormat = require('dateformat');
var mongo = require('./util.mongo');
var mongoDatabaseUrl = "mongodb://localhost:27017/ebay";
var mongoCollection = "product_detail";
var mq_client = require('../rpc/client');

exports.getsoldproducts = function (req,res){
	var username = req.param('username');
	var response = {flag : false, items : null}
	var msg_payload = {username : username};
	mq_client.make_request('user_soldproducts_queue',msg_payload, function(err,result){
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

exports.getboughtproducts = function (req, res){
	var username = req.param('username');
	var msg_payload = {username : username};
	mq_client.make_request('user_boughtproducts_queue',msg_payload, function(err,result){
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

exports.getUserInfo = function(req,res){
	var response = {flag : false, last_login : null, sale : {}, bought : {}};
	console.log("In Last login Rab client")
	if(req.session.username)
	{
		var msg_payload = {username : req.session.username}
		mq_client.make_request('user_lastlogin_queue',msg_payload, function(err,result){
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
	else
	{
		res.send({flag : false, message : "user session invalid"})
	}
}

exports.getUserDetails = function(req,res){
	var response = {flag : false, message: null, user_det : {}};
	var username = req.param('username');
	if(req.session.username)
	{
		var msg_payload = {username : req.session.username}
		mq_client.make_request('user_userdetails_queue',msg_payload, function(err,result){
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
	else
	{
		res.send({flag : false, message : "user session invalid", user_det : null})
	}
}


exports.updateContact = function(req,res){
	var username = req.param('username');
	var telephone = req.param('telephone');
	var msg_payload = {username : username, telephone : telephone}
	mq_client.make_request('user_updatecontact_queue',msg_payload, function(err,result){
		if(result.err){
			console.log('Not able to fetch User data');
			res.send(result);
		}
		else 
		{
			console.log("Contact Update")
			res.send(result);
		}  
	});
		
}

exports.updateAddress = function (req,res){
	var username = req.param('username');
	var location = req.param('address');
	var msg_payload = {username : username, location : location}
	mq_client.make_request('user_updateaddress_queue',msg_payload, function(err,result){
		if(result.err){
			console.log('Not able to fetch User data');
			res.send(result);
		}
		else 
		{
			console.log("Address Update")
			res.send(result);
		}  
	});
}


exports.updatePersonalDet = function (req,res){
	var username = req.param('username');
	var fname = req.param('fname');
	var lname = req.param('lname');
	var bday = req.param('bday');
	var about = req.param('about');
	var handle = req.param('handle');
	var msg_payload = {
		username : username,
		fname : fname,
		lname : lname,
		bday : bday,
		about : about,
		handle : handle
	}
	mq_client.make_request('user_updatepersonaldet_queue',msg_payload, function(err,result){
		if(result.err){
			console.log('Not able to fetch User data');
			res.send(result);
		}
		else 
		{
			console.log("Updated personal details")
			res.send(result);
		}  
	});
}




//app.post('/userbids', userinfo.returnUserBidDetails);
exports.returnUserBidDetails = function(req,res)
{
	var username = req.param('username');
	var msg_payload = {username : username}
	mq_client.make_request('user_userSuccessfulbids_queue',msg_payload, function(err,result){
		if(result.err){
			console.log('Not able to fetch User data');
			res.send(result);
		}
		else 
		{
			console.log("Successful bids fetched");
			res.send(result);
		}  
	});
	
}


exports.returnTotalUserBidDetails = function(req,res){
	var username = req.param('username');
	var msg_payload = {username : username}
	mq_client.make_request('user_userAllbids_queue',msg_payload, function(err,result){
		if(result.err){
			console.log('Not able to fetch User data');
			res.send(result);
		}
		else 
		{
			console.log("Successful bids fetched");
			res.send(result);
		}  
	});
	
}
