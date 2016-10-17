var mysql = require('./util.database');
var session = require('./func.session');
var dateFormat = require('dateformat');

function getLastLoginQuery(username)
{
	var userQuery = "SELECT last_login lstlgn FROM user_detail where username = '"+username+"'";
			
	return userQuery;
}


function getUserDetailQuery(username)
{
	var userDetailQuery = "SELECT first_name, last_name, birthday, about, telephone, location FROM ebay.user_detail where username='"+username+"'";
			
	return userDetailQuery;
}


exports.getUserInfo = function(req,res){
	var response = {flag : false, last_login : null, sale : {}, bought : {}};
	
	if(req.session.username)
	{
		mysql.fetchData(function(err, results) {
			if(err)
			{
				console.log('Not able to fetch User data');
			}
			else
			{
				response.flag = true;
				var date = new Date(results[0].lstlgn);
				response.last_login = dateFormat(date,"yyyy-mm-dd HH:MM:ss");
				res.send(response)
			}
			
		}, getLastLoginQuery(req.session.username));
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
		mysql.fetchData(function(err, results) {
			if(err)
			{
				console.log('Not able to fetch User data');
			}
			else
			{
				response.flag = true;
				response.message = null;
				response.user_det = results[0];
				res.send(response);
			}
		}, getUserDetailQuery(username));
	}
	else
	{
		res.send({flag : false, message : "user session invalid", user_det : null})
	}
}

function getContactUpdQuery(username, telephone)
{
	var contactUpdQuery = "update user_detail set telephone = '"+telephone+"' where username = '"+username+"'";
	return contactUpdQuery;
}

exports.updateContact = function(req,res){
	var username = req.param('username');
	var telephone = req.param('telephone');
	
	mysql.fetchData(function(err, results) {
		if(err)
		{
			console.log('Not able to fetch User data');
		}
		else
		{
			console.log("Contact updated")
		}
	}, getContactUpdQuery(username,telephone));
	
}

function getLocationUpdQuery(username, location)
{
	var locationUpdQuery = "update user_detail set location = '"+location+"' where username = '"+username+"'";
	return locationUpdQuery;
}

exports.updateAddress = function (req,res){
	
	var username = req.param('username');
	var location = req.param('address');
	mysql.fetchData(function(err, results) {
		if(err)
		{
			console.log('Not able to fetch User data');
		}
		else
		{
			console.log("Contact updated")
		}
	}, getLocationUpdQuery(username,location));
}


function getPersonalDetUpdQuery(username, fname, lname, bday, about, handle)
{
	var personalDetUpdQuery = "UPDATE user_detail SET first_name='"+fname+"', last_name='"+lname+"', birthday='"+bday+"', about='"+about+"', handle = '"+handle+"' WHERE username='"+username+"'";
	return personalDetUpdQuery;
}

exports.updatePersonalDet = function (req,res){
	var username = req.param('username');
	var fname = req.param('fname');
	var lname = req.param('lname');
	var bday = req.param('bday');
	var about = req.param('about');
	var handle = req.param('handle');
	console.log(bday);
	mysql.fetchData(function(err, results) {
		if(err)
		{
			console.log('Not able to fetch User data');
		}
		else
		{
			console.log("Contact updated")
		}
	}, getPersonalDetUpdQuery(username, fname, lname, bday, about, handle));
	
}

function getSoldProductQuery(username)
{
	var itmforsaleQuery = "SELECT product_name, product_sold_flag, current_bidder, current_bid FROM ebay.product_detail where product_adv = '"+username+"'";
							
	return itmforsaleQuery;
}


exports.getsoldproducts = function (req,res){
	var username = req.param('username');
	var response = {flag : false, items : null}
	mysql.fetchData(function(err, results) {
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
	}, getSoldProductQuery(username));
}

function getBoughtProductQuery(username)
{
	var itmboughtQuery = "SELECT prd.product_name, trd.product_quantity, trd.trans_amount FROM ebay.transaction_detail trd, ebay.product_detail prd"+ 
	" where trd.product_id = prd.product_id"+
	" and trd.trans_type in (1, 3)"+
	" and trd.username = '"+username+"'"	
	return itmboughtQuery;
}

exports.getboughtproducts = function (req, res){
	var username = req.param('username');
	var response = {flag : false, items : null}
	mysql.fetchData(function(err, results) {
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
	}, getBoughtProductQuery(username));
}


function getUserbidDetailsQuery(username)
{
	var userDetailQuery = "select prd.product_id, prd.product_name, bid.trans_amount as bid_amount from ebay.product_detail prd, ebay.bid_transaction bid "+
	"where prd.product_id = bid.product_id "+
	"and bid.username = '"+username+"' and "+
	"paid_flag = 'N'";
			
	return userDetailQuery;
}

exports.returnUserBidDetails = function(req,res)
{
	
	var username = req.param('username');
	mysql.fetchData(function(err, results) {
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
	}, getUserbidDetailsQuery(username));

}
function getTotalUserbidDetailsQuery(username){
	var userDetailQuery = "select prd.product_id, prd.product_name, bid.bid_amount, bid.bid_time from ebay.product_detail prd, ebay.bid_log bid "+
	"where bid.bidder = '"+username+"' and prd.product_id = bid.product_id";
	
	
			
	return userDetailQuery;
}

exports.returnTotalUserBidDetails = function(req,res){
	var username = req.param('username');
	mysql.fetchData(function(err, results) {
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
	}, getTotalUserbidDetailsQuery(username));
}
