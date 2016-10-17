eBayApp.controller('controllerCheckout', function($scope,$http, $log, $state,userSessionCheckout, $stateParams, cart){
	
	$scope.product_id_inv = "";
	$scope.message_inv = "";
	$scope.cartproductsValid = {};
	
	$scope.creditCardNumbmer = "";
	$scope.creditCardExp = "";
	$scope.creditCardCVV = "";
	$scope.creditCardFname = "";
	$scope.creditCardLname = "";
	
	$scope.totalItemsInCart = 0;
	$scope.totalAmount = 0;
	
	$scope.userSessionValid = function(){
		if(userSessionCheckout.data.sessionUser != null)
		{
			$scope.user = userSessionCheckout.data.sessionUser;
			
		}
		else 
			$state.go('signin');
	}
	
	$scope.cart = cart.data;

	for(var i = 0; i < $scope.cart.length; i++)
	{
		
		for(var j=i+1; j< $scope.cart.length; j++)
		{
			if($scope.cart[i].product_id == $scope.cart[j].product_id)
			{
				$scope.cart[i].product_quantity = parseFloat($scope.cart[j].product_quantity) + parseFloat($scope.cart[i].product_quantity);
				$scope.cart[i].product_price = parseFloat($scope.cart[j].product_price) + parseFloat($scope.cart[i].product_price);
				$scope.cart.splice(j,1);
			}
			else
			{
				continue;
			}
			
		}
	}
	$scope.restructuredCart = $scope.cart;
	
	$scope.updateSummary = function (){
		
		var totalItems = 0;
		var totalamount = 0;
		
		for(var i = 0; i < $scope.restructuredCart.length; i++)
		{
			
			totalItems = parseFloat($scope.restructuredCart[i].product_quantity) + parseFloat(totalItems);
			totalamount = parseFloat($scope.restructuredCart[i].product_price) + parseFloat(totalamount);
			$scope.totalItemsInCart = totalItems;
			$scope.totalAmount = totalamount;
		}
		
	}
	
	$scope.updateSummary();

	//update server cart with restructured cart
	$http({
		method : "POST",
		url : '/setcart',
		data : {
			"cart" : $scope.restructuredCart
			
		}
	}).success(function(data) {
		if(data.flag != true)
		{
			console.log("Unable to update the cart");
			
		}
		
	}).error(function(error) {
		$log.info("Post call not working");
	});
	
	
	$scope.removeProductFromCart = function(product_id){
		$scope.logInfoVisitor("RemoveProductFinalCheckout:"+product_id);
		$http({
			method : "POST",
			url : '/removeproductcheckoutcart',
			data : {
				"product_id" : product_id
			}
		}).success(function(data) {
		
			$http
			({
				method : "POST",
				url : '/getcart'
			}).success(function(data) {
				$scope.restructuredCart = {};
				$scope.restructuredCart = data;
				$scope.updateSummary();
		
			}).error(function(error) {
				$log.info("Post call not working");
			});
			$state.reload;
		}).error(function(error) {
			$log.info("Post call not working");
		})
		
	}
	
	
	$scope.creditCardValidation = function(){
		var creditCarNumval = "";
		if($scope.creditCardNumbmer == "" || $scope.creditCardNumbmer == null || $scope.creditCardNumbmer == undefined || $scope.creditCardNumbmer == " ")
		{
			
			return false;
			
		}
		if($scope.creditCardNumbmer.length > 16 || $scope.creditCardNumbmer < 16)
		{
		
			return false;
		}
		creditCarNumval = $scope.creditCardNumbmer.match(/[a-zA-z]/g);
		if(creditCarNumval!= null)
		{
			
			return false;
		}
		
		if($scope.creditCardExp == "" || $scope.creditCardExp == null || $scope.creditCardExp == undefined || $scope.creditCardExp == " ")
		{
			
			return false;
		}
		else
		{
			
			var tdate = new Date();
			var crdExpDate = new Date($scope.creditCardExp);
			if( crdExpDate <= tdate)
			{
				return false;
			}
			
		}
		if($scope.creditCardCVV == "" || $scope.creditCardCVV == null || $scope.creditCardCVV == undefined || $scope.creditCardCVV == " ")
		{
			return false;
		}
		else
		{
			if($scope.creditCardCVV.length > 3 || $scope.creditCardCVV.length < 3)
			{
				return false;
			}
			if(!/\d{3}/.test($scope.creditCardCVV))
			{
				return false;
			}
		}
		if($scope.creditCardFname  == "" || $scope.creditCardFname  == null || $scope.creditCardFname  == undefined || $scope.creditCardFname  == " ")
		{
			return false;
		}
		
		if($scope.creditCardLname  == "" || $scope.creditCardLname  == null || $scope.creditCardLname  == undefined || $scope.creditCardLname  == " ")
		{
			return false;
		}
		return true;
		
	} 
	
	$scope.checkout = function(){
		
		$scope.logInfoVisitor("FinalCheckout:$"+$scope.totalAmount);
		
		if($scope.creditCardValidation())
		{
			$http
			({
				method : "POST",
				url : '/checkout',
				data : {
					"cart" : $scope.restructuredCart
				}
			}).success(function(data) {
				if(data.valid == true)
				{
					
					$state.go('home')
				}
				else
				{
					
					$scope.product_id_inv = data.product_id;
					$scope.message_inv = data.message;
					
					
				}
			}).error(function(error) {
				$log.info("Post call not working");
			});
		}
		else
		{
			alert("Credit Card Details Invalid");
		}
		
	}
	
	$scope.updateCart = function(product_id){
		
		qtElement = document.getElementById(product_id);
		var changedProductQuantity = document.getElementById(product_id).value;
		
		if(changedProductQuantity === null || changedProductQuantity === "" || changedProductQuantity === undefined || changedProductQuantity === " ")
		{
			console.log("Empty");
		}
		else
		{
			
			$http({
				method : "POST",
				url : '/productdetails',
				data : {
					"product_id" : product_id
				}
			}).success(function(data) {
				var product_detail = data;
				var product_name = product_detail.product_name;
				if(changedProductQuantity > product_detail.product_quantity)
				{
					alert("Only "+product_detail.product_quantity+" "+product_name+" "+"available");
					for(var i = 0; i < $scope.restructuredCart.length ; i++ )
					{
						if($scope.restructuredCart[i].product_id == product_id)
						{
							
							qtElement.value = 1;
							$scope.restructuredCart[i].product_quantity = 1;
							$scope.restructuredCart[i].product_price = product_detail.product_price;
							
						}
					}
				}
				else
				{
					for(var i = 0; i < $scope.restructuredCart.length ; i++ )
					{
						if($scope.restructuredCart[i].product_id == product_id)
						{
							$scope.restructuredCart[i].product_quantity = changedProductQuantity;
							$scope.restructuredCart[i].product_price = parseFloat(changedProductQuantity)*parseFloat(product_detail.product_price);
							
						}
					}
				}
				$scope.updateSummary();
				$scope.setSessionCart();
			}).error(function(error) {
				$log.info("Post call not working");
			});
		}
			
	}
	
	$scope.setSessionCart = function (){
		$http({
			method : "POST",
			url : '/setcart',
			data : {
				"cart" : $scope.restructuredCart
				
			}
		}).success(function(data) {
			if(data.flag != true)
			{
				console.log("Unable to update the cart");
				
			}
			
		}).error(function(error) {
			$log.info("Post call not working");
		});
	}

});