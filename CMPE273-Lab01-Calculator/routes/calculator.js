/**
 * http://usejsdoc.org/
 */
exports.renderCalculatorPage = function(req, res){
  res.render('calculator', { title: 'Calculator' });
};

var soap = require('soap');
var baseURL = "http://localhost:8080/Calculator-WebService/services";

//Handles different operations
exports.evalexpression = function(req, res){
	var response_answer = {"evalFlag" : null, "answer": null, "errorString" : null };
	var expression = req.param("expression");
	var op1;
	var op2;
	var operator;
	var answer;
	
	try 
	{
		var argument_array = expression.replace(/[+,\-,*,/]/g,' $& ').split(/ /g);
		if(argument_array.length < 3)
			throw "Malformed Error"
		if(argument_array.length > 5)
			throw "Malformed Error"
		if(argument_array.length == 5)
		{
			op1 = -1*argument_array[2];
			op2 = argument_array[4];
			operator = argument_array[3];
		}
		else
		{
			op1 = argument_array[0];
			op2 = argument_array[2];
			operator = argument_array[1];
		}
			
		if(op1 == undefined || op2 == undefined || op1 == "" || op2 == "")
			throw "Malformed expression";
			
		var option = {
				ignoredNamespaces : true	
			};
		var url = baseURL+"/EvalExp?wsdl";
		var args = {op1 : op1, op2 : op2, operator : operator};
		soap.createClient(url,option, function(err, client) {
			client.evalExp(args, function(err, result) {  
				answer = result.evalExpReturn;
				console.log(answer);
				response_answer = {"evalFlag": true, "answer" : answer, "errorString" : null};
				res.send(response_answer);
		    });
		});
			

	}
	catch(error)
	{
		if(error == "inferr")
		{
			response_answer = {"evalFlag": false, "answer" : "Infinity Error", "errorString" : "Infinity: Divide by 0"};
			res.send(response_answer);
			console.log(error);
		}
			
		response_answer = {"evalFlag": false, "answer" : "Syntax Error",  "errorString" : "Malformed Expression"};	
		res.send(response_answer);
	}
};