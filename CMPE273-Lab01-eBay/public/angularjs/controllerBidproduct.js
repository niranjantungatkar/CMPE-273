/**
 * http://usejsdoc.org/
 */
eBayApp.controller('controllerBidproduct', function($scope,$http, $log, $state,userSession, $stateParams){
	
	$scope.product_id = $stateParams.product_id;
	$scope.product_detail ={};
	$scope.showBid = true;
	$scope.bidSubmitMessage = false;
	

	///////////check if the user has signed in/////////
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
		
		
	}).error(function(error) {
		$log.info("Post call not working");
	})
	
	$scope.bidproduct = function () {
		
		$scope.logInfoVisitor("SubmitBid:"+$scope.product_id);
		if(parseFloat($scope.bidamount) < parseFloat($scope.product_detail.current_bid))
			alert("You can't bid less than the current bid");
		else
		{
			$http({
				method : "POST",
				url : '/bid',
				data : {
					"product_id" : $scope.product_id,
					"product_name" : $scope.product_detail.product_name,
					"bidamount" : $scope.bidamount,
					"bidder" : $scope.user
				}
			}).success(function(data) {
				$scope.showBid = false;
				$scope.bidSubmitMessage = true;
			});
		}
	}
	
	

});