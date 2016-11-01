var mysql = require('./util.database');
var session = require('./func.session');
var dateFormat = require('dateformat');
var mongo = require('./util.mongo');
var mongoDatabaseUrl = "mongodb://localhost:27017/ebay";
var mongoCollection = "product_detail";


exports.getsoldproducts = function (req,res){
	var username = req.param('username');
	var response = {flag : false, items : null}
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection(mongoCollection);
		collection.find({product_adv : username}, {product_name : 1,product_sold_flag : 1, current_bidder : 1, current_bid : 1}).toArray(function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
				response = {flag : false, items : null}
				res.send(response);
			}
			else
			{
				response = {flag : true, items : results}
				res.send(response);
			}
		});
	});
}


exports.getUserInfo = function(req,res){
	var response = {flag : false, last_login : null, sale : {}, bought : {}};
	if(req.session.username)
	{
		mongo.connect(mongoDatabaseUrl, function(connection){
			var collection = mongo.collection("user_detail");
			collection.findOne({username : req.session.username}, {last_login : 1}, function(err, results){
				if(err)
				{
					console.log('Not able to fetch User data');
					response = {flag : false, items : null}
					res.send(response);
				}
				else
				{
					response.flag = true;
					var date = new Date(results.last_login);
					response.last_login = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
					res.send(response);
				}
			});
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
		mongo.connect(mongoDatabaseUrl, function(connection){
			var collection = mongo.collection("user_detail");
			collection.findOne({username : req.session.username}, {first_name : 1,last_name : 1, birthday :1, about:1, telephone: 1, location:1, handle : 1}, function(err, results){
				if(err)
				{
					console.log('Not able to fetch User data');
					response = {flag : false, items : null}
					res.send(response);
				}
				else
				{
					response.flag = true;
					response.message = null;
					response.user_det = results;
					res.send(response);
				}
			});
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

	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		collection.update({username : username}, {$set : {telephone : telephone}}, function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
			}
			else
			{
				console.log("Contact updated")
			}
		});
	});	
}

exports.updateAddress = function (req,res){
	var username = req.param('username');
	var location = req.param('address');
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		collection.update({username : username}, {$set : {location : location}}, function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
			}
			else
			{
				console.log("Address updated")
			}
		});
	});	
}


exports.updatePersonalDet = function (req,res){
	var username = req.param('username');
	var fname = req.param('fname');
	var lname = req.param('lname');
	var bday = req.param('bday');
	var about = req.param('about');
	var handle = req.param('handle');
	mongo.connect(mongoDatabaseUrl, function(connection){
		var collection = mongo.collection("user_detail");
		collection.update({username : username}, {$set : {first_name : fname, last_name : lname, birthday : bday, about : about, handle : handle}}, function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
			}
			else
			{
				console.log("Personal Data updated")
			}
		});
	});		
}

exports.getboughtproducts = function (req, res){
	var username = req.param('username');
	var response = {flag : false, items : null};
	mongo.connect(mongoDatabaseUrl,function(connection){
		var collection = mongo.collection("user_detail");
		collection.findOne({username : username},{orders : 1},function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
				response = {flag : false, items : null}
				res.send(response);
			}
			else
			{
				console.log("Check results: "+results);
				response = {flag : true, items : results.orders}
				res.send(response);
			}
		});
	});
}


//app.post('/userbids', userinfo.returnUserBidDetails);
exports.returnUserBidDetails = function(req,res)
{
	var username = req.param('username');
	mongo.connect(mongoDatabaseUrl,function(connection){
		var collection = mongo.collection("user_detail");
		collection.findOne({username : username},{bidswon : 1},function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
				response = {flag : false, items : null}
				res.send(response);
			}
			else
			{
				console.log("Check results: "+results);
				response = {flag : true, items : results.bidswon}
				res.send(response);
			}
		});
	});
}
function getTotalUserbidDetailsQuery(username){
	var userDetailQuery = "select prd.product_id, prd.product_name, bid.bid_amount, bid.bid_time from ebay.product_detail prd, ebay.bid_log bid "+
	"where bid.bidder = '"+username+"' and prd.product_id = bid.product_id";		
	return userDetailQuery;
}

exports.returnTotalUserBidDetails = function(req,res){
	var username = req.param('username');
	mongo.connect(mongoDatabaseUrl,function(connection){
		var collection = mongo.collection("user_detail");
		collection.findOne({username : username},{bids : 1},function(err, results){
			if(err)
			{
				console.log('Not able to fetch User data');
				response = {flag : false, items : null}
				res.send(response);
			}
			else
			{
				response = {flag : true, items : results.bids}
				res.send(response);
			}
		});
	});
	
}
