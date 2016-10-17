/**
 * http://usejsdoc.org/
 */
var calculator = angular.module('calculator',[]);

calculator.controller('calcController',function($scope, $http, $log){
	
	$scope.expression = "";
	$scope.inputDisp = "";
	$scope.operand1 = "na";
	$scope.operand2 = "na";
	$scope.operator = "";
	$scope.operandFlag = false;
	$scope.operatorFlag = false;
	$scope.dispFlag = true;
	$scope.lastOperator = "";
	$scope.lastCharacter = "";
	$scope.operands = "";

	
	$scope.handleClick = function(val){
		
		if(val == '1'|| val =='2'|| val =='3'|| val =='4'|| val =='5'|| val =='6'|| val =='7'|| val =='8'|| val =='9'|| val =='0'||val =='.')
		{
			if($scope.operatorFlag == false)
			{
				if($scope.operandFlag == false)
				{
					if($scope.operand1 == "na")
					{
						$scope.operand1 = "";
					}
					$scope.operand1 += val;
					$scope.inputDisp += val;
					$scope.expression += val;
				}
				else
				{
					if($scope.operand2 == "na")
					{
						$scope.operand2 = "";
					}
					$scope.operand2 += val;
					$scope.inputDisp += val;
					$scope.expression += val;
				}
			}
			else
			{	
				if($scope.dispFlag == true)
				{
					$scope.inputDisp = "";
				}
				$scope.dispFlag = false;
				$scope.inputDisp += val;
				if($scope.operand2 == "na")
				{
					$scope.operand2 = "";
				}
				$scope.operand2 += val;
				$scope.expression +=val;
			}
			$scope.lastCharacter = val;
		}
		else if(val == '+'|| val =='-'|| val =='*'|| val =='/')
		{
			if($scope.lastCharacter != '+' || $scope.lastCharacter != '-' || $scope.lastCharacter != '*' || $scope.lastCharacter != '/')
			{
				if($scope.operand1 != "na" && $scope.operand2 != "na")
				{
					$scope.lastOperator = val;
					
					$scope.sendExpression();
					$scope.operand2 = "na";
					$scope.lastOperator = val;
					$scope.expression = $scope.inputDisp;
					$scope.operatorFlag = true;
					$scope.dispFlag = true;
				}
				else
				{
					$scope.inputDisp += val;
					$scope.expression = $scope.inputDisp;
				}
				$scope.operandFlag = true;
				$scope.lastCharacter = val;
			}
			else
			{
				$scope.inputDisp = "Malformed Expression";
				$scope.operand1 = "na";
				$scope.operand2 = "na";
				$scope.operator = "";
				$scope.operandFlag = false;
				$scope.operatorFlag = false;
				$scope.dispFlag = true;
				$scope.lastOperator = "";
				$scope.lastCharacter = "";
			}
		}
		else if(val =='C')
		{
			if($scope.inputDisp == "Malformed Expression")
			{
				$scope.inputDisp = "";
				$scope.operand1 = "na";
				$scope.operand2 = "na";
				$scope.operandFlag = false;
				$scope.operatorFlag = false;
				$scope.dispFlag = true;
			}
			else
			{
				$scope.inputDisp = $scope.inputDisp.slice(0, -1);
				$scope.expression = $scope.expression.slice(0, -1);
				$scope.lastCharacter = $scope.expression.slice(-1);
			}
			
		}
		else if(val == 'AC')
		{
			$scope.inputDisp = "";
			$scope.operand1 = "na";
			$scope.operand2 = "na";
			$scope.operandFlag = false;
			$scope.operatorFlag = false;
			$scope.dispFlag = true;
		}
		else if(val == '=')
		{
			$scope.operand2 = "na";
			$scope.sendExpression();
			$scope.expression = $scope.inputDisp;
			$scope.lastOperator = val;
		}
	}
	
	
	$scope.sendExpression = function(){

		$http({
			method : "POST",
			url : '/evalexpression',
			data : {
				"expression" : $scope.expression
			}
		}).success(function(data) {
			if (data.evalFlag == true) {
				$scope.operand1 = data.answer.toString();
				$scope.inputDisp = data.answer.toString();
				$scope.expression = data.answer.toString()+$scope.lastOperator;
			}
			else
			{
				$scope.inputDisp = data.errorString;
				$scope.operand1 = "na";
				$scope.operand2 = "na";
				$scope.operator = "";
				$scope.operandFlag = false;
				$scope.operatorFlag = false;
				$scope.dispFlag = true;
				$scope.lastOperator = "";
				$scope.lastCharacter = "";
				
			}
		}).error(function(error) {
			
			console.log("error");
		});
		
	}
});

