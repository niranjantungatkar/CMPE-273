/**
 * http://usejsdoc.org/
 */
eBayApp.controller('controllerSignin', function($scope,$http, $log, $state){
	
	$scope.sgnEmail = "";
	$scope.sgnPaswd = "";
	$scope.invMsg = "";
	
	$scope.checkValidLogin = function(){

		var id = "signin:"+$scope.sgnEmail
		$scope.logInfoVisitor(id);
		
		$http({
			method : "POST",
			url : '/signin',
			data : {
				"username" : $scope.sgnEmail,
				"password" : $scope.sgnPaswd
			}
		}).success(function(data) {
			if (data.flag == true) {
				
				$state.go('home');
			}
			else
			{
				
				$scope.sgnEmail = "Invalid Username";
				$scope.sgnPaswd = "";
				$scope.invMsg = "Invalid Username/Password"
			}
		}).error(function(error) {
			
			console.log("error");
		});
	}
	
	
	$scope.logInfoVisitor = function (clickid){
		var date = new Date();
		var user = "anonymous";
		var id = clickid;
		console.log(clickid);
		var timestamp = date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
		if($scope.user != null || $scope.user != undefined || $scope.user != "")
			user = $scope.user;
		else
			user = "anonymous"
		
		$http
		({
			method : "POST",
			url : '/loguserclick',
			data : {
				"user" : "anonymous",
				"id"	: id,
				"time": timestamp
			}				
		}).success(function(data)
				{
					
				})
	}

	
});