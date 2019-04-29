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
	$scope.shopping = localStorage.getObj("shopping");
	$scope.basketId = localStorage.getObj("basketId");
	$scope.order={};
	$scope.temp = {comments:""};
	
	$scope.backbone =  {showPaypalReceipt:false, showBank:false, showConfirmed:false, showPayLater:false};
	//////////////////////////////////////////////
	$scope.currency = shopping.currency;
	 $http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/Basket/GetBasket',
				data: JSON.stringify({basketId:$scope.basketId, includeCost: true, country:$scope.shopping.contact.country}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					let temp = res.data.data;
					$scope.order = temp.Item;
					$(".basket-num").html( temp.Item.Items.length);
				}
			});
	
	
	
	
	
	
	
	
	///////////////////////////////////////////////
	$scope.updatePaymentMethod = function(method){
		//$scope.order = Shop_updatePaymentMethod(method);
			//Shop_finishedShopping();
			//localStorage.removeItem("user");
			$scope.createOrderCode();
			$scope.shopping['comments']=$scope.temp.comments;
			$scope.shopping['basketId']= $scope.basketId;
			$scope.shopping['requestType']="SubmitOrder";
			$scope.shopping.paymentMethod = method;
			$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/SubmitOrder',
				data: JSON.stringify($scope.shopping),
				headers: {'Content-Type': 'application/json'}
			});
		
	}
	
	$scope.createOrderCode = function (){
		let currDate = new Date();
		let str = currDate.getFullYear() + Common_pad(currDate.getMonth()+1) + Common_pad(currDate.getDate()) + $scope.shopping.contact.firstName;
		let pos = str.search(" ");//We will take only the first or last name as part of the reference
		if(pos>0){
			str = str.substring(0,pos);
		}
		$scope.shopping.orderCode = str;
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


	
	






