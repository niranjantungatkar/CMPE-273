/**
 * http://usejsdoc.org/
 */
var ejs = require('ejs');
var mysql = require('mysql');

var connectionQueue = [];
var MAX_CONN = 500;
var requestQueue = [];

for(var i = 0; i < MAX_CONN; i++)
{
	var q = {
			id : i, 
			connection : mysql.createConnection({  
								host     : 'localhost',
								user     : 'root', 
								password : 'root', 
								database : 'ebay',
								port  : 3306 })
			}
	connectionQueue.push(q);
}


var getPoolConnection = function(callback){
	if(connectionQueue.length > 0)
	{
		var connection = connectionQueue.pop();
		console.log("Using connection : "+connection.id);
		callback(connection, null);
	}
	else if(connectionQueue.length <= 0){
		console.log("Putting function in wait Queue");
		requestQueue.push(callback);
	}
}

setInterval(function(){
	if(requestQueue.length > 0)
	{
		if(connectionQueue.length > 0)
		{
			var connection = connectionQueue.pop();
			var callback = requestQueue.shift();
			console.log("Executing function from the wait queue");
			console.log("Connection ID : "+connection.id);
			callback(connection, null);
		}
	}
},10);

function releasePoolConnection(connection)
{
	console.log("Releasing Connection : "+connection.id)
	connectionQueue.push(connection);
}



function fetchData(callback,sqlQuery)
{  
	/*console.log("\nSQL Query::"+sqlQuery);  
	
	var connection=getConnection();  
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err)
		{   
			console.log("ERROR: " + err.message);  
		} 
		else 
		{ 
			// return err or result 
			console.log("DB Results:"+rows);
			callback(err, rows); 
		}
	});
	
	console.log("\nConnection closed..");
	connection.end();*/
	/////////////////////////////////////////////////var getPoolConnection	
	
	console.log("\nSQL Query::"+sqlQuery); 

	getPoolConnection(function (PoolConnection, err){
		PoolConnection.connection.query(sqlQuery, function(err, rows, fields) {
			if(err)
			{   
				console.log("ERROR: " + err.message);  
			} 
			else 
			{ 
				// return err or result 
				console.log("DB Results:"+rows);
				callback(err, rows); 	
				console.log("\nConnection closed..");
				setTimeout(function (){
					releasePoolConnection(PoolConnection);
				},2000);
			}
		});//getPoolConnection
		
	});//PoolConnection.connection.query
};


var getConnection = function(){
	var connection = mysql.createConnection({  
		host     : 'localhost',
		user     : 'root', 
		password : 'root', 
		database : 'ebay',
		port  : 3306 
	});
	
	return connection;
};

function updateData(callback,sqlQuery)
{
	var connection=getConnection();  
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err)
		{   
			console.log("ERROR: " + err.message);  
		} 
		else 
		{ 
			// return err or result 
			console.log("DB Results:"+rows);
			callback(err, rows); 
		}
	});
	
	console.log("\nConnection closed.."); 
	connection.end();
}




exports.fetchData = fetchData;
exports.updateData = updateData;

