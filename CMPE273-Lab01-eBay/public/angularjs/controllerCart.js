/**
 * http://usejsdoc.org/
 */
eBayApp.controller('controllerCart', function($scope,$http, $log, $state, userSession){
	
	$scope.cartproducts = [];
	$scope.cartTotal = 0;
	var total = 0;
	var total_num_items =0;
	$scope.total =0;
	$scope.total_num_items = 0;
	
	if(userSession.data.sessionUser != null)
	{
		$scope.user = userSession.data.sessionUser;
	}
	else 
		$state.go('signin');
	
	
	$scope.checkIfEmpty = function(){
		
		if($scope.cartproducts.length == 0 || $scope.cartproducts == null || $scope.cartproducts == undefined)
		{
			
			return true
		}
		else 
		{
			
			return false;
		}
	}

	
	$http
		({
			method : "POST",
			url : '/getcart'
		}).success(function(data) {
			if(data.flag != false)
			{
				$scope.cartproducts = data;
				if($scope.cartproducts == undefined)
					$scope.cartproducts = [];
				$scope.getCartSummary();
			}	
		}).error(function(error) {
			$log.info("Post call not working");
		});
		
	
	
		$scope.removeProductFromCart = function(product_id, product_quantity){
			
			
			var id = "RemoveProductCart:$"+$scope.total
			$scope.logInfoVisitor(id)
			
			$http({
				method : "POST",
				url : '/removeproductcart',
				data : {
					"product_id" : product_id,
					"product_quantity" : product_quantity
				}
			}).success(function(data) {
				

				$http
				({
					method : "POST",
					url : '/getcart'
				}).success(function(data) {
					$scope.cartproducts = {};
					$scope.cartproducts = data;
					$scope.getCartSummary();
					
			
				}).error(function(error) {
					$log.info("Post call not working");
				});
				
			}).error(function(error) {
				$log.info("Post call not working");
			})
			
		}

		
		$scope.getCartSummary = function(){
			$scope.total = 0;
			$scope.total_num_items =0;
			total = 0;
			total_num_items = 0;
			for(var i = 0; i <$scope.cartproducts.length; i++)
			{
				total = parseFloat(total) + parseFloat($scope.cartproducts[i].product_price);
				total_num_items = parseFloat(total_num_items) + parseFloat($scope.cartproducts[i].product_quantity);
			}
			
			$scope.total = total;
			$scope.total_num_items = total_num_items;
			
		}
		
		$scope.checkout = function(cartproducts){
			
			var id = "CartCheckout:$"+$scope.total
			$scope.logInfoVisitor(id)
			$state.go('home.checkout',{"cart" : cartproducts})
			
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
			})
					
					
			
		}
		
		
	

});