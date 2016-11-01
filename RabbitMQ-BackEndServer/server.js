//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var login = require('./services/login')
var signin = require('./services/service.signin');
var product = require('./services/service.product');

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on login_queue");
	
	//func.product.js - all products
	cnn.queue('returnallproducts_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			
			product.returnallproducts(message, function(err, res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			})
		});
	});
	
	//returnallbidproducts_queue
	cnn.queue('returnallbidproducts_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			
			product.returnallbidproducts(message, function(err, res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			})
		});
	});
	
	//returnsinglebidproductinfo
	cnn.queue('returnsinglebidproductinfo_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			
			product.returnsinglebidproductinfo(message, function(err, res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			})
		});
	});
	
	cnn.queue('returnSingleProductInfo_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			
			product.returnSingleProductInfo(message, function(err, res){
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			})
		});
	});
	
	
	/*cnn.queue('signin_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		console.log("In server queue");
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		signin.verify_signin_details(message, function(err, res){
			console.log("In server callback");
			console.log("Service response :", res);
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		})
	});
});*/

	/*cnn.queue('register_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.handle_register(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.handle_login(message, function(err,res){
				console.log("In server callback");
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});*/
});