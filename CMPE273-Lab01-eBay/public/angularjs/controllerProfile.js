/**
 * http://usejsdoc.org/
 */
eBayApp.controller('controllerProfile', function($scope,$http, $log, $state,userSession){
	
	$scope.username = "";
	$scope.userDet = {};
	if(userSession.data.sessionUser != null)
	{
		$scope.username = userSession.data.sessionUser;
	}
	else 
		$state.go('signin');
	
	
	$scope.first_name = "";
	$scope.last_name = "";
	$scope.bday ="";
	$scope.email = $scope.username;
	$scope.telephone = ""
	$scope.address = "";
	$scope.about = "";
	$scope.bday2 = "";
	$scope.handle = "";
	
	
	$scope.invTel ="";
	$scope.invAdd = "";
	$scope.invBday = "";
	$scope.invFname = "";
	$scope.invLname = "";
	$scope.invAbt = "";
	
	console.log($scope.username);
	
	$http({
		method : "POST",
		url : '/getuserdetails',
		data : {
			"username" : $scope.username,
		}
	}).success(function(data) {
		if (data.flag == true) {
			$scope.userDet = data.user_det;
			var bday= "";

			$scope.first_name =  $scope.userDet.first_name;
			$scope.last_name = $scope.userDet.last_name;
			
			$scope.telephone = $scope.userDet.telephone
			if($scope.userDet.birthday != null)
				$scope.bday = $scope.userDet.birthday.substring(0,10);
			
			if($scope.userDet.location == null)
				$scope.address = "";
			else
				$scope.address = $scope.userDet.location
				
			if($scope.userDet.about == null)
				$scope.about = "";
			else
				$scope.about = $scope.userDet.about		
			
			
		}
		else
		{
			$state.go('home');
		}
	}).error(function(error) {
		
		console.log("error");
	});
	
	$scope.updateContact = function (){
		
		console.log("in cn funct")
		var telValidation = "";
		$scope.invTel = "";
		var validflag = true;
		
		if($scope.telephone != "")
			telValidation = $scope.telephone.match(/[a-zA-Z]/g);
		if(telValidation != null)
		{
			$scope.invTel = "Invalid Telephone number";
			validflag = false;

		}
		if($scope.telephone != "")
		{
			if($scope.telephone.length < 10 || $scope.telephone.length >10)
			{
				$scope.invTel = "Invalid Telephone number";
				validflag = false;
			}
		}
			
		if(validflag)
		{
			$http({
				method : "POST",
				url : '/updatecontact',
				data : {
					"username" : $scope.username,
					"telephone" : $scope.telephone
				}
			})
		}
		
	}
	
	
	$scope.updateAddress = function(){
		$scope.invAdd = "";
		if($scope.address != "")
		{
			$http({
				method : "POST",
				url : '/updateaddress',
				data : {
					"username" : $scope.username,
					"address" : $scope.address
				}
			})
		}
		else
		{
			$scope.invAdd = "Invalid Address";
		}
	}
	
	$scope.updatePersonalDet = function(){
		
		var fnameValidation ="";
		var lnameValidation ="";
		var validationsFlag = false
		
		$scope.invBday = "";
		$scope.invFname = "";
		$scope.invLname = "";
		
		if($scope.about == "" || $scope.about == null || $scope.about == undefined || $scope.about == " ")
		{
			validationsFlag = true;
			$scope.invAbt = "Invalid About"
		}
		if($scope.first_name == "" || $scope.first_name == null || $scope.first_name == undefined || $scope.first_name == " ")
		{
			validationsFlag = true;
			$scope.invFname = "Invalid First Name";
			
		}
			
		if($scope.last_name == "" || $scope.last_name == null || $scope.last_name == undefined || $scope.last_name == " ")
		{
			validationsFlag = true;
			$scope.invLname = "Invalid Last Name";
		}
		
		if($scope.first_name  != "")
			fnameValidation = $scope.first_name.match(/\d+/g);
		if($scope.last_name  != "")
			lnameValidation = $scope.last_name.match(/\d+/g);
		
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
		
		if($scope.bday2 == null || $scope.bday2 == undefined || $scope.bday2 == " " || $scope.bday2 == "")
		{
			$scope.invBday = "Invalid Birthday";
			validationsFlag = true;
		}
		
		if(!validationsFlag)
		{
			console.log("inside")
			$http({
				method : "POST",
				url : '/updatepersonaldetails',
				data : {
					"username" : $scope.username,
					"fname" : $scope.first_name,
					"lname" : $scope.last_name,
					"bday" : $scope.bday2,
					"about" : $scope.about,
					"handle" : $scope.handle
				}
			})
		}
		
	}
	
		
	
	

	
});