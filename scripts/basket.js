//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


var app = angular.module('myApp',[]);
app.controller('Basket', function($scope, $http) {
	$scope.order=[];//localStorage.getObj("order");
	$scope.currency = "EUR"
	$scope.basketId = localStorage.getObj("basketId");
	 $http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/Basket/GetBasket',
				data: JSON.stringify({basketId:$scope.basketId}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					let temp = JSON.parse(res.data.data);
					$scope.order = temp.Item.Items;
					$(".basket-num").html( temp.Item.Items.length);
				}
			});
	

	
	$scope.changeQuantity= function (index, direction){
		if($scope.order[index].Quantity + direction>=1){
		$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/Basket/ChangeQuantity',
				data: JSON.stringify({basketId:$scope.basketId, index: index, increment: direction}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					$scope.order = res.data.data;
				}
			});
		}
	}
	
	$scope.removeItem = function(index)
	{
		$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/Basket/RemoveItem',
				data: JSON.stringify({basketId:$scope.basketId, index: index}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					$scope.order = res.data.data;
					$(".basket-num").html(res.data.data.length);
				}
			});
	}
	
	$scope.updateDeliveryCost = function()
	{
		$scope.order=Shop_updateContact($scope.order.contact);
	}
	
	
	
});





