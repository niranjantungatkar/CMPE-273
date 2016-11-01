/**
 * http://usejsdoc.org/
 */
eBayApp.controller('controllerRegister', function($scope,$http, $log, $state){
	
	$scope.rgnEmail = "";
	$scope.rergnEmail = "";
	$scope.rgnPaswd = "";
	$scope.rgnFname = "";
	$scope.rgnLname = "";
	$scope.rgntel = "";
	
	$scope.invFname = "";
	$scope.invPaswd = "";
	$scope.invLname = "";
	$scope.invEmail = "";
	$scope.invTel = "";
	
	$scope.applyValidations = function(){
		
		var validationsFlag = false;
		var fnameValidation = "";
		var lnameValidation ="";
		var telValidation  ="";
		
		if($scope.rgnFname  != "")
			fnameValidation = $scope.rgnFname.match(/\d+/g);
		if($scope.rgnLname != "")
			lnameValidation = $scope.rgnFname.match(/\d+/g);
		
		if(fnameValidation != null && lnameValidation == null)
		{
			$scope.invFname = "Invalid First Name";
			validationsFlag = true;
		}
		else if(fnameValidation == null && lnameValidation != null)
		{
			$scope.invLname = "Invalid Last Name";
			validationsFlag = true;
		}
		else if(lnameValidation != null && lnameValidation != null)
		{
			$scope.invLname = "First Name & Last Name Invalid";
			validationsFlag = true;
		}
		
		if($scope.rgnPaswd.length < 8)
		{
			$scope.invPaswd = "Password should have 8 or more characters";
			validationsFlag = true;
			
		}
				
		if($scope.rgnEmail != $scope.rergnEmail)
		{
			$scope.invEmail = "Emails don't Match";
			validationsFlag = true;
		}
		
		if($scope.rgntel != "")
			telValidation = $scope.rgntel.match(/[a-zA-Z]/g);
		if(telValidation != null)
		{
			$scope.invTel = "Invalid Telephone number";
			validationsFlag = true;
		}
		if($scope.rgntel != "")
			if($scope.rgntel.length < 10 || $scope.rgntel.length >10)
			{
				$scope.invTel = "Invalid Telephone number";
				validationsFlag = true;
			}
		return validationsFlag;
	}
	
	$scope.clearInvMessages = function(){
		$scope.invFname = "";
		$scope.invLname = "";
		$scope.invPaswd = "";
		$scope.invEmail = "";
		$scope.invTel = "";
	}
	
	$scope.addUser = function($log){
		
		$scope.clearInvMessages();
		
		if(!$scope.applyValidations())
		{
		
			$http({
				method : "POST",
				url : '/register',
				data : {
					"username" : $scope.rgnEmail,
					"password" : $scope.rgnPaswd,
					"FirstName" : $scope.rgnFname,
					"LastName" : $scope.rgnLname,
					"Telephone" : $scope.rgntel
				}
			}).success(function(data) {
				if (data.flag == true) {
					$state.go('signin');
				}
				else
				{
									
					if(data.message != null)
					{
						$scope.invEmail = "";
						$scope.invEmail = data.message;
					}
						
					
				}
			}).error(function(error) {
				
				console.log("error");
			});
		}
		
	}
});