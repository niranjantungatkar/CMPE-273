/**
 * http://usejsdoc.org/
 */
eBayApp.controller('controllerSellproduct', function($scope,$http, $log, $state){
	
	
	$scope.bidSelected = false;
	$scope.prdFlag = true;
		
	$scope.prdName = "";
	$scope.prdCat = "";
	$scope.prdDesc = "";
	$scope.prdSeller = "";
	$scope.prdQuant = "";
	$scope.prdPrice = "";
	$scope.prdbidOpt = "";
	$scope.prdBidPrice = "";
	
	$scope.prdbidOpt ="";
	
	$scope.bidSelected = function(){
		if($scope.prdbidOpt == "yes")
		{
			return true;
		}
		else
			return false;
	}
	
	$scope.normalProduct = function(){
		if($scope.prdbidOpt == "yes")
		{	
			$scope.prdQuant = 1;
			return false;
		
		}
		else
			return true;
	}

	
	$scope.addProduct = function($log){
		
		var id = "sellproduct:"+$scope.prdName;
		$scope.logInfoVisitor(id)
		console.log($scope.user)
		
		$http({
			method : "POST",
			url : '/addproduct',
			data : {
				"product_name" : $scope.prdName,
				"product_category" : $scope.prdCat,
				"product_desc" : $scope.prdDesc,
				"product_seller_info" : $scope.prdSeller,
				"product_quantity" : $scope.prdQuant,
				"product_price" : $scope.prdPrice,
				"product_bid_flag" : $scope.prdbidOpt,
				"product_base_bid" : $scope.prdBidPrice
			}
		}).success(function(data) {
			if(data.flag == true)
			{
				
				$state.go('home');
			}
			
		}).error(function(error) {
			
			
		});
	}
	
	
	$scope.logInfoVisitor = function (clickid){
		var date = new Date();
		var user = "";
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
				"user" : user,
				"id"	: id,
				"time": timestamp
			}				
		}).success(function(data)
				{
					
				})
				
				
		
	}
	
	

	
});