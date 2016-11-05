var MongoClient = require('mongodb').MongoClient; 
var db;
var connected = false;

var connectionQueue = [];
requestQueue = [];
for (var i = 0 ; i < 500; i ++ )
{
	MongoClient.connect("mongodb://localhost:27017/ebay", function(err, _db){       
		if (err) { 
			throw new Error('Could not connect: '+err); 
		}
		else
		{
			connectionQueue.push(_db);
		}
	});
}

exports.connect = function(url, callback){    
	MongoClient.connect(url, function(err, _db){       
		if (err) { 
			throw new Error('Could not connect: '+err); 
		}      
		db = _db;      
		connected = true;            
		callback(db);     
		
	});
	
	/*if(connectionQueue.length > 0)
	{
		db = connectionQueue.pop();
		connected = true;
		callback(db);
	}
	else if(connectionQueue.length <= 0){
		
		requestQueue.push(callback);
	}*/
};

setInterval(function(){
	if(requestQueue.length > 0)
	{
		if(connectionQueue.length > 0)
		{
			var connection = connectionQueue.pop();
			var callback = requestQueue.shift();
			
			callback(connection, null);
		}
	}
},10);

function releasePoolConnection(connection)
{
	
	connectionQueue.push(connection);
}


exports.collection = function(name){    
	if (!connected) {      
		throw new Error('Must connect to Mongo before calling "collection"');    
	}   
	return db.collection(name);   
};


