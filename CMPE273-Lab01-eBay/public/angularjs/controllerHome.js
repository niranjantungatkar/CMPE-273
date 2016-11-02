/**
 * http://usejsdoc.org/
 */
eBayApp.controller('controllerHome', function($scope,$http, $log, $state,userSession){
	
	$scope.checkVal = "";
	$scope.products = {};
	$scope.cartItemcount = 0;
	$scope.bidproducts = {};
	$scope.user = "";
	
	
	$scope.userSessionValid = function(){
		if(userSession.data.sessionUser != null)
		{
			$scope.user = userSession.data.sessionUser;
			return true;
		}
		else 
			return false;
	}
	
	$http
		({
			method : "POST",
			url : '/products'
		}).success(function(data) {
			$scope.products = data;
			$state.reload;
		}).error(function(error) {
			$log.info("Post call not working");
		});
	
	/*$http
	({
		method : "POST",
		url : '/bidproducts'
	}).success(function(data) {
		$scope.bidproducts = data;
		$state.reload;
	}).error(function(error) {
		$log.info("Post call not working");
	});*/
	
	$scope.buyProduct = function (product_id){
		
		$scope.logInfoVisitor("buydproduct:"+product_id);
		$state.go('home.buyProduct',{"product_id" : product_id})
	}
	
	$scope.bidProduct = function (product_id){
		
		$scope.logInfoVisitor("biddproduct: "+product_id)
		$state.go('home.bidProduct',{"product_id" : product_id})
	}

	$scope.logout = function(){
		$http
		({
			method : "POST",
			url : '/endsession'
		}).success(function(data){
			$state.go('signin');
		})
	}
	
	
	$scope.logInfoVisitor = function (clickid){
		var date = new Date();
		var user = "";
		var id = clickid;
		
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
				"user" : user,
				"id"	: id,
				"time": timestamp
			}				
		}).success(function(data)
				{
					
				})
				
				
		
	}
	
	
	

});