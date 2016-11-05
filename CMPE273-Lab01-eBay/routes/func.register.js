/**
 * @file 		: 	func.register.js
 * @author		: 	Niranjan Tungatkar
 * @Description : 	contains functions related to user registration.
 * @functions	: 	getUserQuery
 * 					getCurrentTime
 * 					getInsertQuery
 * 					setValidregistrationFalse 
 * 					setValidregistrationUserExists
 * 					setValidregistrationUserAdded
 */
var mysql = require('./util.database');
var mongo = require('./util.mongo');
var dateFormat = require('dateformat');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var mq_client = require('../rpc/client');

/*
 * Add user Function for Mongodb.
 */
exports.addUser = function(req, res){
	var validRegistration = { "flag" : false, "message": null};
	var username = req.param('username');
	var password = req.param('password');
	var FirstName = req.param('FirstName');
	var LastName = req.param('LastName');
	var Telephone = req.param('Telephone');
	
	var msg_payload = {
			username : username,
			password : req.param('password'),
			fname : FirstName,
			lname : LastName,
			telephone : Telephone
	}

	mq_client.make_request('registration_queue',msg_payload, function(err,result){
		if(result.err){
			res.send(result);
		}
		else 
		{
			res.send(result);
		}  
	});
	
	
};



