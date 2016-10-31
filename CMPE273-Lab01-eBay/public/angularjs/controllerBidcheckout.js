/**
 * http://usejsdoc.org/
 */
eBayApp.controller('controllerBidcheckout', function($scope,$http, $log, $state,userSession,$stateParams){
	
	
	$scope.product_detail = {};
	$scope.user = "";
	$scope.product_id = $stateParams.product_id;
	$scope.bicreditCardLname = "";
	
	$scope.bicreditCardFname = "";
	$scope.bicreditCardNumbmer = "";
	$scope.bicreditCardExp = "";
	$scope.bicreditCardCVV = "";
	
	if(userSession.data.sessionUser != null)
	{
		$scope.user = userSession.data.sessionUser;
	}
	else 
		$state.go('signin');
	
	
	$http({
		method : "POST",
		url : '/bidproductdetails',
		data : {
			"product_id" : $scope.product_id
		}
	}).success(function(data) {
		$scope.product_detail = data;
	});
	
	
	
	$scope.creditCardValidation = function(){
		var creditCarNumval = "";
		if($scope.bicreditCardNumbmer == "" || $scope.bicreditCardNumbmer == null || $scope.bicreditCardNumbmer == undefined || $scope.bicreditCardNumbmer == " ")
		{
			
			return false;
			
		}
		if($scope.bicreditCardNumbmer.length > 16 || $scope.bicreditCardNumbmer < 16)
		{
		
			return false;
		}
		creditCarNumval = $scope.bicreditCardNumbmer.match(/[a-zA-z]/g);
		if(creditCarNumval!= null)
		{
			
			return false;
		}
		
		if($scope.bicreditCardExp == "" || $scope.bicreditCardExp == null || $scope.bicreditCardExp == undefined || $scope.bicreditCardExp == " ")
		{
			
			return false;
		}
		else
		{
			
			var tdate = new Date();
			var crdExpDate = new Date($scope.bicreditCardExp);
			if( crdExpDate <= tdate)
			{
				return false;
			}
			
		}
		if($scope.bicreditCardCVV == "" || $scope.bicreditCardCVV == null || $scope.bicreditCardCVV == undefined || $scope.bicreditCardCVV == " ")
		{
			return false;
		}
		else
		{
			if($scope.bicreditCardCVV.length > 3 || $scope.bicreditCardCVV.length < 3)
			{
				return false;
			}
			if(!/\d{3}/.test($scope.bicreditCardCVV))
			{
				return false;
			}
		}
		if($scope.bicreditCardFname  == "" || $scope.bicreditCardFname  == null || $scope.bicreditCardFname  == undefined || $scope.bicreditCardFname  == " ")
		{
			return false;
		}
		
		if($scope.bicreditCardLname  == "" || $scope.bicreditCardLname  == null || $scope.bicreditCardLname  == undefined || $scope.bicreditCardLname  == " ")
		{
			return false;
		}
		return true;
		
	} 
	
	
$scope.checkoutBidProduct = function(){
	
	var id = "BidCheckout:"+$scope.product_id
	$scope.logInfoVisitor(id)
		
		if($scope.creditCardValidation())
		{
			$http({
				method : "POST",
				url : '/bidcheckout',
				data : {
					"product_id" : $scope.product_id,
					"product_name" : $scope.product_detail.product_name,
					"username" : $scope.user,
					"bid_amount" : $scope.product_detail.current_bid
				}
			}).success(function(data) {
				$state.go('home');
			})
			
		}
		else
		{
			alert("Credit Card Details Invalid");
		}
	
	
	}
	
});