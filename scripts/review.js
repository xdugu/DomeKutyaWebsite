//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

var paypalObject, totalAsString;

var app = angular.module('myApp', []);
app.run(function() {
// Trigger input event on change to fix auto-complete
$('input, select').on('change',function() { $(this).trigger('input'); });
});
app.controller('Review', function($scope, $http) {
	$scope.order = localStorage.getObj("order");
	$scope.temp = {comments:""};
	
	$scope.backbone =  {showPaypalReceipt:false, showBank:false, showConfirmed:false, showPayLater:false};
	$scope.updatePaymentMethod = function(method){
		$scope.order = Shop_updatePaymentMethod(method);
			Shop_finishedShopping();
			localStorage.removeItem("user");
			$scope.createOrderCode();
			$scope.order['comments']=$scope.temp.comments;
			$scope.order.lang = localStorage.getObj("lang");
			$scope.order.requestType="SubmitOrder";
			$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://dj4flfnnla.execute-api.eu-central-1.amazonaws.com/testing/SubmitOrder',
				data: JSON.stringify($scope.order),
				headers: {'Content-Type': 'application/json'}
			});
		
	}
	
	$scope.createOrderCode = function (){
		let currDate = new Date();
		let str = currDate.getFullYear() + Common_pad(currDate.getMonth()+1) + Common_pad(currDate.getDate()) + $scope.order.contact.firstName;
		str = str.replace(" ", "");//remove all spaces
		$scope.order.orderCode = str;
	}
	
	$scope.backButtonPressed = function (){
		if( $scope.backbone.showConfirmed==true)
		{
			window.location.href = 'index.html';
		}
		else
		{
			$scope.backbone.showBank=false;
			$scope.backbone.showPayLater=false;
		}
			
	}
	
	$scope.confirmOrder = function(){
		
		
	}
  
});


	
	






