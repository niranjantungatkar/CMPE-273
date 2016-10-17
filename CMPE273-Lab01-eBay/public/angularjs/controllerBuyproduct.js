/**
 * http://usejsdoc.org/

 */
//Controller for buyproducts page
eBayApp.controller('controllerBuyproduct', function($scope,$http, $log, $state, userPrdpage, $stateParams){
	
	$scope.product_id = $stateParams.product_id;
	$scope.product_quantity = $scope.byprdQuant;
	$scope.qt = $scope.byprdQuant;
	$scope.product_detail ={};
	$scope.outofstock = false;
	$scope.removefromcart = false;
	$scope.cartProduct = {};
	$scope.actual_product_quantity = 0;
	
	$scope.cartproductsValid = {};
	
	///////////check if the user has signed in/////////
	if(userPrdpage.data.sessionUser != null)
	{
		$scope.user = userPrdpage.data.sessionUser;
	}
	else 
		$state.go('signin');
	
	//get the product details////////////////////
	$http({
		method : "POST",
		url : '/productdetails',
		data : {
			"product_id" : $scope.product_id
		}
	}).success(function(data) {
		$scope.product_detail = data;
		$scope.actual_product_quantity = data.product_quantity;
		
	}).error(function(error) {
		$log.info("Post call not working");
	});
	
	
	
	//add the item to cart after successful validations/////////////
	$scope.addItemtoCart = function(){
		
		var id = "AddToCart:"+$scope.product_id
		$scope.logInfoVisitor(id);
		
		
		//get the user's inputs
		var quant = document.getElementById('byprdqt');
		$scope.cartProduct.product_id = $scope.product_id;
		$scope.cartProduct.product_quantity = document.getElementById('byprdqt').value
		$scope.cartProduct.product_name = $scope.product_detail.product_name;
		$scope.cartProduct.product_desc = $scope.product_detail.product_desc;
		$scope.cartProduct.product_adv = $scope.product_detail.product_adv;
		$scope.cartProduct.product_seller_info = $scope.product_detail.product_seller_info;
		$scope.cartProduct.product_price = $scope.cartProduct.product_quantity*$scope.product_detail.product_price;
		
		//Check if the user has selected valid quantity
		if($scope.cartProduct.product_quantity == null || $scope.cartProduct.product_quantity == "" ||$scope.cartProduct.product_quantity == undefined)
		{
			alert("Select quantity");
			
		}
		else
		{
			//quant.max = $scope.actual_product_quantity - $scope.cartProduct.product_quantity;
			//$scope.actual_product_quantity = $scope.actual_product_quantity - $scope.cartProduct.product_quantity; 
			$scope.removefromcart = true;

			$http
			({
				method : "POST",
				url : '/getcart'
			}).success(function(data) {
				$scope.cartproductsValid = data;
				var prd_quantity = $scope.cartProduct.product_quantity ;
				
				for(var i = 0; i < $scope.cartproductsValid.length; i++)
				{
					if($scope.cartproductsValid[i].product_id == $scope.product_id)
						prd_quantity = parseFloat(prd_quantity) + parseFloat($scope.cartproductsValid[i].product_quantity)
			
				}
				
				if(parseFloat(prd_quantity) > parseFloat($scope.product_detail.product_quantity) )
				{
					alert("You can't add more!")
				}
				else
				{
					
					$http({
						method : "POST",
						url : '/addtocart',
						data : {
							"product_det" : $scope.cartProduct
						}
					}).success(function(data) {
						//$scope.product_detail = data;
						
					}).error(function(error) {
						$log.info("Post call not working");
					})
				}
				
			}).error(function(error) {
				$log.info("Post call not working");
			});
			
		}
	}

	$scope.removeProductFromcart = function(){
		
		var id = "RemoveProductFromCart:"+$scope.product_id
		$scope.logInfoVisitor(id);
		//var quant = document.getElementById('byprdqt');
		//$scope.actual_product_quantity = $scope.actual_product_quantity + $scope.cartProduct.product_quantity; 
		//quant.max = $scope.actual_product_quantity + $scope.cartProduct.product_quantity;
		$scope.removefromcart = false;
		
		$scope.outofstock = false;
		$http({
			method : "POST",
			url : '/removeproductcart',
			data : {
				"product_id" : $scope.cartProduct.product_id,
				"product_quantity" : $scope.cartProduct.product_quantity
			}
		}).success(function(data) {
			console.log("Product successfully removed");
			
		}).error(function(error) {
			$log.info("Post call not working");
		})
	}

	
	$scope.buyproduct = function(){
		
		var id = "BuyProduct:"+$scope.product_id
		$scope.logInfoVisitor(id);
		
		var quant = document.getElementById('byprdqt');
		$scope.cartProduct.product_id = $scope.product_id;
		$scope.cartProduct.product_quantity = document.getElementById('byprdqt').value
		$scope.cartProduct.product_name = $scope.product_detail.product_name;
		$scope.cartProduct.product_desc = $scope.product_detail.product_desc;
		$scope.cartProduct.product_adv = $scope.product_detail.product_adv;
		$scope.cartProduct.product_seller_info = $scope.product_detail.product_seller_info;
		$scope.cartProduct.product_price = $scope.cartProduct.product_quantity*$scope.product_detail.product_price;
		
		//Check if the user has selected valid quantity
		if($scope.cartProduct.product_quantity == null || $scope.cartProduct.product_quantity == "" ||$scope.cartProduct.product_quantity == undefined)
		{
			alert("Select quantity");
		}
		else
		{
			$http
			({
				method : "POST",
				url : '/getcart'
			}).success(function(data) {
				$scope.cartproductsValid = data;
				var prd_quantity = $scope.cartProduct.product_quantity ;
				
				for(var i = 0; i < $scope.cartproductsValid.length; i++)
				{
					if($scope.cartproductsValid[i].product_id == $scope.product_id)
					{
						prd_quantity = parseFloat(prd_quantity) + parseFloat($scope.cartproductsValid[i].product_quantity);
					}
						
				}
				
				if(parseFloat(prd_quantity) > parseFloat($scope.product_detail.product_quantity) )
				{
					alert("Please reduce the Quantity")
				}
				else
				{
					console.log("product can be added");
					$http({
						method : "POST",
						url : '/addtocart',
						data : {
							"product_det" : $scope.cartProduct
						}
					}).success(function(data) {
						//$scope.product_detail = data;
						$state.go('home.checkout');
					}).error(function(error) {
						$log.info("Post call not working");
					})
				}
				
			}).error(function(error) {
				$log.info("Post call not working");
			});
			
		}
		
	}
	
	
});