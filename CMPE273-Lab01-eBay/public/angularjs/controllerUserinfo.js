/**
 * http://usejsdoc.org/
 */
eBayApp.controller('controllerUserinfo', function($scope,$http, $log, $state, user){
	
	$scope.user = "";
	$scope.user = user.data.sessionUser;
	$scope.userLastLogin = "";
	$scope.itmsforsale = {};
	$scope.itmsbought = {};
	$scope.totaItmsforSale = 0;
	$scope.userbids = {};
	$scope.totaluserbids = {};
	
	$http
	({
		method : "POST",
		url : '/userinfo',
		data : {"user" : $scope.user}
	}).success(function(data) {
		if(data.flag == true)
		{
			$scope.userLastLogin = data.last_login;
		}
	}).error(function(error) {
		$log.info("Post call not working");
	});

	
	$http
	({
		method : "POST",
		url : '/soldproducts',
		data : {"username" : $scope.user}
	}).success(function(data) {
		
		if(data.flag == true)
		{
			$scope.itmsforsale = data.items;
			$scope.totaItmsforSale = data.items.length;
		}
	}).error(function(error) {
		$log.info("Post call not working");
	});
	
	
	$http
	({
		method : "POST",
		url : '/boughtproducts',
		data : {"username" : $scope.user}
	}).success(function(data) {
		
		if(data.flag == true)
		{
			$scope.itmsbought = data.items;
		}
	}).error(function(error) {
		$log.info("Post call not working");
	});
	
	
	$http
	({
		method : "POST",
		url : '/userbids',
		data : {"username" : $scope.user}
	}).success(function(data) {
		
		if(data.flag == true)
		{
			$scope.userbids = data.items;
		}
	}).error(function(error) {
		$log.info("Post call not working");
	});
	
	
	
	$http
	({
		method : "POST",
		url : '/totaluserbids',
		data : {"username" : $scope.user}
	}).success(function(data) {
		
		if(data.flag == true)
		{
			$scope.totaluserbids = data.items;
		}
	}).error(function(error) {
		$log.info("Post call not working");
	});
	
	
	
	
	$scope.buyBidProduct = function (product_id){
		$state.go('home.checkoutbid',{"product_id" : product_id})
	}

});