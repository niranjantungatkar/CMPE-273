/**
 * http://usejsdoc.org/
 */
exports.renderCalculatorPage = function(req, res){
  res.render('calculator', { title: 'Calculator' });
};

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
		
		
		switch(operator) {
		case '+' : 
			var op3 = Number(op1);
			var op4 =  Number(op2);
			answer= op3 + op4;
			break;
		case '-' :
			var op3 = Number(op1);
			var op4 =  Number(op2);
			answer = op3 - op4;
			break;
		case '*' :
			var op3 = Number(op1);
			var op4 =  Number(op2);
			answer = op3 * op4;
			break;
		case '/' :
			var op3 = Number(op1);
			var op4 =  Number(op2);
			if(op4 == 0)
			{
				throw "inferr";
			}
			answer = op3 / op4;
			break;
		}

		response_answer = {"evalFlag": true, "answer" : answer, "errorString" : null};
		res.send(response_answer);
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