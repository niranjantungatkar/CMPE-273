var fs = require('fs');
 
var stats = fs.statSync('logs/bidlogs/bidlog.log');
var clickStats = fs.statSync('logs/clicklogs/clicklog.log')
if(!stats.isFile())
{
	fs.appendFile('logs/bidlogs/bidlog.log', "product_id | username | Bid_Amount | Timestamp\n", function(err){
		//console.log(err);
	} )

}

if(!clickStats.isFile())
{
	fs.appendFile('logs/clicklogs/clicklog.log', "username | clickaction | Timestamp\n", function(err){
		//console.log(+err);
	} )

}


function writeBidInfoLog(bidinfo)
{
	fs.appendFile('logs/bidlogs/bidlog.log', bidinfo, function(err){
		//console.log(err);
	} )
}

exports.writeBidInfoLog = writeBidInfoLog;


exports.logclientclicks = function(req,res){
	
	var user = req.param('user');
	var clickaction = req.param('id');
	var timestamp = req.param('time');
	var logString = user+" | "+clickaction+" | "+timestamp+"\n"
	
	fs.appendFile('logs/clicklogs/clicklog.log', logString, function(err){
		//console.log(err);
	} )
	
	res.send({flag : true})
	
}